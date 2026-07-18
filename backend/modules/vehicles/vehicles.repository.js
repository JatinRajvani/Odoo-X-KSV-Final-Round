import prisma from '../../config/db.js';

class VehicleRepository {
  async create(data) { return prisma.vehicle.create({ data }); }
  
  async findAll({ skip, take, where, orderBy }) {
    return prisma.$transaction([
      prisma.vehicle.count({ where }),
      prisma.vehicle.findMany({
        skip, take, where, orderBy,
        include: { category: true, images: { where: { isPrimary: true } } }
      })
    ]);
  }
  
  async findById(id) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: { category: true, images: true, priceLists: true, _count: { select: { rentalItems: true } } }
    });
  }
  
  async findByRegistrationOrVin(reg, vin) {
    return prisma.vehicle.findFirst({
      where: { OR: [{ registrationNumber: reg }, { vin: vin }] }
    });
  }
  
  async update(id, data) { return prisma.vehicle.update({ where: { id }, data }); }
  async delete(id) { return prisma.vehicle.delete({ where: { id } }); }
}
export default new VehicleRepository();
