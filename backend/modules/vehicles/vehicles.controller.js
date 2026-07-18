import vehicleService from './vehicles.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class VehicleController {
  create = catchAsync(async (req, res) => {
    const vehicle = await vehicleService.create(req.body);
    res.status(201).json(new ApiResponse(201, vehicle, 'Vehicle created successfully'));
  });
  getAll = catchAsync(async (req, res) => {
    const result = await vehicleService.getAll(req.query);
    res.status(200).json(new ApiResponse(200, result, 'Vehicles fetched successfully'));
  });
  getById = catchAsync(async (req, res) => {
    const vehicle = await vehicleService.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, vehicle, 'Vehicle fetched successfully'));
  });
  update = catchAsync(async (req, res) => {
    const vehicle = await vehicleService.update(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, vehicle, 'Vehicle updated successfully'));
  });
  delete = catchAsync(async (req, res) => {
    await vehicleService.delete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Vehicle deleted successfully'));
  });
}
export default new VehicleController();
