export const SAMPLE_QUERIES = [
  "Why did Pump P101 fail last week?",
  "What is the compliance status of Tank T-11?",
  "Summarize recent incidents at Jamnagar Zone 3",
];

export const AI_ANSWER = {
  text: "Pump P101 failed due to progressive bearing degradation (B-204) caused by lubrication breakdown under sustained high-load cycling. Vibration data from Motor M-12 showed rising amplitude over six months, consistent with bearing wear. The failure triggered Incident INC-2291, documented in Maintenance Report MR-0091 by S. Verma, with Recommendation REC-114 issued to add continuous vibration monitoring and shorten lubrication intervals.",
  confidence: 94,
  sources: ["Maintenance Report MR-0091", "Motor M-12 Vibration Trend Analysis", "SOP-0044"],
  actions: ["Schedule bearing inspection for Pump P101", "Reduce lubrication interval to 30 days", "Enable continuous vibration monitoring"],
};

export const INITIAL_COPILOT_MESSAGE = {
  role: "ai",
  text: "Hi, I'm your Knowledge Copilot. Ask me anything about equipment, incidents, compliance or documents across your plant.",
};
