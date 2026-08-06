const notFound = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (error, req, res, next) => {
  void next;
  const statusCode = error.statusCode || (error.code === 11000
    ? 409
    : res.statusCode >= 400
      ? res.statusCode
      : 500);

  res.status(statusCode).json({
    message: error.message || "Internal server error",
  });
};

export { errorHandler, notFound };
