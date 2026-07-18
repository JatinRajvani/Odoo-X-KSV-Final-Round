import pService from './penalties.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class PenaltyController {
  create = catchAsync(async (req, res) => {
    const result = await pService.create(req.body);
    res.status(201).json(new ApiResponse(201, result, 'Penalty created successfully'));
  });
  
  calculate = catchAsync(async (req, res) => {
    const result = await pService.calculateAutomaticPenalties(req.body.rentalOrderId);
    res.status(200).json(new ApiResponse(200, result, 'Automatic penalties calculated successfully'));
  });

  checkClosure = catchAsync(async (req, res) => {
    const closed = await pService.checkAndCloseRental(req.params.rentalOrderId);
    res.status(200).json(new ApiResponse(200, { closed }, closed ? 'Rental marked as fully completed/closed' : 'Rental has outstanding balances or returns'));
  });

  getAll = catchAsync(async (req, res) => {
    const result = await pService.getAll(req.query);
    res.status(200).json(new ApiResponse(200, result, 'Penalties fetched successfully'));
  });
  
  getById = catchAsync(async (req, res) => {
    const penalty = await pService.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, penalty, 'Penalty fetched successfully'));
  });
  
  update = catchAsync(async (req, res) => {
    const penalty = await pService.update(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, penalty, 'Penalty updated successfully'));
  });
  
  delete = catchAsync(async (req, res) => {
    await pService.delete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Penalty deleted successfully'));
  });
}
export default new PenaltyController();
