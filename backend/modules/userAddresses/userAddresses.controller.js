import addressService from './userAddresses.service.js';
import catchAsync from '../../utils/catchAsync.js';

class UserAddressesController {
  create = catchAsync(async (req, res) => {
    const address = await addressService.createAddress(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  });

  getAll = catchAsync(async (req, res) => {
    const addresses = await addressService.getAddresses(req.user.id);
    res.status(200).json({
      success: true,
      data: addresses
    });
  });

  getById = catchAsync(async (req, res) => {
    const address = await addressService.getAddressById(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      data: address
    });
  });

  update = catchAsync(async (req, res) => {
    const address = await addressService.updateAddress(req.params.id, req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  });

  delete = catchAsync(async (req, res) => {
    await addressService.deleteAddress(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  });
}

export default new UserAddressesController();
