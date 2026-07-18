import vImageService from './vehicleImages.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class VehicleImageController {
  upload = catchAsync(async (req, res) => {
    const image = await vImageService.uploadImage(req.params.vehicleId, req.file, req.body.isPrimary);
    res.status(201).json(new ApiResponse(201, image, 'Image uploaded successfully'));
  });
  getImages = catchAsync(async (req, res) => {
    const images = await vImageService.getImages(req.params.vehicleId);
    res.status(200).json(new ApiResponse(200, images, 'Images fetched successfully'));
  });
  setPrimary = catchAsync(async (req, res) => {
    const image = await vImageService.setPrimary(req.params.id);
    res.status(200).json(new ApiResponse(200, image, 'Primary image updated successfully'));
  });
  delete = catchAsync(async (req, res) => {
    await vImageService.deleteImage(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Image deleted successfully'));
  });
}
export default new VehicleImageController();
