import prisma from '../../config/db.js';
class SettingsRepository {
  async get() { return prisma.organizationSetting.findFirst(); }
  async update(id, data) { return prisma.organizationSetting.update({ where: { id }, data }); }
}
export default new SettingsRepository();
