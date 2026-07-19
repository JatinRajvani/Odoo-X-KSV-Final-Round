import sdService from './securityDeposits.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class SecurityDepositController {
  create = catchAsync(async (req, res) => {
    const deposit = await sdService.create(req.body, req.user);
    res.status(201).json(new ApiResponse(201, deposit, 'Security deposit recorded successfully'));
  });

  getAll = catchAsync(async (req, res) => {
    const result = await sdService.getAll(req.query, req.user);
    res.status(200).json(new ApiResponse(200, result, 'Security deposits fetched successfully'));
  });

  getById = catchAsync(async (req, res) => {
    const deposit = await sdService.getById(req.params.id, req.user);
    res.status(200).json(new ApiResponse(200, deposit, 'Security deposit fetched successfully'));
  });

  update = catchAsync(async (req, res) => {
    const deposit = await sdService.update(req.params.id, req.body, req.user);
    res.status(200).json(new ApiResponse(200, deposit, 'Security deposit updated successfully'));
  });

  refund = catchAsync(async (req, res) => {
    const result = await sdService.processRefund(req.params.id, req.body, req.user);
    res.status(200).json(new ApiResponse(200, result, 'Deposit refunded successfully'));
  });
}

export default new SecurityDepositController();
