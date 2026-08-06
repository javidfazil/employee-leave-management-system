// Wraps an async route/middleware handler so any rejected promise or thrown
// error is forwarded to Express's centralized error handler, instead of
// requiring a try/catch block in every controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
