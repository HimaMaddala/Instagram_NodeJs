import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import PostsModel from './models/posts.js';
import FeedsModel from './models/feeds.js';
import jsonfile from 'jsonfile';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
mongoose.connect('mongodb://127.0.0.1:27017/instagram');

// Function to fetch scores from scores.json file
const fetchScores = () => {
    const scoresFilePath = '../pythonserver/scores.json';
    return jsonfile.readFileSync(scoresFilePath);
};

// Define the /posts endpoint
app.get('/posts', async (req, res) => {
    try {
        const insta_posts = await PostsModel.find();
        res.json(insta_posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Define the /feed endpoint
app.get('/feed', async (req, res) => {
    try {
        // Fetch updated scores
        const scores = fetchScores();

        // Calculate proportions based on scores
        const totalScore = Object.values(scores).reduce((acc, score) => acc + score, 0);
        const proportions = {};
        for (const [category, score] of Object.entries(scores)) {
            proportions[category] = score / totalScore;
        }

        // Fetch posts for each category based on proportions
        const numPosts = 8; // Total number of posts to display
        const posts = [];
        for (const category in proportions) {
            const numPostsForCategory = Math.ceil(proportions[category] * numPosts);
            const postsForCategory = await FeedsModel.find({ category: category }).limit(numPostsForCategory);
            posts.push(...postsForCategory);
        }

        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3001, () => {
    console.log("Server is Running");
});
