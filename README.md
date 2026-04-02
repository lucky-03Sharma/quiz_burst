# Quiz -burst Real -Time Multiplayer Quiz Application  with Adaptive Gameplay

> **Abstract** : QuizBurst is a full-stack web application that allows users to create and host real-time multiplayer quizzes, where participants can join using a unique game code and compete in a live, timed environment. Unlike traditional quiz platforms, it includes features like adaptive difficulty, anti-cheating tools (tab switch detection, shuffled options), multimedia questions (text, image, audio), blind leaderboard mode, and instant explanations after each question. Players don’t need to log in, and hosts can access performance analytics and export results. Built with React.js, Node.js, Socket.io, and MongoDB/Firebase, QuizBurst blends learning and fun into an engaging, responsive web platform.

### Project Members
1. SAROJ SHRUTI SANTOSH  [ Team Leader ] 
2. SHARMA LUCKY KUNJ BIHARI 
3. SHAIKH TASNEEM AZHARUL 
4. TANVAR MOHMAD ANAS YUNUS 

### Project Guides
1. PROF. RAMYA PRABHAKARAN  [ Primary Guide ] 

### Run locally (development)

1. **MongoDB:** Create a cluster (MongoDB Atlas) and copy a connection string.
2. **Backend:** From `backend/`, copy `.env.example` to `.env` and set `ATLAS_URL` and optional `PORT` (default `5000`).
3. **Backend install & start:**
   - `cd backend`
   - `npm install`
   - `node server.js`  
   The API is served at `http://localhost:5000/api/quiz`.
4. **Frontend:** From `frontend/`:
   - `npm install`
   - `npm run dev`  
   Open the URL shown (usually `http://127.0.0.1:5173`).
5. **Flow:** On the home page use **Create quiz & host** to save a quiz, then host a session; players join with the game code.

### Deployment Steps (production)
Build the frontend with `npm run build` inside `frontend/`, deploy the `dist/` output to static hosting, and set the frontend API base if the backend URL is not `http://localhost:5000` (see `frontend/src/config/api.js`).

### Subject Details
- Class : TE (COMP) Div A - 2025-2026
- Subject : Mini Project : 2A (MP2A(P)(2019))
- Project Type : Mini Project

### Platform, Libraries and Frameworks used
1. [NodeJS](https://nodejs.org)
2. [ExpressJS](https://expressjs.org)
3. [TensorFlow](https://tensorflowjs.com)

### Dataset Used
1. [Kaggle Dataset 1](https://kaggle.com/dataset1)
2. [Kaggle Dataset 2](https://kaggle.com/dataset2)

### References
- [https://kaggle.com/dataset1](https://kaggle.com/dataset1)
- [https://kaggle.com/dataset1](https://kaggle.com/dataset1)
