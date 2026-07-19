import invoiceRepo from './invoices.repository.js';
import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';

class InvoicesService {
  async getAllInvoices(query, user) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (user.role !== 'ADMIN') {
      where.customerId = user.id;
    } else if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.invoiceNumber) {
      where.invoiceNumber = { contains: query.invoiceNumber, mode: 'insensitive' };
    }
    if (query.invoiceStatus) where.invoiceStatus = query.invoiceStatus;

    let orderBy = { createdAt: 'desc' };

    const [total, invoices] = await invoiceRepo.findAll({
      skip,
      take: limit,
      where,
      orderBy,
    });

    return {
      invoices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInvoiceById(id, user) {
    const invoice = await invoiceRepo.findById(id);
    if (!invoice) throw new ApiError(404, 'Invoice not found');
    if (user.role !== 'ADMIN' && invoice.customerId !== user.id) {
      throw new ApiError(403, 'Not authorized');
    }
    return invoice;
  }

  async getInvoiceByOrderId(orderId, user) {
    const invoice = await invoiceRepo.findByOrderId(orderId);
    if (!invoice) throw new ApiError(404, 'Invoice not found for this order');
    if (user.role !== 'ADMIN' && invoice.customerId !== user.id) {
      throw new ApiError(403, 'Not authorized');
    }
    return invoice;
  }

  async updateInvoiceStatus(id, status) {
    const invoice = await invoiceRepo.findById(id);
    if (!invoice) throw new ApiError(404, 'Invoice not found');

    return invoiceRepo.update(id, { invoiceStatus: status });
  }

  async deleteInvoice(id) {
    const invoice = await invoiceRepo.findById(id);
    if (!invoice) throw new ApiError(404, 'Invoice not found');

    await invoiceRepo.delete(id);
    return true;
  }
}

export default new InvoicesService();
