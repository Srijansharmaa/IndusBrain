import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
{
    filename: {
        type: String,
        required: true
    },

    originalName: {
        type: String,
        required: true
    },

    filePath: {
        type: String,
        required: true
    },

    fileType: String,

    fileSize: Number,

    chunkCount: Number,

    analysis: {
        type: Object,
        default: {}
    },

    status: {
        type: String,
        enum: ["processing", "completed", "failed"],
        default: "processing",
        index: true
    },

    statusMessage: {
        type: String,
        default: null
    },

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }

},
{
    timestamps: true
}
);

documentSchema.index({ originalName: "text" });
documentSchema.index({ createdAt: -1 });

export default mongoose.model("Document", documentSchema);