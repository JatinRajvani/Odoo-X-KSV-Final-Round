import prisma from '../../config/db.js';

class PaymentRepository {
  async getOrder(orderId) {
    return prisma.rentalOrder.findUnique({
      where: { id: orderId },
      include: { payments: { where: { paymentStatus: 'SUCCESS' } } }
    });
  }

  async create(data) {
    return prisma.payment.create({ data });
  }

  async findAll({ skip, take, where, orderBy }) {
    return prisma.$transaction([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        skip, take, where, orderBy,
        include: { rentalOrder: { include: { customer: true } } }
      })
    ]);
  }

  async findById(id) {
    return prisma.payment.findUnique({
      where: { id },
      include: { rentalOrder: { include: { customer: true } } }
    });
  }

  async updateStatus(id, paymentStatus) {
    return prisma.payment.update({ where: { id }, data: { paymentStatus } });
  }

  async delete(id) {
    return prisma.payment.delete({ where: { id } });
  }
}
export default new PaymentRepository();
