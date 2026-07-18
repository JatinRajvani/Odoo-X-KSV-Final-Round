import qService from './quotations.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class QuotationController {
  generate = catchAsync(async (req, res) => {
    const result = await qService.generateQuotation(req.params.rentalOrderId);
    res.status(201).json(new ApiResponse(201, result, 'Quotation generated successfully'));
  });
  getById = catchAsync(async (req, res) => {
    const quotation = await qService.getQuotationById(req.params.id);
    res.status(200).json(new ApiResponse(200, quotation, 'Quotation fetched successfully'));
  });
  getByOrderId = catchAsync(async (req, res) => {
    const quotation = await qService.getQuotationByOrderId(req.params.id);
    res.status(200).json(new ApiResponse(200, quotation, 'Quotation fetched successfully'));
  });
}
export default new QuotationController();
