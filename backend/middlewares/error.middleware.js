import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export function errorHandler(err, req, res, next) {
    if (res.headerSent) return next(err);

    if (err instanceof ApiError) {
        return res
            .status(err.statusCode || 500)
            .json(new ApiResponse(err.statusCode || 500, err.data || null, err.message));
    }

    console.error(err);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
}