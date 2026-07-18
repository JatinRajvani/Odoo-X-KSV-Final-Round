import sRepo from './settings.repository.js';
import ApiError from '../../utils/ApiError.js';
class SettingsService {
  async getSettings() {
    const settings = await sRepo.get();
    if (!settings) throw new ApiError(404, 'Settings not found');
    return settings;
  }
  async updateSettings(data) {
    const settings = await sRepo.get();
    if (!settings) throw new ApiError(404, 'Settings not found');
    return sRepo.update(settings.id, data);
  }
}
export default new SettingsService();
