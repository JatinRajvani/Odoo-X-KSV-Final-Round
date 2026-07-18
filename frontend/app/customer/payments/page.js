export const metadata = {
  title: 'Invoices | DriveFleet',
  description: 'View your payment history and invoices.',
};

export default function PaymentsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Invoices</h1>
      <div className="rounded-2xl border border-border bg-white p-8 text-center text-secondary">
        Your payment history and invoices will be shown here.
      </div>
    </div>
  );
}
