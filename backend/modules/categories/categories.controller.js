import categoryService from './categories.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class CategoryController {
  create = catchAsync(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
  });
  getAll = catchAsync(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
  });
  getById = catchAsync(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(new ApiResponse(200, category, 'Category fetched successfully'));
  });
  update = catchAsync(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
  });
  delete = catchAsync(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
  });
}
export default new CategoryController();
