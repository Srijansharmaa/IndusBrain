import api from "./api";

export const getSuggestedQueries = async () => {
  const res = await api.get("/copilot/suggested-queries");
  return res.data.suggestedQueries;
};

export const getInitialMessage = async () => {
  const res = await api.get("/copilot/welcome-message");
  return res.data.message;
};

export const askCopilot = async (query) => {
  const res = await api.post("/copilot/ask", { query });
  // Merge the top-level orchestrator fields (nextSuggestions, type) into
  // the answer object so callers get one flat shape to render from.
  return {
    ...res.data.answer,
    type: res.data.type,
    nextSuggestions: res.data.nextSuggestions,
  };
};
