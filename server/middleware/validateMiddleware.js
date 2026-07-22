import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("========== VALIDATION FAILED ==========");
        console.log("Request Body:", req.body);
        console.log("Validation Errors:", errors.array());

        const details = errors.array().map((e) => ({
            field: e.path,
            message: e.msg,
            value: e.value
        }));

        return next(new ApiError(400, "Validation failed", details));
    }

    next();
};

export default validate;