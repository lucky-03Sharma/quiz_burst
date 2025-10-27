import numpy as np
import pandas as pd
from scipy import stats
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
from rich.console import Console
from rich.panel import Panel
import torch
import subprocess
import platform
from pathlib import Path
from rich.markdown import Markdown
import seaborn as sns
import os
from datetime import datetime

class StatisticsService:
    def __init__(self, output_dir="analytics"):
        self.output_dir = output_dir
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def calculate_player_skill(self, player_data):
        df = pd.DataFrame(player_data)
        df["accuracy"] = df["correct"] / df["attempted"]
        df["skill_index"] = (df["accuracy"] * 0.7 + (1 - df["avg_time"] / df["avg_time"].max()) * 0.3) * 100
        df["zscore"] = stats.zscore(df["skill_index"])
        return df[["name", "accuracy", "skill_index", "zscore"]]

    def predict_future_scores(self, past_scores):
        X = np.arange(len(past_scores)).reshape(-1, 1)
        y = np.array(past_scores)
        model = LinearRegression().fit(X, y)
        future = np.arange(len(past_scores), len(past_scores) + 5).reshape(-1, 1)
        preds = model.predict(future)
        mse = mean_squared_error(y, model.predict(X))
        return preds.tolist(), mse

    def cluster_players(self, player_data, n_clusters=3):
        df = pd.DataFrame(player_data)
        scaler = StandardScaler()
        features = scaler.fit_transform(df[["accuracy", "avg_time"]])
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        df["cluster"] = kmeans.fit_predict(features)
        return df

    def generate_visual_report(self, player_data, quiz_name="quiz"):
        df = pd.DataFrame(player_data)
        plt.figure(figsize=(8,6))
        sns.scatterplot(x="avg_time", y="accuracy", hue="name", data=df, s=100)
        plt.title(f"Performance Overview - {quiz_name}")
        plt.xlabel("Average Time per Question (s)")
        plt.ylabel("Accuracy (%)")
        plt.tight_layout()
        path = os.path.join(self.output_dir, f"{quiz_name}_stats_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png")
        plt.savefig(path)
        plt.close()
        return path

    def compare_groups(self, group_a, group_b):
        arr1 = np.array(group_a)
        arr2 = np.array(group_b)
        t_stat, p_val = stats.ttest_ind(arr1, arr2)
        return {"t_stat": float(t_stat), "p_value": float(p_val)}

if __name__ == "__main__":
    data = [
        {"name": "Alice", "correct": 18, "attempted": 20, "avg_time": 4.2},
        {"name": "Bob", "correct": 15, "attempted": 20, "avg_time": 5.1},
        {"name": "Charlie", "correct": 19, "attempted": 20, "avg_time": 3.8},
        {"name": "Diana", "correct": 17, "attempted": 20, "avg_time": 4.5}
    ]

    service = StatisticsService()
    skills = service.calculate_player_skill(data)
    print(skills)

    preds, mse = service.predict_future_scores([80, 85, 87, 90, 92])
    print("Predicted scores:", preds)
    print("MSE:", mse)

    clustered = service.cluster_players(data)
    print(clustered)

    img = service.generate_visual_report(data, "JS_Quiz")
    print("Visualization saved at:", img)

    result = service.compare_groups([80, 85, 90], [70, 75, 65])
    print(result)
