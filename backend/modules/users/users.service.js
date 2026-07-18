import userRepository from './users.repository.js';
import ApiError from '../../utils/ApiError.js';

class UserService {
  async getProfile(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  async updateProfile(id, data) {
    return userRepository.update(id, data);
  }

  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');
    await userRepository.delete(id);
    return true;
  }
}

export default new UserService();
