import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!(err instanceof ApiError)) {
    statusCode = statusCode || 500;
    message = message || 'Internal Server Error';
  }

  res.status(statusCode).json(new ApiResponse(statusCode, null, message));
};
