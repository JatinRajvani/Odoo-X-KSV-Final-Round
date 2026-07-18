import prisma from '../../config/db.js';

class UserRepository {
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        profileImage: true, role: true, status: true, emailVerified: true,
        lastLogin: true, createdAt: true, updatedAt: true
      }
    });
  }

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        profileImage: true, role: true, status: true, emailVerified: true,
        lastLogin: true, createdAt: true, updatedAt: true
      }
    });
  }

  async update(id, data) {
    // Only allow updating specific fields
    const { firstName, lastName, phone, profileImage } = data;
    return prisma.user.update({
      where: { id },
      data: { firstName, lastName, phone, profileImage },
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        profileImage: true, role: true, status: true, emailVerified: true,
        lastLogin: true, createdAt: true, updatedAt: true
      }
    });
  }

  async delete(id) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UserRepository();
