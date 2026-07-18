import qRepository from './quotations.repository.js';
import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';

class QuotationService {
  async generateQuotation(orderId) {
    const order = await qRepository.getOrder(orderId);
    if (!order) throw new ApiError(404, 'Rental order not found');

    const existing = await qRepository.findByOrderId(orderId);
    if (existing) throw new ApiError(400, 'Quotation already generated for this order');

    const settings = await qRepository.getCompanySettings();
    if (!settings) throw new ApiError(500, 'Organization settings not found');

    const quotationNumber = await qRepository.generateQuotationNumber();

    return prisma.$transaction(async (tx) => {
      const quotation = await tx.quotation.create({
        data: {
          rentalOrderId: orderId,
          quotationNumber: quotationNumber,
          generatedDate: new Date(),
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
          subtotal: order.subtotal,
          tax: order.tax,
          discount: order.discount,
          grandTotal: order.grandTotal,
          terms: settings.quotationFooter
        },
        include: { rentalOrder: true }
      });

      return {
        quotation,
        companyDetails: {
          name: settings.companyName,
          email: settings.companyEmail,
          phone: settings.companyPhone,
          address: settings.companyAddress
        },
        customerDetails: {
          name: `${order.customer.firstName} ${order.customer.lastName}`,
          email: order.customer.email,
          phone: order.customer.phone
        },
        vehicleDetails: order.rentalItems.map(item => ({
          brand: item.vehicle.brand,
          model: item.vehicle.model,
          registration: item.vehicle.registrationNumber,
          rentalAmount: item.rentalAmount
        })),
        pricing: {
          subtotal: order.subtotal,
          tax: order.tax,
          discount: order.discount,
          grandTotal: order.grandTotal
        }
      };
    });
  }

  async getQuotationById(id) {
    const quotation = await qRepository.findById(id);
    if (!quotation) throw new ApiError(404, 'Quotation not found');
    return quotation;
  }

  async getQuotationByOrderId(orderId) {
    const quotation = await qRepository.findByOrderId(orderId);
    if (!quotation) throw new ApiError(404, 'Quotation not found for this order');
    return quotation;
  }
}
export default new QuotationService();
