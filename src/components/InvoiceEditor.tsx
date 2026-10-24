import React, { useState } from 'react';
import { 
  Invoice, 
  InvoiceItem, 
  Customer, 
  CompanyProfile, 
  TransportMode,
  PaymentStatus 
} from '../types';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  Printer, 
  Save, 
  ArrowLeft, 
  Calculator, 
  Box, 
  Truck, 
  User, 
  Barcode, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface InvoiceEditorProps {
  initialInvoice?: Invoice;
  companies: CompanyProfile[];
  customers: Customer[];
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  onPreview: (invoice: Invoice) => void;
  onCreateCustomer: (customer: Customer) => void;
}

const GOODS_TYPES = [
  'ទំនិញទូទៅ (General Goods)',
  'ទំនិញពិសេស (Sensitive Goods)',
  'សម្លៀកបំពាក់ (Clothes)',
  'ស្បែកជើង និងកាបូប (Shoes & Bags)',
  'គ្រឿងអេឡិចត្រូនិក (Electronics)',
  'គ្រឿងបន្លាស់ (Spare Parts)',
  'គ្រឿងសម្អាង (Cosmetics)',
  'សម្ភារៈផ្ទះបាយ (Kitchenware)'
];

const CHINA_WAREHOUSES = ['Guangzhou', 'Foshan', 'Yiwu', 'Shenzhen'];

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  initialInvoice,
  companies,
  customers,
  onSave,
  onCancel,
  onPreview,
  onCreateCustomer
}) => {
  // Company & Customer State
  const [companyId, setCompanyId] = useState<string>(
    initialInvoice?.companyProfileId || companies[0]?.id || 'eternal-logistics'
  );
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialInvoice?.customer.id || customers[0]?.id || ''
  );

  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [isNewCustomerModal, setIsNewCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    customerId: `EL-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    phone: '',
    telegram: '',
    address: '',
    destination: 'Phnom Penh, Cambodia',
    defaultRate: 145
  });

  // Shipment State
  const [invoiceNo, setInvoiceNo] = useState(
    initialInvoice?.invoiceNo || `INV-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [date, setDate] = useState(
    initialInvoice?.date || new Date().toISOString().split('T')[0]
  );
  const [transportation, setTransportation] = useState<TransportMode>(
    initialInvoice?.shipment.transportation || 'LAND'
  );
  const [cabinetNo, setCabinetNo] = useState(
    initialInvoice?.shipment.cabinetNo || ''
  );
  const [origin, setOrigin] = useState(
    initialInvoice?.shipment.origin || 'Guangzhou (ក្វាងចូវ)'
  );
  const [destination, setDestination] = useState(
    initialInvoice?.shipment.destination || 'Phnom Penh (រាជធានីភ្នំពេញ)'
  );
  const [calculationBasis, setCalculationBasis] = useState<'CBM' | 'WEIGHT'>(
    initialInvoice?.calculationBasis || 'CBM'
  );

  // Line items state - Blank for new invoice
  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items || [
      {
        id: 'item-' + Date.now(),
        no: 1,
        warehouseInboundNo: '',
        trackingNo: '',
        itemName: '',
        itemType: 'ទំនិញទូទៅ (General Goods)',
        quantity: 0,
        cbm: 0,
        totalWeight: 0,
        totalQuantity: 0,
        totalCbm: 0,
        unitPrice: 0,
        shippingCost: 0,
        chinaWarehouse: 'Guangzhou'
      }
    ]
  );

  // Quick Add Item Bar State - Blank for new invoice
  const [quickItem, setQuickItem] = useState({
    trackingNo: '',
    itemName: '',
    itemType: 'ទំនិញទូទៅ (General Goods)',
    quantity: 1,
    lengthCm: '',
    widthCm: '',
    heightCm: '',
    cbm: 0,
    weight: 0,
    unitPrice: 0,
    chinaWarehouse: 'Guangzhou'
  });
  const [useDimensionsCalculator, setUseDimensionsCalculator] = useState(false);

  // Adjustments & Payment - Blank for new invoice
  const [discount, setDiscount] = useState<number>(initialInvoice?.discount || 0);
  const [otherCharges, setOtherCharges] = useState<number>(initialInvoice?.otherCharges || 0);
  const [otherChargesDesc, setOtherChargesDesc] = useState<string>(
    initialInvoice?.otherChargesDescription || ''
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    initialInvoice?.payment.status || 'UNPAID'
  );

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || {
    id: '',
    customerId: '',
    name: '',
    phone: '',
    address: '',
    destination: 'Phnom Penh, Cambodia'
  };

  const activeCompany = companies.find(c => c.id === companyId) || companies[0];

  // Auto-calculate CBM from dimensions L x W x H (cm)
  const handleDimensionChange = (field: 'lengthCm' | 'widthCm' | 'heightCm', val: string) => {
    const updated = { ...quickItem, [field]: val };
    const l = parseFloat(updated.lengthCm) || 0;
    const w = parseFloat(updated.widthCm) || 0;
    const h = parseFloat(updated.heightCm) || 0;
    if (l > 0 && w > 0 && h > 0) {
      // (L * W * H) / 1,000,000 = CBM
      const computedCbm = Number(((l * w * h) / 1000000).toFixed(4));
      updated.cbm = computedCbm;
    }
    setQuickItem(updated);
  };

  // Quick Add Submit
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNo = items.length + 1;
    const qty = Number(quickItem.quantity) || 1;
    const cbmVal = Number(quickItem.cbm) || 0.1;
    const weightVal = Number(quickItem.weight) || 0;
    const price = Number(quickItem.unitPrice) || (activeCustomer.defaultRate || 145);
    const computedTotalCbm = Number((qty * cbmVal).toFixed(4));
    const computedFreight = calculationBasis === 'CBM' 
      ? Number((computedTotalCbm * price).toFixed(2))
      : Number((weightVal * price).toFixed(2));

    const newItem: InvoiceItem = {
      id: 'item-' + Date.now() + '-' + nextNo,
      no: nextNo,
      warehouseInboundNo: `GZ-${new Date().toISOString().slice(2, 7).replace('-', '')}-${String(nextNo).padStart(2, '0')}`,
      trackingNo: quickItem.trackingNo.trim(),
      itemName: quickItem.itemName.trim() || 'ទំនិញចម្រុះ (General Cargo)',
      itemType: quickItem.itemType,
      quantity: qty,
      cbm: cbmVal,
      totalWeight: weightVal,
      totalQuantity: qty,
      totalCbm: computedTotalCbm,
      unitPrice: price,
      shippingCost: computedFreight,
      chinaWarehouse: quickItem.chinaWarehouse
    };

    setItems([...items, newItem]);

    // Reset quick item bar (keep rate and warehouse)
    setQuickItem({
      ...quickItem,
      trackingNo: '',
      itemName: '',
      quantity: 1,
      lengthCm: '',
      widthCm: '',
      heightCm: '',
      weight: 10
    });
  };

  // Recalculate item cell changes
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    // Auto-calculate totalCbm
    if (field === 'quantity' || field === 'cbm') {
      const q = field === 'quantity' ? Number(value) || 0 : item.quantity;
      const c = field === 'cbm' ? Number(value) || 0 : item.cbm;
      item.totalCbm = Number((q * c).toFixed(4));
    }

    // Auto-calculate shippingCost based on basis
    if (field === 'quantity' || field === 'cbm' || field === 'totalWeight' || field === 'unitPrice') {
      const price = field === 'unitPrice' ? Number(value) || 0 : item.unitPrice;
      if (calculationBasis === 'CBM') {
        item.shippingCost = Number((item.totalCbm * price).toFixed(2));
      } else {
        const weight = field === 'totalWeight' ? Number(value) || 0 : item.totalWeight;
        item.shippingCost = Number((weight * price).toFixed(2));
      }
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      no: idx + 1
    }));
    setItems(updated);
  };

  const handleCloneItem = (index: number) => {
    const source = items[index];
    const cloned: InvoiceItem = {
      ...source,
      id: 'item-' + Date.now(),
      no: items.length + 1
    };
    setItems([...items, cloned]);
  };

  // Summaries
  const totalItem = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalCbm = Number(items.reduce((sum, item) => sum + (Number(item.totalCbm) || 0), 0).toFixed(4));
  const totalWeight = Number(items.reduce((sum, item) => sum + (Number(item.totalWeight) || 0), 0).toFixed(2));
  const subTotal = Number(items.reduce((sum, item) => sum + (Number(item.shippingCost) || 0), 0).toFixed(2));
  const grandTotal = Number((subTotal - (Number(discount) || 0) + (Number(otherCharges) || 0)).toFixed(2));

  const handleSaveInvoice = () => {
    const constructedInvoice: Invoice = {
      id: initialInvoice?.id || 'inv-' + Date.now(),
      invoiceNo,
      date,
      companyProfileId: companyId,
      customer: activeCustomer,
      shipment: {
        transportation,
        cabinetNo,
        origin,
        destination
      },
      items,
      totalItem,
      totalCbm,
      totalWeight,
      subTotal,
      discount: Number(discount) || 0,
      otherCharges: Number(otherCharges) || 0,
      otherChargesDescription: otherChargesDesc,
      grandTotal,
      calculationBasis,
      payment: {
        method: 'ABA_PAY',
        accountName: activeCompany.bankAccountName,
        accountNumber: activeCompany.bankAccountNumber,
        status: paymentStatus,
        paidAmount: paymentStatus === 'PAID' ? grandTotal : 0
      },
      createdAt: initialInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(constructedInvoice);
  };

  const handleTriggerPreview = () => {
    const constructedInvoice: Invoice = {
      id: initialInvoice?.id || 'inv-preview',
      invoiceNo,
      date,
      companyProfileId: companyId,
      customer: activeCustomer,
      shipment: {
        transportation,
        cabinetNo,
        origin,
        destination
      },
      items,
      totalItem,
      totalCbm,
      totalWeight,
      subTotal,
      discount: Number(discount) || 0,
      otherCharges: Number(otherCharges) || 0,
      otherChargesDescription: otherChargesDesc,
      grandTotal,
      calculationBasis,
      payment: {
        method: 'ABA_PAY',
        accountName: activeCompany.bankAccountName,
        accountNumber: activeCompany.bankAccountNumber,
        status: paymentStatus,
        paidAmount: paymentStatus === 'PAID' ? grandTotal : 0
      },
      createdAt: initialInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onPreview(constructedInvoice);
  };

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.phone) return;
    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      ...newCustomerForm
    };
    onCreateCustomer(newCust);
    setSelectedCustomerId(newCust.id);
    setIsNewCustomerModal(false);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16">
      {/* ================= TOP ACTION BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-khmer flex items-center gap-2">
              <span>{initialInvoice ? 'កែសម្រួលវិក្កយបត្រ / Edit Invoice' : 'បង្កើតវិក្កយបត្រថ្មី / New Invoice'}</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono">Invoice №: <strong className="text-blue-900">{invoiceNo}</strong></p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Brand Switcher */}
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                🏢 {c.name}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <button
            type="button"
            onClick={handleTriggerPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>មើលគំរូ / Preview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleTriggerPreview();
              setTimeout(() => window.print(), 300);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-sm font-black"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ព / Print</span>
          </button>

          <button
            type="button"
            onClick={handleSaveInvoice}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>រក្សាទុក / Save Invoice</span>
          </button>
        </div>
      </div>

      {/* ================= 1. COMPACT TOP HEADER: CUSTOMER & SHIPMENT RIBBON ================= */}
      {/* Takes 0% of horizontal table space, giving 100% width to cargo table below! */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Customer Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 font-khmer flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>អតិថិជន (Customer)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsNewCustomerModal(true)}
                className="text-[11px] text-blue-600 font-bold hover:underline"
              >
                + New
              </button>
            </div>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                const cust = customers.find(c => c.id === e.target.value);
                if (cust?.defaultRate) {
                  setQuickItem({ ...quickItem, unitPrice: cust.defaultRate });
                }
              }}
              className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- សូមជ្រើសរើសអតិថិជន / Select Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.customerId}] {c.name} ({c.phone})
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>Code: <strong className="text-blue-900 font-mono">{activeCustomer.customerId}</strong></span>
              <button
                type="button"
                onClick={() => setIsCustomerDetailsOpen(!isCustomerDetailsOpen)}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-0.5 text-[10px]"
              >
                <span>Details</span>
                {isCustomerDetailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Transport Mode Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-khmer flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-500" />
              <span>មធ្យោបាយដឹកជញ្ជូន (Mode)</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['LAND', 'SEA', 'AIR'] as TransportMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTransportation(mode)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    transportation === mode
                      ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{mode === 'LAND' ? '🚚' : mode === 'SEA' ? '🚢' : '✈️'}</span>
                  <span>{mode}</span>
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 text-center font-mono">
              {transportation === 'LAND' ? 'ផ្លូវគោក (5-7 ថ្ងៃ)' : transportation === 'SEA' ? 'ផ្លូវទឹក (12-16 ថ្ងៃ)' : 'ផ្លូវអាកាស (2-3 ថ្ងៃ)'}
            </div>
          </div>

          {/* Cabinet / Container No */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-khmer">
              លេខទូកុងតឺន័រ (Container No.)
            </label>
            <input
              type="text"
              value={cabinetNo}
              onChange={(e) => setCabinetNo(e.target.value)}
              placeholder="e.g. CAB-2026-GZ-8891"
              className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Date:</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-[11px] font-mono border-0 bg-transparent p-0 text-slate-800 font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Basis & Payment Status */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 font-khmer">
                គិតថ្លៃតាម (Billing Basis)
              </label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {paymentStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 border border-slate-200 p-1 rounded-xl bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setCalculationBasis('CBM');
                  setItems(items.map(it => ({
                    ...it,
                    shippingCost: Number((it.totalCbm * it.unitPrice).toFixed(2))
                  })));
                }}
                className={`py-1.5 rounded-lg text-xs font-bold transition ${
                  calculationBasis === 'CBM'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CBM ($/m³)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalculationBasis('WEIGHT');
                  setItems(items.map(it => ({
                    ...it,
                    shippingCost: Number((it.totalWeight * (it.unitPrice > 10 ? 1.5 : it.unitPrice)).toFixed(2))
                  })));
                }}
                className={`py-1.5 rounded-lg text-xs font-bold transition ${
                  calculationBasis === 'WEIGHT'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weight ($/kg)
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Payment:</span>
              <button
                type="button"
                onClick={() => setPaymentStatus(paymentStatus === 'PAID' ? 'UNPAID' : 'PAID')}
                className="text-blue-700 hover:underline font-bold"
              >
                Toggle {paymentStatus === 'PAID' ? 'to Unpaid' : 'to Paid'}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Customer Address & Delivery Details */}
        {isCustomerDetailsOpen && (
          <div className="bg-slate-50/80 border-t border-slate-200 px-5 py-3 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900">Delivery Address: </span>
              <span className="font-khmer">{activeCustomer.address}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px] shrink-0">
              <span>Phone: <strong className="text-slate-900">{activeCustomer.phone}</strong></span>
              {activeCustomer.telegram && <span>Telegram: <strong className="text-sky-600">{activeCustomer.telegram}</strong></span>}
            </div>
          </div>
        )}
      </div>

      {/* ================= 2. QUICK ADD CARGO BAR (FAST, EASY DATA ENTRY) ================= */}
      {/* Rich Logistics Navy Blue & Warm Amber with high-contrast readable inputs */}
      <div className="bg-gradient-to-r from-[#071E3D] via-[#0B2545] to-[#134B70] text-white p-5 rounded-2xl shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow">
              <Barcode className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-khmer text-amber-400 tracking-wide">
                បញ្ចូលទំនិញរហ័ស (Quick Add Cargo Entry Bar)
              </h2>
              <span className="text-[11px] text-sky-200 hidden sm:inline">
                Scan barcode or type tracking number, enter dimensions, and click "+ Add Item"
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setUseDimensionsCalculator(!useDimensionsCalculator)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              useDimensionsCalculator 
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{useDimensionsCalculator ? '✓ Using L×W×H (cm)' : '+ Calculate CBM by L×W×H'}</span>
          </button>
        </div>

        {/* Quick Add Form Row */}
        <form onSubmit={handleQuickAdd} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
            {/* Tracking No */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-sky-200 block">
                លេខដឹកជញ្ជូន (Tracking No.)
              </label>
              <input
                type="text"
                value={quickItem.trackingNo}
                onChange={(e) => setQuickItem({ ...quickItem, trackingNo: e.target.value })}
                placeholder="Scan / Type Tracking No..."
                className="w-full bg-white text-slate-900 font-mono font-bold p-2.5 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
            </div>

            {/* Item Name */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-sky-200 block">
                ឈ្មោះទំនិញ (Item Description)
              </label>
              <input
                type="text"
                value={quickItem.itemName}
                onChange={(e) => setQuickItem({ ...quickItem, itemName: e.target.value })}
                placeholder="e.g. សម្លៀកបំពាក់ (Clothes)"
                className="w-full bg-white text-slate-900 font-khmer p-2.5 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
            </div>

            {/* Packages Qty */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-sky-200 block">
                ចំនួនកេស (Qty)
              </label>
              <input
                type="number"
                min="1"
                value={quickItem.quantity}
                onChange={(e) => setQuickItem({ ...quickItem, quantity: Number(e.target.value) || 1 })}
                className="w-full bg-white text-slate-900 font-mono font-bold text-center p-2.5 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
            </div>

            {/* CBM per carton */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-sky-200 block">
                CBM/កេស (m³)
              </label>
              <input
                type="number"
                step="0.001"
                value={quickItem.cbm}
                onChange={(e) => setQuickItem({ ...quickItem, cbm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white text-slate-900 font-mono font-bold text-center p-2.5 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
            </div>

            {/* Unit Price */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-sky-200 block">
                តម្លៃឯកតា ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={quickItem.unitPrice}
                onChange={(e) => setQuickItem({ ...quickItem, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-amber-400 text-slate-950 font-mono font-black text-center p-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
              />
            </div>
          </div>

          {/* Optional: L x W x H Dimension Inputs */}
          {useDimensionsCalculator && (
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/20 flex flex-wrap items-center gap-3 text-xs text-white">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" /> វាស់ទំហំកេស (Box Dimensions in Centimeters):
              </span>
              <div className="flex items-center gap-2 font-mono">
                <input
                  type="number"
                  placeholder="Length cm"
                  value={quickItem.lengthCm}
                  onChange={(e) => handleDimensionChange('lengthCm', e.target.value)}
                  className="w-24 bg-white text-slate-900 p-2 rounded-lg text-center font-bold border-0 focus:outline-none shadow-sm"
                />
                <span className="text-white/70">×</span>
                <input
                  type="number"
                  placeholder="Width cm"
                  value={quickItem.widthCm}
                  onChange={(e) => handleDimensionChange('widthCm', e.target.value)}
                  className="w-24 bg-white text-slate-900 p-2 rounded-lg text-center font-bold border-0 focus:outline-none shadow-sm"
                />
                <span className="text-white/70">×</span>
                <input
                  type="number"
                  placeholder="Height cm"
                  value={quickItem.heightCm}
                  onChange={(e) => handleDimensionChange('heightCm', e.target.value)}
                  className="w-24 bg-white text-slate-900 p-2 rounded-lg text-center font-bold border-0 focus:outline-none shadow-sm"
                />
                <span className="text-sky-200 font-sans ml-1">➔ Computed CBM:</span>
                <strong className="text-slate-950 bg-amber-400 text-sm font-black px-2.5 py-1 rounded-lg shadow-sm">
                  {quickItem.cbm} m³
                </strong>
              </div>
            </div>
          )}

          {/* Quick Submit Button & Category Select */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-semibold text-sky-200">Category:</span>
              <select
                value={quickItem.itemType}
                onChange={(e) => setQuickItem({ ...quickItem, itemType: e.target.value })}
                className="bg-white/10 text-white font-khmer text-xs py-2 px-3 rounded-xl border border-white/20 focus:outline-none shadow-sm"
              >
                {GOODS_TYPES.map((t) => (
                  <option key={t} value={t} className="text-slate-900">
                    {t}
                  </option>
                ))}
              </select>

              <span className="text-[11px] font-semibold text-sky-200 ml-2">Warehouse:</span>
              <select
                value={quickItem.chinaWarehouse}
                onChange={(e) => setQuickItem({ ...quickItem, chinaWarehouse: e.target.value })}
                className="bg-white/10 text-white text-xs py-2 px-3 rounded-xl border border-white/20 focus:outline-none shadow-sm"
              >
                {CHINA_WAREHOUSES.map((wh) => (
                  <option key={wh} value={wh} className="text-slate-900">
                    {wh}
                  </option>
                ))}
              </select>

              <span className="text-[11px] font-semibold text-sky-200 ml-2">Weight (kg):</span>
              <input
                type="number"
                value={quickItem.weight}
                onChange={(e) => setQuickItem({ ...quickItem, weight: parseFloat(e.target.value) || 0 })}
                className="w-18 bg-white/10 text-white text-center font-mono text-xs py-2 px-2.5 rounded-xl border border-white/20 focus:outline-none shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ បន្ថែមចូលតារាង (Add Item)</span>
            </button>
          </div>
        </form>
      </div>

      {/* ================= 3. FULL-WIDTH SPACIOUS CARGO TABLE ================= */}
      {/* 100% full screen width gives plenty of room to edit all cells comfortably */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-khmer flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              តារាងទំនិញដឹកជញ្ជូន ({items.length} items recorded)
            </h2>
            <p className="text-xs text-slate-500">
              You can edit any cell directly in the table below, or clone/delete items.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextNo = items.length + 1;
                setItems([...items, {
                  id: 'item-' + Date.now(),
                  no: nextNo,
                  warehouseInboundNo: `GZ-${new Date().toISOString().slice(2, 7).replace('-', '')}-${String(nextNo).padStart(2, '0')}`,
                  trackingNo: '',
                  itemName: '',
                  itemType: 'ទំនិញទូទៅ (General Goods)',
                  quantity: 1,
                  cbm: 0.1,
                  totalWeight: 10,
                  totalQuantity: 1,
                  totalCbm: 0.1,
                  unitPrice: activeCustomer.defaultRate || 145,
                  shippingCost: (0.1 * (activeCustomer.defaultRate || 145)),
                  chinaWarehouse: 'Guangzhou'
                }]);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>+ Empty Row</span>
            </button>
          </div>
        </div>

        {/* Spacious Table with Comfortable Padding & Iconic Logistics Colors */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Category split header - Deep Navy for Goods, Golden Amber for Pricing */}
              <tr className="text-white font-khmer text-xs">
                <th colSpan={7} className="bg-[#0B2545] py-2 px-3 text-center border-r border-blue-900 font-bold tracking-wide">
                  📋 ព័ត៌មានទំនិញ (CARGO & GOODS INFORMATION)
                </th>
                <th colSpan={5} className="bg-[#F59E0B] text-slate-950 py-2 px-3 text-center font-black tracking-wide">
                  💰 ព័ត៌មានតម្លៃ (PRICING & FREIGHT CHARGES)
                </th>
              </tr>
              <tr className="bg-slate-100 text-slate-800 font-bold text-xs border-b border-slate-300">
                <th className="py-2.5 px-3 text-center w-10">№</th>
                <th className="py-2.5 px-3 w-36">លេខដឹកជញ្ជូន (Tracking)</th>
                <th className="py-2.5 px-3 min-w-[180px]">ឈ្មោះទំនិញ (Description)</th>
                <th className="py-2.5 px-3 w-36">ប្រភេទទំនិញ (Category)</th>
                <th className="py-2.5 px-2 text-center w-20">កេស (Qty)</th>
                <th className="py-2.5 px-2 text-center w-24">CBM/កេស</th>
                <th className="py-2.5 px-2 text-center w-20">ទម្ងន់(kg)</th>
                <th className="py-2.5 px-2 text-center w-24 font-bold text-blue-900 bg-blue-50 border-x border-blue-100">CBMសរុប</th>
                <th className="py-2.5 px-2 text-center w-24 font-bold text-amber-950 bg-amber-100/70 border-r border-amber-200">តម្លៃឯកតា</th>
                <th className="py-2.5 px-3 text-right w-28 font-black text-emerald-900 bg-emerald-100/70 border-r border-emerald-200">ថ្លៃដឹក($)</th>
                <th className="py-2.5 px-2 text-center w-24 bg-amber-50">ឃ្លាំងចិន</th>
                <th className="py-2.5 px-2 text-center w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  {/* Sequence */}
                  <td className="py-2.5 px-3 text-center font-bold text-slate-400 font-mono text-xs">
                    {index + 1}
                  </td>

                  {/* Tracking No */}
                  <td className="py-2.5 px-2">
                    <input
                      type="text"
                      value={item.trackingNo}
                      onChange={(e) => handleItemChange(index, 'trackingNo', e.target.value)}
                      placeholder="SF / ZTO..."
                      className="w-full font-mono text-xs font-bold text-blue-900 p-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Item Description */}
                  <td className="py-2.5 px-2">
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                      placeholder="Item name / ឈ្មោះទំនិញ"
                      className="w-full font-khmer text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-2">
                    <select
                      value={item.itemType}
                      onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
                      className="w-full font-khmer text-[11px] p-2 rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:outline-none"
                    >
                      {GOODS_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.split(' ')[0]}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Quantity */}
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full font-mono font-bold text-center text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* CBM per carton */}
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="number"
                      step="0.001"
                      value={item.cbm || ''}
                      onChange={(e) => handleItemChange(index, 'cbm', e.target.value)}
                      className="w-full font-mono text-center text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Weight kg */}
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="number"
                      step="0.5"
                      value={item.totalWeight || ''}
                      onChange={(e) => handleItemChange(index, 'totalWeight', e.target.value)}
                      className="w-full font-mono text-center text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Total CBM (Computed) */}
                  <td className="py-2.5 px-2 text-center font-mono font-black text-blue-900 bg-blue-50/50">
                    {item.totalCbm.toFixed(3)}
                  </td>

                  {/* Unit Price */}
                  <td className="py-2.5 px-2 text-center bg-amber-50/40">
                    <input
                      type="number"
                      step="0.5"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full font-mono font-bold text-center text-xs p-2 rounded-lg border border-amber-300 bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </td>

                  {/* Shipping Cost (Computed) */}
                  <td className="py-2.5 px-3 text-right font-mono font-black text-sm text-emerald-800 bg-amber-50/60">
                    ${item.shippingCost.toFixed(2)}
                  </td>

                  {/* China Warehouse */}
                  <td className="py-2.5 px-2 text-center">
                    <select
                      value={item.chinaWarehouse}
                      onChange={(e) => handleItemChange(index, 'chinaWarehouse', e.target.value)}
                      className="w-full text-[11px] p-2 rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:outline-none"
                    >
                      {CHINA_WAREHOUSES.map((wh) => (
                        <option key={wh} value={wh}>
                          {wh}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Row Actions */}
                  <td className="py-2.5 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCloneItem(index)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition"
                        title="Duplicate row"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length <= 1}
                        className={`p-1.5 rounded-lg transition ${
                          items.length <= 1
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= 4. SUMMARY & CALCULATION TOTALS BAR ================= */}
        <div className="p-5 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-indigo-600 shadow-sm">
              <span className="text-slate-500 font-bold block uppercase text-[10px]">TOTAL ITEMS (កេស)</span>
              <span className="text-2xl font-black font-mono text-slate-900">{totalItem} pkgs</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-blue-600 shadow-sm">
              <span className="text-slate-500 font-bold block uppercase text-[10px]">TOTAL VOLUME (CBM)</span>
              <span className="text-2xl font-black font-mono text-blue-900">{totalCbm.toFixed(3)} m³</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-amber-500 shadow-sm">
              <span className="text-slate-500 font-bold block uppercase text-[10px]">TOTAL WEIGHT (ទម្ងន់)</span>
              <span className="text-2xl font-black font-mono text-amber-700">{totalWeight} kg</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-emerald-600 shadow-sm">
              <span className="text-slate-500 font-bold block uppercase text-[10px]">FREIGHT SUBTOTAL (ថ្លៃដឹក)</span>
              <span className="text-2xl font-black font-mono text-emerald-700">${subTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Adjustments: Discount & Other Charges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 w-28">
                DISCOUNT ($):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                placeholder="0.00"
                className="w-36 text-xs font-mono font-bold text-red-600 border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 w-32">
                OTHER CHARGES ($):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={otherCharges || ''}
                onChange={(e) => setOtherCharges(Number(e.target.value) || 0)}
                placeholder="0.00"
                className="w-28 text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <input
                type="text"
                value={otherChargesDesc}
                onChange={(e) => setOtherChargesDesc(e.target.value)}
                placeholder="Reason (e.g. Local Delivery PP)"
                className="flex-1 text-xs font-khmer border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Grand Total Bar - Rich Logistics Navy & Luminous Golden Amber */}
          <div className="mt-5 bg-gradient-to-r from-[#071E3D] via-[#0B2545] to-[#134B70] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl border border-blue-900/80">
            <div className="flex items-center gap-3.5">
              {activeCompany.qrImageUrl && (
                <div className="p-1 bg-white rounded-xl shadow-md shrink-0 border border-white/20">
                  <img
                    src={activeCompany.qrImageUrl}
                    alt="ABA QR"
                    className="w-12 h-12 object-contain rounded-lg"
                  />
                </div>
              )}
              <div>
                <span className="text-xs uppercase font-black tracking-wider text-amber-400 block font-sans">
                  GRAND TOTAL / សរុបទឹកប្រាក់ត្រូវទូទាត់
                </span>
                <span className="text-xs text-sky-200 font-khmer">
                  គណនី ABA: <strong className="text-white font-bold">{activeCompany.bankAccountName}</strong> ({activeCompany.bankAccountNumber})
                </span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 drop-shadow">
              ${grandTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: CREATE NEW CUSTOMER ================= */}
      {isNewCustomerModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-khmer mb-4">
              👤 បង្កើតអតិថិជនថ្មី / New Customer
            </h3>
            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer ID
                </label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.customerId}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, customerId: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name (ឈ្មោះអតិថិជន)
                </label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="e.g. Sokha Mean"
                  className="w-full text-xs font-khmer border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Tel (លេខទូរស័ព្ទ)
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    placeholder="012 345 678"
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telegram
                  </label>
                  <input
                    type="text"
                    value={newCustomerForm.telegram}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, telegram: e.target.value })}
                    placeholder="@username"
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Address in Cambodia (អាសយដ្ឋាន)
                </label>
                <textarea
                  rows={2}
                  required
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  placeholder="ផ្ទះលេខ... ផ្លូវ... សង្កាត់... ខណ្ឌ... រាជធានីភ្នំពេញ"
                  className="w-full text-xs font-khmer border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Rate ($/CBM)
                </label>
                <input
                  type="number"
                  value={newCustomerForm.defaultRate}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, defaultRate: Number(e.target.value) || 145 })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0B2545] hover:bg-blue-900 text-white rounded-xl shadow-sm"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
