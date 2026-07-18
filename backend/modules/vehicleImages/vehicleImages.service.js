import vImageRepository from './vehicleImages.repository.js';
import vehicleRepository from '../vehicles/vehicles.repository.js';
import ApiError from '../../utils/ApiError.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class VehicleImageService {
  async uploadImage(vehicleId, file, isPrimaryStr) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');
    
    if (!file) throw new ApiError(400, 'Image file is required');
    
    const isPrimary = isPrimaryStr === 'true';

    // Upload to cloudinary via stream
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'driveease/vehicles' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(file.buffer);
    });

    if (isPrimary) {
      await vImageRepository.unsetPrimary(vehicleId);
    }

    return vImageRepository.create({
      vehicleId,
      imageUrl: uploadResult.secure_url,
      isPrimary
    });
  }

  async getImages(vehicleId) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');
    return vImageRepository.findByVehicle(vehicleId);
  }

  async setPrimary(id) {
    const image = await vImageRepository.findById(id);
    if (!image) throw new ApiError(404, 'Image not found');
    
    await vImageRepository.unsetPrimary(image.vehicleId);
    return vImageRepository.setPrimary(id);
  }

  async deleteImage(id) {
    const image = await vImageRepository.findById(id);
    if (!image) throw new ApiError(404, 'Image not found');

    // Extract public_id from url
    const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId).catch(console.error);

    await vImageRepository.delete(id);
    return true;
  }
}
export default new VehicleImageService();
