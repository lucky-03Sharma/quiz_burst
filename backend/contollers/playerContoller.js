import Game from "../models/game.js";

export const addPlayer = async (req, res) => {
    try {
        const { code } = req.params;
        const { playerName } = req.body;
        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ message: "Game not found" });

        const player = { name: playerName, score: 0, joinedAt: new Date() };
        game.players.push(player);
        await game.save();

        res.status(200).json({ message: "Player joined", player });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateScore = async (req, res) => {
    try {
        const { code } = req.params;
        const { playerName, delta } = req.body;
        const game = await Game.findOne({ gameCode: code });
        if (!game) return res.status(404).json({ message: "Game not found" });

        const player = game.players.find((p) => p.name === playerName);
        if (player) {
            player.score += delta;
            await game.save();
            res.status(200).json({ message: "Score updated", player });
        } else {
            res.status(404).json({ message: "Player not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
