import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const processDocument = async (file) => {
  try {
    const AI_ENGINE_URL = process.env.AI_ENGINE_URL;

    console.log("========== DEBUG ==========");
    console.log("AI_ENGINE_URL:", AI_ENGINE_URL);
    console.log("File path:", file.path);
    console.log("File exists:", fs.existsSync(file.path));
    console.log("Final URL:", `${AI_ENGINE_URL}/process-document`);

    const formData = new FormData();

    formData.append(
      "file",
      fs.createReadStream(file.path),
      file.originalname
    );

    const response = await axios.post(
      `${AI_ENGINE_URL}/process-document`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return response.data;

  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};