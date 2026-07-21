import aiClient from "./aiClient.js";

export const askCopilot = async (query) => {
  try {
    const { data } = await aiClient.post("/rag/ask", {
      query,
    });

    return data;

  } catch (error) {

    console.error("Copilot Error:");

    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    throw new Error("Failed to communicate with AI Copilot.");
  }
};