import mongoose from "mongoose";

/**
 * Persists Copilot/Orchestrator conversation memory so a user's session
 * survives server restarts and works across multiple server instances
 * (unlike an in-process Map). Mirrors the "conversation" concept from
 * VS Code Copilot: a rolling window of turns plus a small amount of
 * derived state (current topic, referenced documents) that the
 * orchestrator can use to resolve follow-up queries like "what about its
 * last incident?" without the caller having to resend full history.
 */
const messageSchema = new mongoose.Schema(
    {
        role: { type: String, enum: ["user", "ai"], required: true },
        text: { type: String, required: true },
        intent: { type: String, default: null },
        documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    },
    { timestamps: true, _id: false }
);

const conversationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        sessionId: { type: String, required: true, index: true },
        currentTopic: { type: String, default: null },
        referencedDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
        // Bounded rolling window; conversationManager trims this on write so
        // the document never grows unbounded.
        messages: { type: [messageSchema], default: [] },
        lastActivityAt: { type: Date, default: Date.now, index: true },
    },
    { timestamps: true }
);

conversationSchema.index({ user: 1, sessionId: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);
