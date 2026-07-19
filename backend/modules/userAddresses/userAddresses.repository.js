import prisma from '../../config/db.js';

class UserAddressesRepository {
  async create(data) {
    return prisma.userAddresses.create({ data });
  }

  async findAllByUserId(userId) {
    return prisma.userAddresses.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.userAddresses.findUnique({
      where: { id }
    });
  }

  async update(id, data) {
    return prisma.userAddresses.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.userAddresses.delete({
      where: { id }
    });
  }

  async unsetDefaultsForUser(userId) {
    return prisma.userAddresses.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }
}

export default new UserAddressesRepository();
