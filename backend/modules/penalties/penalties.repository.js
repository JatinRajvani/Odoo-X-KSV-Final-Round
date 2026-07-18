import prisma from '../../config/db.js';

class PenaltyRepository {
  async getOrder(orderId) {
    return prisma.rentalOrder.findUnique({
      where: { id: orderId },
      include: { 
        pickup: true, 
        return: true, 
        penalties: true, 
        securityDeposits: true,
        rentalItems: { include: { vehicle: true } }
      }
    });
  }

  async getSettings() {
    return prisma.organizationSetting.findFirst();
  }

  async create(data) {
    return prisma.penalty.create({ data });
  }

  async findAll({ skip, take, where, orderBy }) {
    return prisma.$transaction([
      prisma.penalty.count({ where }),
      prisma.penalty.findMany({
        skip, take, where, orderBy,
        include: { rentalOrder: { include: { customer: true } } }
      })
    ]);
  }

  async findById(id) {
    return prisma.penalty.findUnique({
      where: { id },
      include: { rentalOrder: true }
    });
  }

  async update(id, data) {
    return prisma.penalty.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.penalty.delete({ where: { id } });
  }
}
export default new PenaltyRepository();
