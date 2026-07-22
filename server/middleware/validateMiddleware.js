import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

/**
 * Place after an array of express-validator check(...) chains.
 * Collects any validation failures and forwards a single 400 ApiError.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const details = errors.array().map((e) => ({
            field: e.path,
            message: e.msg,
        }));

        return next(new ApiError(400, "Validation failed", details));
    }

    next();
};

export default validate;
