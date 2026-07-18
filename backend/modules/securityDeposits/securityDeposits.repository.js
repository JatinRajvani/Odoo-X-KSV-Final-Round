import prisma from '../../config/db.js';

class SecurityDepositRepository {
  async getOrder(orderId) {
    return prisma.rentalOrder.findUnique({
      where: { id: orderId },
      include: { securityDeposits: true }
    });
  }

  async create(data) {
    return prisma.securityDeposit.create({ data });
  }

  async findAll({ skip, take, where, orderBy }) {
    return prisma.$transaction([
      prisma.securityDeposit.count({ where }),
      prisma.securityDeposit.findMany({
        skip, take, where, orderBy,
        include: { rentalOrder: { include: { customer: true } } }
      })
    ]);
  }

  async findById(id) {
    return prisma.securityDeposit.findUnique({
      where: { id },
      include: { rentalOrder: true }
    });
  }

  async update(id, data) {
    return prisma.securityDeposit.update({ where: { id }, data });
  }
}
export default new SecurityDepositRepository();
