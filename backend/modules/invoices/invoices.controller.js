import invoiceService from './invoices.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/ApiResponse.js';

class InvoicesController {
  getAll = catchAsync(async (req, res) => {
    const result = await invoiceService.getAllInvoices(req.query, req.user);
    res.status(200).json(new ApiResponse(200, result, 'Invoices fetched successfully'));
  });

  getById = catchAsync(async (req, res) => {
    const invoice = await invoiceService.getInvoiceById(req.params.id, req.user);
    res.status(200).json(new ApiResponse(200, invoice, 'Invoice fetched successfully'));
  });

  getByOrderId = catchAsync(async (req, res) => {
    const invoice = await invoiceService.getInvoiceByOrderId(req.params.orderId, req.user);
    res.status(200).json(new ApiResponse(200, invoice, 'Invoice fetched successfully'));
  });

  updateStatus = catchAsync(async (req, res) => {
    const invoice = await invoiceService.updateInvoiceStatus(req.params.id, req.body.status);
    res.status(200).json(new ApiResponse(200, invoice, 'Invoice status updated successfully'));
  });

  delete = catchAsync(async (req, res) => {
    await invoiceService.deleteInvoice(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Invoice deleted successfully'));
  });
}

export default new InvoicesController();
