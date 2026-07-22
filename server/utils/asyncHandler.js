/**
 * Wraps an async route handler so any rejected promise / thrown error is
 * forwarded to Express's `next(err)` instead of needing a try/catch in
 * every single controller.
 *
 * Usage: router.get("/", asyncHandler(getDocuments));
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
