import sdRepository from './securityDeposits.repository.js';
import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';

class SecurityDepositService {
  async create(data) {
    const order = await sdRepository.getOrder(data.rentalOrderId);
    if (!order) throw new ApiError(404, 'Rental order not found');

    if (order.securityDeposits && order.securityDeposits.length > 0) {
      throw new ApiError(400, 'Security deposit already collected for this order');
    }

    if (data.amountCollected < Number(order.securityDeposit)) {
      throw new ApiError(400, `Deposit amount (${data.amountCollected}) cannot be less than required vehicle security deposit (${order.securityDeposit})`);
    }

    return prisma.$transaction(async (tx) => {
      const deposit = await tx.securityDeposit.create({
        data: {
          rentalOrderId: data.rentalOrderId,
          amountCollected: data.amountCollected,
          reason: data.reason,
          refundStatus: 'NOT_REFUNDED'
        }
      });
      return deposit;
    });
  }

  async getAll(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (query.refundStatus) where.refundStatus = query.refundStatus;
    // Assuming searching across relation based on business requirements
    if (query.orderNumber) where.rentalOrder = { bookingNumber: { contains: query.orderNumber, mode: 'insensitive' } };
    
    let orderBy = {};
    // Fallback logic
    orderBy = { id: 'desc' };

    const [total, deposits] = await sdRepository.findAll({ skip, take: limit, where, orderBy });
    return {
      deposits,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async getById(id) {
    const deposit = await sdRepository.findById(id);
    if (!deposit) throw new ApiError(404, 'Security deposit not found');
    return deposit;
  }

  async update(id, data) {
    const deposit = await sdRepository.findById(id);
    if (!deposit) throw new ApiError(404, 'Security deposit not found');
    if (deposit.refundStatus !== 'NOT_REFUNDED') throw new ApiError(400, 'Cannot update a deposit that has been partially or fully refunded');
    
    return sdRepository.update(id, data);
  }

  async processRefund(id, data) {
    const deposit = await sdRepository.findById(id);
    if (!deposit) throw new ApiError(404, 'Security deposit not found');
    
    if (deposit.rentalOrder.status !== 'COMPLETED') {
      throw new ApiError(400, 'Refund only allowed after Rental Order is COMPLETED');
    }

    const currentlyRefunded = Number(deposit.amountRefunded);
    const collected = Number(deposit.amountCollected);
    const toRefund = Number(data.amountToRefund);
    const damage = data.damageCost ? Number(data.damageCost) : 0;

    if (currentlyRefunded + toRefund + damage > collected) {
      throw new ApiError(400, 'Refund + Damage cannot exceed total collected amount');
    }

    return prisma.$transaction(async (tx) => {
      const newRefundedAmount = currentlyRefunded + toRefund;
      const newDamageCost = Number(deposit.damageCost) + damage;
      
      let newStatus = 'PARTIALLY_REFUNDED';
      if (newRefundedAmount + newDamageCost >= collected) {
        newStatus = 'REFUNDED';
      }

      const updated = await tx.securityDeposit.update({
        where: { id },
        data: {
          amountRefunded: newRefundedAmount,
          damageCost: newDamageCost,
          refundStatus: newStatus,
          refundedAt: new Date(),
          reason: data.reason || deposit.reason
        }
      });
      return {
        deposit: updated,
        remainingDeposit: collected - newRefundedAmount - newDamageCost
      };
    });
  }
}
export default new SecurityDepositService();
