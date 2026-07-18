import prisma from '../../config/db.js';

class QuotationRepository {
  async getOrder(orderId) {
    return prisma.rentalOrder.findUnique({
      where: { id: orderId },
      include: { 
        customer: true, 
        rentalPeriod: true, 
        rentalItems: { include: { vehicle: true } }
      }
    });
  }

  async create(data) {
    return prisma.quotation.create({ data, include: { rentalOrder: true } });
  }

  async findById(id) {
    return prisma.quotation.findUnique({ where: { id }, include: { rentalOrder: { include: { customer: true, rentalItems: { include: { vehicle: true } } } } } });
  }

  async findByOrderId(rentalOrderId) {
    return prisma.quotation.findUnique({ where: { rentalOrderId }, include: { rentalOrder: { include: { customer: true, rentalItems: { include: { vehicle: true } } } } } });
  }

  async getCompanySettings() {
    return prisma.organizationSetting.findFirst();
  }

  async generateQuotationNumber() {
    const count = await prisma.quotation.count();
    return `QTN-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
  }
}
export default new QuotationRepository();
