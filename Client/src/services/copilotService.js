import api from "./api";

export const getSuggestedQueries = async () => {
  const res = await api.get("/copilot/suggested-queries");
  return res.data.suggestedQueries;
};

export const getInitialMessage = async () => {
  const res = await api.get("/copilot/welcome-message");
  return res.data.message;
};

export const askCopilot = async (query, sessionId) => {
  const res = await api.post("/copilot/ask", { query, sessionId });
  // Merge the top-level orchestrator fields (nextSuggestions, type,
  // metadata) into the answer object so callers get one flat shape to
  // render from. metadata.sessionId is what the caller needs to persist
  // and resend on the next call to keep the conversation continuous.
  return {
    ...res.data.answer,
    type: res.data.type,
    nextSuggestions: res.data.nextSuggestions,
    metadata: res.data.metadata,
  };
};
