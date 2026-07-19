import prisma from '../../config/db.js';

class SecurityDepositRepository {
  async findByOrderId(orderId) {
    return prisma.securityDeposit.findUnique({
      where: { orderId },
      include: { customer: true }
    });
  }

  async create(data) {
    return prisma.securityDeposit.create({ data });
  }

  async findAll({ skip, take, where, orderBy }) {
    return prisma.$transaction([
      prisma.securityDeposit.count({ where }),
      prisma.securityDeposit.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          order: { include: { customer: true } }
        }
      })
    ]);
  }

  async findById(id) {
    return prisma.securityDeposit.findUnique({
      where: { id },
      include: {
        order: { include: { customer: true } }
      }
    });
  }

  async update(id, data) {
    return prisma.securityDeposit.update({
      where: { id },
      data
    });
  }
}

export default new SecurityDepositRepository();
