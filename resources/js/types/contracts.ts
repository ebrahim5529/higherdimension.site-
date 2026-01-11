export interface Customer {
  id: number;
  name: string;
  customer_number: string;
  phone?: string;
  nationality?: string;
}

export interface Scaffold {
  id: number;
  scaffold_number: string;
  description_ar?: string;
  description_en?: string;
  daily_rental_price: number;
  monthly_rental_price: number;
  available_quantity: number;
}

export interface RentalDetail {
  id: string;
  scaffoldId?: number;
  scaffold?: Scaffold | null;
  itemCode: string;
  itemDescription: string;
  startDate: string;
  endDate: string;
  duration: number;
  durationType: 'daily' | 'monthly';
  quantity: number;
  dailyRate: number;
  monthlyRate: number;
  total: number;
}

export interface PaymentDetail {
  id: string;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer';
  paymentDate: string;
  amount: number;
  checkNumber?: string;
  bankName?: string;
  checkDate?: string;
  checkImage?: File | null;
  checkImagePath?: string | null;
}

export interface CreateContractProps {
  customers: Customer[];
}


