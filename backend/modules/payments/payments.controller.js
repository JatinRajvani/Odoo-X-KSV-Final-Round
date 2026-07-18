import pService from './payments.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class PaymentController {
  create = catchAsync(async (req, res) => {
    const result = await pService.processPayment(req.body);
    res.status(201).json(new ApiResponse(201, result, 'Payment recorded successfully'));
  });
  getAll = catchAsync(async (req, res) => {
    const result = await pService.getAll(req.query);
    res.status(200).json(new ApiResponse(200, result, 'Payments fetched successfully'));
  });
  getById = catchAsync(async (req, res) => {
    const payment = await pService.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, payment, 'Payment fetched successfully'));
  });
  updateStatus = catchAsync(async (req, res) => {
    const payment = await pService.updateStatus(req.params.id, req.body.status);
    res.status(200).json(new ApiResponse(200, payment, 'Payment status updated successfully'));
  });
  delete = catchAsync(async (req, res) => {
    await pService.delete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Payment deleted successfully'));
  });
}
export default new PaymentController();
