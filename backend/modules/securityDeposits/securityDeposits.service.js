import sdRepository from './securityDeposits.repository.js';
import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';

class SecurityDepositService {
  async create(data, user) {
    const customerId = user.role === 'ADMIN' ? (data.customerId || user.id) : user.id;

    // Check if order exists
    const order = await prisma.rentalOrder.findUnique({ where: { id: data.orderId } });
    if (!order) throw new ApiError(404, 'Rental order not found');

    const depositAmount = Number(data.depositAmount || order.rentalAmount);

    return sdRepository.create({
      orderId: data.orderId,
      customerId,
      depositAmount,
      refundStatus: 'Pending',
      depositStatus: 'Held'
    });
  }

  async getAll(query, user) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (user.role !== 'ADMIN') {
      where.customerId = user.id;
    } else if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.refundStatus) where.refundStatus = query.refundStatus;
    if (query.depositStatus) where.depositStatus = query.depositStatus;
    if (query.orderNumber) {
      where.order = { orderNumber: { contains: query.orderNumber, mode: 'insensitive' } };
    }

    let orderBy = { createdAt: 'desc' };

    const [total, deposits] = await sdRepository.findAll({ skip, take: limit, where, orderBy });
    return {
      deposits,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async getById(id, user) {
    const deposit = await sdRepository.findById(id);
    if (!deposit) throw new ApiError(404, 'Security deposit not found');
    if (user.role !== 'ADMIN' && deposit.customerId !== user.id) {
      throw new ApiError(403, 'Not authorized');
    }
    return deposit;
  }

  async update(id, data, user) {
    const deposit = await sdRepository.findById(id);
    if (!deposit) throw new ApiError(404, 'Security deposit not found');
    if (user.role !== 'ADMIN') throw new ApiError(403, 'Not authorized');

    return sdRepository.update(id, data);
  }

  async processRefund(id, data, user) {
    const deposit = await sdRepository.findById(id);
    if (!deposit) throw new ApiError(404, 'Security deposit not found');
    if (user.role !== 'ADMIN') throw new ApiError(403, 'Only admins can process refunds');
    
    if (deposit.order.orderStatus !== 'Completed') {
      throw new ApiError(400, 'Refund only allowed after Rental Order is Completed');
    }

    const depositAmount = Number(deposit.depositAmount);
    const penaltyAmount = Number(data.penaltyAmount || 0);
    const refundAmount = Math.max(0, depositAmount - penaltyAmount);

    return sdRepository.update(id, {
      penaltyAmount,
      penaltyReason: data.penaltyReason || (penaltyAmount > 0 ? 'Deducted for return damages/delays' : null),
      refundAmount,
      refundMethod: data.refundMethod,
      refundStatus: penaltyAmount >= depositAmount ? 'Partially_Refunded' : 'Refunded',
      depositStatus: 'Released',
      refundDate: new Date(),
      remarks: data.remarks || null
    });
  }
}

export default new SecurityDepositService();
