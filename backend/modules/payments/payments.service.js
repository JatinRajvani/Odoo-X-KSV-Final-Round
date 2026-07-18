import pRepository from './payments.repository.js';
import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';

class PaymentService {
  async processPayment(data) {
    const order = await pRepository.getOrder(data.rentalOrderId);
    if (!order) throw new ApiError(404, 'Rental order not found');
    if (order.status === 'CANCELLED') throw new ApiError(400, 'Cannot make payment for cancelled order');

    const totalPaid = order.payments.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const balance = Number(order.grandTotal) - totalPaid;

    if (data.amount > balance) {
      throw new ApiError(400, `Payment amount (${data.amount}) cannot exceed remaining balance (${balance})`);
    }

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          rentalOrderId: data.rentalOrderId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
          paymentGateway: data.paymentGateway,
          paymentStatus: 'SUCCESS'
        }
      });

      const newTotalPaid = totalPaid + data.amount;
      const newBalance = Number(order.grandTotal) - newTotalPaid;
      
      let newPaymentStatus = 'PARTIAL';
      if (newBalance <= 0) newPaymentStatus = 'PAID';
      
      await tx.rentalOrder.update({
        where: { id: data.rentalOrderId },
        data: { paymentStatus: newPaymentStatus }
      });

      return {
        payment,
        orderTotal: order.grandTotal,
        totalPaid: newTotalPaid,
        balance: newBalance,
        orderPaymentStatus: newPaymentStatus
      };
    });
  }

  async getAll(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (query.transactionId) where.transactionId = { contains: query.transactionId, mode: 'insensitive' };
    if (query.orderNumber) where.rentalOrder = { bookingNumber: { contains: query.orderNumber, mode: 'insensitive' } };
    if (query.customerName) {
      where.rentalOrder = {
        ...where.rentalOrder,
        customer: {
          OR: [
            { firstName: { contains: query.customerName, mode: 'insensitive' } },
            { lastName: { contains: query.customerName, mode: 'insensitive' } }
          ]
        }
      };
    }
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
    if (query.paymentMethod) where.paymentMethod = query.paymentMethod;
    if (query.date) {
      const d = new Date(query.date);
      where.paidAt = { gte: new Date(d.setHours(0,0,0,0)), lte: new Date(d.setHours(23,59,59,999)) };
    }

    let orderBy = {};
    if (query.sortBy) {
      const order = query.order === 'asc' ? 'asc' : 'desc';
      if (['amount', 'paidAt', 'createdAt'].includes(query.sortBy)) {
        orderBy[query.sortBy === 'createdAt' ? 'paidAt' : query.sortBy] = order;
      }
    } else {
      orderBy = { paidAt: 'desc' };
    }

    const [total, payments] = await pRepository.findAll({ skip, take: limit, where, orderBy });
    return {
      payments,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async getById(id) {
    const payment = await pRepository.findById(id);
    if (!payment) throw new ApiError(404, 'Payment not found');
    return payment;
  }

  async updateStatus(id, status) {
    const payment = await pRepository.findById(id);
    if (!payment) throw new ApiError(404, 'Payment not found');

    return prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id },
        data: { paymentStatus: status }
      });

      // Recalculate Order Status
      const allSuccess = await tx.payment.findMany({
        where: { rentalOrderId: payment.rentalOrderId, paymentStatus: 'SUCCESS' }
      });
      const order = await tx.rentalOrder.findUnique({ where: { id: payment.rentalOrderId } });
      const totalPaid = allSuccess.reduce((acc, curr) => acc + Number(curr.amount), 0);
      const balance = Number(order.grandTotal) - totalPaid;
      
      let newPaymentStatus = 'PENDING';
      if (totalPaid > 0 && balance > 0) newPaymentStatus = 'PARTIAL';
      if (balance <= 0) newPaymentStatus = 'PAID';

      await tx.rentalOrder.update({
        where: { id: payment.rentalOrderId },
        data: { paymentStatus: newPaymentStatus }
      });

      return updatedPayment;
    });
  }

  async delete(id) {
    const payment = await pRepository.findById(id);
    if (!payment) throw new ApiError(404, 'Payment not found');
    
    return prisma.$transaction(async (tx) => {
      await tx.payment.delete({ where: { id } });

      // Recalculate
      const allSuccess = await tx.payment.findMany({
        where: { rentalOrderId: payment.rentalOrderId, paymentStatus: 'SUCCESS' }
      });
      const order = await tx.rentalOrder.findUnique({ where: { id: payment.rentalOrderId } });
      const totalPaid = allSuccess.reduce((acc, curr) => acc + Number(curr.amount), 0);
      const balance = Number(order.grandTotal) - totalPaid;
      
      let newPaymentStatus = 'PENDING';
      if (totalPaid > 0 && balance > 0) newPaymentStatus = 'PARTIAL';
      if (totalPaid > 0 && balance <= 0) newPaymentStatus = 'PAID';

      await tx.rentalOrder.update({
        where: { id: payment.rentalOrderId },
        data: { paymentStatus: newPaymentStatus }
      });

      return true;
    });
  }
}
export default new PaymentService();
