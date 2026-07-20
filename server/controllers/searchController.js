import axios from "axios";

export const semanticSearch = async (req, res) => {

    try {

        const response = await axios.post(
            `${process.env.AI_ENGINE_URL}/search`,
            req.body
        );

        res.json(response.data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Search failed."
        });

    }

};