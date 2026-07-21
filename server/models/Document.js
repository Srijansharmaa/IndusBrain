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

export default mongoose.model("Document", documentSchema);