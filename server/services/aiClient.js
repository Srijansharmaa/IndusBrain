<<<<<<< HEAD
=======
import "dotenv/config";
>>>>>>> ab86b5c (Update project)
import axios from "axios";

const aiClient = axios.create({
    baseURL: process.env.AI_ENGINE_URL,
    timeout: 120000,
});

export default aiClient;