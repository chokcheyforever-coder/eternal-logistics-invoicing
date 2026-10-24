export interface InvoiceItem {
  id: string;
  no: number;
  warehouseInboundNo: string; // លេខចូលឃ្លាំង
  trackingNo: string;         // លេខដឹកជញ្ជូន
  itemName: string;           // ឈ្មោះទំនិញ
  itemType: string;           // ប្រភេទទំនិញ
  quantity: number;           // ចំនួន (កេស/កញ្ចប់)
  cbm: number;                // ម៉ែត្រគូបឯកតា
  totalWeight: number;        // ទម្ងន់សរុប (kg)
  totalQuantity: number;      // ចំនួនសរុប
  totalCbm: number;           // ម៉ែត្រគូបសរុប
  unitPrice: number;          // តម្លៃឯកតា ($/CBM or $/kg)
  shippingCost: number;       // តម្លៃដឹកជញ្ជូន ($)
  chinaWarehouse: string;     // ឃ្លាំងចិន (Guangzhou, Foshan, Yiwu, etc.)
}

export interface Customer {
  id: string;
  customerId: string; // e.g. EL-8899
  name: string;
  phone: string;
  telegram?: string;
  address: string;
  destination: string;
  defaultRate?: number;
}

export type TransportMode = 'LAND' | 'SEA' | 'AIR';

export interface ShipmentInfo {
  transportation: TransportMode;
  cabinetNo: string;
  origin: string;
  destination: string;
}

export type PaymentStatus = 'UNPAID' | 'PAID' | 'PARTIAL' | 'PENDING_SLIP';

export interface PaymentInfo {
  method: 'ABA_PAY' | 'CASH' | 'BAKONG' | 'BANK_TRANSFER';
  accountName: string;
  accountNumber: string;
  status: PaymentStatus;
  slipImage?: string;
  paidAmount?: number;
  notes?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  khmerName: string;
  tagline: string;
  routeTitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoText: string;
  smartPhone: string;
  cellcardPhone: string;
  warehouses: string[];
  email: string;
  telegramLink: string;
  bankAccountName: string;
  bankAccountNumber: string;
  qrPayload?: string;
  qrImageUrl?: string;
  qrMode?: 'PHOTO' | 'DYNAMIC';
  notes: string[];
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  companyProfileId: string;
  customer: Customer;
  shipment: ShipmentInfo;
  items: InvoiceItem[];
  totalItem: number;
  totalCbm: number;
  totalWeight: number;
  subTotal: number;
  discount: number;
  otherCharges: number;
  otherChargesDescription?: string;
  grandTotal: number;
  calculationBasis: 'CBM' | 'WEIGHT';
  payment: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ContainerManifest {
  id: string;
  cabinetNo: string;
  mode: TransportMode;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  status: 'LOADING' | 'IN_TRANSIT' | 'CUSTOMS' | 'ARRIVED' | 'DISTRIBUTED';
  totalCbm: number;
  totalWeight: number;
  totalPackages: number;
  invoiceIds: string[];
}
