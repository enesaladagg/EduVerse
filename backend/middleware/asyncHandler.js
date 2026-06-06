/**
 * Express async route wrapper.
 *
 * Any rejected promise or thrown error is forwarded to the global
 * errorHandler middleware. This keeps route files clean and prevents
 * unhandled promise rejections in production.
 */
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
