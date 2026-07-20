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

    chunkCount: Number,

    analysis: {
        type: Object,
        default: {}
    }

},
{
    timestamps: true
}
);

export default mongoose.model("Document", documentSchema);