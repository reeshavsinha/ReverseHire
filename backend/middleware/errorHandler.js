export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, req, res, _next) {
  console.error(error);
  const status = error.statusCode ?? 500;
  res.status(status).json({
    success: false,
    message: error.message ?? "Something went wrong",
  });
}
