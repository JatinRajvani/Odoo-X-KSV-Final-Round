import addressRepo from './userAddresses.repository.js';
import ApiError from '../../utils/ApiError.js';

class UserAddressesService {
  async createAddress(userId, data) {
    const existing = await addressRepo.findAllByUserId(userId);
    
    // Force default if it is the first address
    let isDefault = data.isDefault || false;
    if (existing.length === 0) {
      isDefault = true;
    }

    if (isDefault) {
      await addressRepo.unsetDefaultsForUser(userId);
    }

    return addressRepo.create({
      ...data,
      userId,
      isDefault
    });
  }

  async getAddresses(userId) {
    return addressRepo.findAllByUserId(userId);
  }

  async getAddressById(id, userId) {
    const address = await addressRepo.findById(id);
    if (!address) throw new ApiError(404, 'Address not found');
    if (address.userId !== userId) throw new ApiError(403, 'Access denied to this address');
    return address;
  }

  async updateAddress(id, userId, data) {
    const address = await this.getAddressById(id, userId);

    if (data.isDefault) {
      await addressRepo.unsetDefaultsForUser(userId);
    }

    return addressRepo.update(id, data);
  }

  async deleteAddress(id, userId) {
    const address = await this.getAddressById(id, userId);
    
    await addressRepo.delete(id);

    // If deleted address was default, make the next available address the default
    if (address.isDefault) {
      const remaining = await addressRepo.findAllByUserId(userId);
      if (remaining.length > 0) {
        await addressRepo.update(remaining[0].id, { isDefault: true });
      }
    }

    return true;
  }
}

export default new UserAddressesService();
