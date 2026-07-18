import prisma from '../../config/db.js';

class InvoicesRepository {
  async create(data) {
    return prisma.invoice.create({
      data,
      include: {
        order: { include: { customer: true, vehicle: true } }
      }
    });
  }

  async findAll({ skip, take, where, orderBy }) {
    return prisma.$transaction([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          order: { include: { customer: true, vehicle: true } }
        }
      })
    ]);
  }

  async findById(id) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        order: { include: { customer: true, vehicle: true } }
      }
    });
  }

  async findByOrderId(orderId) {
    return prisma.invoice.findUnique({
      where: { orderId },
      include: {
        order: { include: { customer: true, vehicle: true } }
      }
    });
  }

  async update(id, data) {
    return prisma.invoice.update({
      where: { id },
      data,
      include: {
        order: { include: { customer: true, vehicle: true } }
      }
    });
  }

  async delete(id) {
    return prisma.invoice.delete({
      where: { id }
    });
  }
}

export default new InvoicesRepository();
