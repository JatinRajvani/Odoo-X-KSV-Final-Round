import prisma from '../../config/db.js';

const ORDER_INCLUDE = {
  customer: true,
  vehicle: { include: { category: true, images: true } },
  deliveryAddress: true,
  payment: true,
  securityDeposit: true,
  invoice: true
};

class RentalOrderRepository {
  async create(data) {
    return prisma.rentalOrder.create({
      data,
      include: ORDER_INCLUDE
    });
  }

  async findAll({ skip, take, where, orderBy }) {
    return prisma.$transaction([
      prisma.rentalOrder.count({ where }),
      prisma.rentalOrder.findMany({
        skip,
        take,
        where,
        orderBy,
        include: ORDER_INCLUDE
      })
    ]);
  }

  async findById(id) {
    return prisma.rentalOrder.findUnique({
      where: { id },
      include: ORDER_INCLUDE
    });
  }

  async update(id, data) {
    return prisma.rentalOrder.update({
      where: { id },
      data,
      include: ORDER_INCLUDE
    });
  }

  async delete(id) {
    return prisma.rentalOrder.delete({ where: { id } });
  }

  async generateOrderNumber() {
    const count = await prisma.rentalOrder.count();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BKG-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}-${randomSuffix}`;
  }
}

export default new RentalOrderRepository();
