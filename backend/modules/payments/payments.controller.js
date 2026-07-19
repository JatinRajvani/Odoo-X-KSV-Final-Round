import pService from './payments.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class PaymentController {
  create = catchAsync(async (req, res) => {
    const payment = await pService.createPayment(req.body, req.user);
    res.status(201).json(new ApiResponse(201, payment, 'Payment initialized successfully'));
  });

  pay = catchAsync(async (req, res) => {
    const payment = await pService.processPayment(req.params.id, req.body, req.user);
    res.status(200).json(new ApiResponse(200, payment, 'Payment completed successfully'));
  });

  getAll = catchAsync(async (req, res) => {
    const result = await pService.getAll(req.query, req.user);
    res.status(200).json(new ApiResponse(200, result, 'Payments fetched successfully'));
  });

  getById = catchAsync(async (req, res) => {
    const payment = await pService.getById(req.params.id, req.user);
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
