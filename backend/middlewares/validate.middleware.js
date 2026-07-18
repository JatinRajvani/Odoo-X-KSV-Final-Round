import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const validate = (schema) => catchAsync(async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    throw new ApiError(400, error.errors.map(e => e.message).join(', '));
  }
});
