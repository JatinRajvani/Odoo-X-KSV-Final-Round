import sService from './settings.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';
class SettingsController {
  getSettings = catchAsync(async (req, res) => {
    const data = await sService.getSettings();
    res.status(200).json(new ApiResponse(200, data, 'Settings fetched successfully'));
  });
  updateSettings = catchAsync(async (req, res) => {
    const data = await sService.updateSettings(req.body);
    res.status(200).json(new ApiResponse(200, data, 'Settings updated successfully'));
  });
}
export default new SettingsController();
