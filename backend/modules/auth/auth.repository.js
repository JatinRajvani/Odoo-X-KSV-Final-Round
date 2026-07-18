import prisma from '../../config/db.js';

class AuthRepository {
  async createUser(data) {
    return prisma.user.create({ data });
  }

  async findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }
}

export default new AuthRepository();
