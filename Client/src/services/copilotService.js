import { AI_ANSWER, INITIAL_COPILOT_MESSAGE, SAMPLE_QUERIES } from "../constants/copilotData";

// TODO(backend): replace with `axios.get("/api/copilot/suggested-queries")`
export const getSuggestedQueries = async () => SAMPLE_QUERIES;

// TODO(backend): replace with `axios.get("/api/copilot/welcome-message")`
export const getInitialMessage = async () => INITIAL_COPILOT_MESSAGE;

// TODO(backend): replace with `axios.post("/api/copilot/ask", { query })`
export const askCopilot = async (query) => AI_ANSWER;
