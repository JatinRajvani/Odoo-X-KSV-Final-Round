import prisma from '../../config/db.js';

class VehicleImageRepository {
  async create(data) { return prisma.vehicleImage.create({ data }); }
  async findByVehicle(vehicleId) { return prisma.vehicleImage.findMany({ where: { vehicleId }, orderBy: { displayOrder: 'asc' } }); }
  async findById(id) { return prisma.vehicleImage.findUnique({ where: { id } }); }
  async unsetPrimary(vehicleId) { return prisma.vehicleImage.updateMany({ where: { vehicleId }, data: { isPrimary: false } }); }
  async setPrimary(id) { return prisma.vehicleImage.update({ where: { id }, data: { isPrimary: true } }); }
  async delete(id) { return prisma.vehicleImage.delete({ where: { id } }); }
}
export default new VehicleImageRepository();
