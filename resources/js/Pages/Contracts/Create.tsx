/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { RentalsSection } from '@/components/contracts/RentalsSection';
import { PaymentsSection } from '@/components/contracts/PaymentsSection';
import { CreateContractProps } from '@/types/contracts';
import { ArrowLeft } from 'lucide-react';
import { ContractWhatsAppModal } from '@/components/features/ContractWhatsAppModal';
import { ContractPreviewModal } from '@/components/features/ContractPreviewModal';
import { useContractForm } from '@/hooks/contracts/useContractForm';
import { ContractBasicInfo } from '@/components/contracts/ContractBasicInfo';
import { ContractTotals } from '@/components/contracts/ContractTotals';
import { ContractFormActions } from '@/components/contracts/ContractFormActions';

export default function CreateContract({ customers }: CreateContractProps) {
  const { state, actions } = useContractForm(customers);

  return (
    <DashboardLayout>
      <Head title="إضافة عقد جديد" />
      <div className="space-y-6 pb-8 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.visit('/contracts')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                استمارة عقد جديد
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">إضافة عقد تأجير جديد</p>
            </div>
          </div>
        </div>

        <form onSubmit={actions.handleSubmit}>
          {/* معلومات العقد الأساسية */}
          <ContractBasicInfo
            contractDate={state.contractDate}
            contractNumber={state.contractNumber}
            customerSearchQuery={state.customerSearchQuery}
            showCustomerDropdown={state.showCustomerDropdown}
            filteredCustomers={state.filteredCustomers}
            nationality={state.nationality}
            deliveryAddress={state.deliveryAddress}
            deliveryAddressDetails={state.deliveryAddressDetails}
            locationMapLink={state.locationMapLink}
            processing={state.processing}
            errors={state.errors}
            actions={{
              setCustomerSearchQuery: actions.setCustomerSearchQuery,
              setShowCustomerDropdown: actions.setShowCustomerDropdown,
              setSelectedCustomer: actions.setSelectedCustomer,
              setContractNumber: actions.setContractNumber,
              setNationality: actions.setNationality,
              setDeliveryAddress: actions.setDeliveryAddress,
              setDeliveryAddressDetails: actions.setDeliveryAddressDetails,
              setLocationMapLink: actions.setLocationMapLink,
              setContractDate: actions.setContractDate,
              clearErrors: (field?: string) => actions.clearErrors(field as any),
            }}
          />

          {/* تفاصيل الإيجار */}
          <RentalsSection
            rentals={state.rentalDetails}
            onAddRentalItem={actions.handleAddRentalItem}
            onDeleteRentalItem={actions.handleDeleteRentalItem}
            onUpdateRentalDetail={actions.updateRentalDetail}
            onScaffoldChange={actions.handleScaffoldChange}
            errors={state.errors}
          />

          {/* ملخص التكاليف */}
          <ContractTotals
            transportCost={state.transportCost}
            totalDiscount={state.totalDiscount}
            totalAfterDiscount={state.totalAfterDiscount}
            actions={{
              setTransportCost: actions.setTransportCost,
              setTotalDiscount: actions.setTotalDiscount,
            }}
          />

          {/* المدفوعات */}
          <PaymentsSection
            payments={state.payments}
            onAddPayment={actions.handleAddPayment}
            onDeletePayment={actions.handleDeletePayment}
            onUpdatePayment={actions.updatePayment}
            onCheckImageChange={actions.handleCheckImageChange}
            errors={state.errors}
          />

          {/* الأزرار */}
          <ContractFormActions
            processing={state.processing}
            isValid={state.isFormValid()}
            onPreview={() => actions.setPreviewModalOpen(true)}
            onSubmit={actions.handleSubmit}
            selectedCustomer={state.selectedCustomer}
          />
        </form>
      </div>

      {/* Modal إرسال العقد عبر الواتساب */}
      <ContractWhatsAppModal
        open={state.whatsappModalOpen}
        onOpenChange={(open) => {
          actions.setWhatsappModalOpen(open);
          if (!open) {
            router.visit('/contracts');
          }
        }}
        contract={state.createdContract}
        customerPhone={state.selectedCustomer?.phone || ''}
      />

      {/* Modal معاينة نموذج الفاتورة */}
      {state.selectedCustomer && (
        <ContractPreviewModal
          open={state.previewModalOpen}
          onOpenChange={actions.setPreviewModalOpen}
          contractNumber={state.contractNumber || ''}
          contractDate={state.contractDate}
          customerName={state.selectedCustomer.name}
          customerNumber={state.selectedCustomer.customer_number || ''}
          deliveryAddress={state.deliveryAddress}
          rentalDetails={state.rentalDetails}
          transportCost={state.transportCost}
          totalDiscount={state.totalDiscount}
          customerPhone={state.selectedCustomer.phone || ''}
        />
      )}
    </DashboardLayout>
  );
}
