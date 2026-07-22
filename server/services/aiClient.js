import axios from "axios";

const aiClient = axios.create({
    baseURL: process.env.AI_ENGINE_URL,
    timeout: 120000,
});

export default aiClient;