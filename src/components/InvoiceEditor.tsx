import React, { useState } from 'react';
import { 
  Invoice, 
  InvoiceItem, 
  Customer, 
  CompanyProfile, 
  TransportMode,
  PaymentStatus 
} from '../types';
import { Plus, Trash2, Copy, Eye, Printer, Save, ArrowLeft, RefreshCw, Calculator } from 'lucide-react';

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
  // If editing, use existing; otherwise create a default blank invoice
  const [companyId, setCompanyId] = useState<string>(
    initialInvoice?.companyProfileId || companies[0]?.id || 'eternal-logistics'
  );
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialInvoice?.customer.id || customers[0]?.id || ''
  );

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
    initialInvoice?.shipment.cabinetNo || 'CAB-2026-GZ-8891'
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

  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items || [
      {
        id: 'item-' + Date.now(),
        no: 1,
        warehouseInboundNo: 'GZ-2410-01',
        trackingNo: '',
        itemName: 'សម្លៀកបំពាក់ (Clothes)',
        itemType: 'ទំនិញទូទៅ (General Goods)',
        quantity: 10,
        cbm: 0.12,
        totalWeight: 120,
        totalQuantity: 300,
        totalCbm: 1.2,
        unitPrice: 145,
        shippingCost: 174,
        chinaWarehouse: 'Guangzhou'
      }
    ]
  );

  const [discount, setDiscount] = useState<number>(initialInvoice?.discount || 0);
  const [otherCharges, setOtherCharges] = useState<number>(initialInvoice?.otherCharges || 0);
  const [otherChargesDesc, setOtherChargesDesc] = useState<string>(
    initialInvoice?.otherChargesDescription || 'ថ្លៃដឹកជញ្ជូនដល់ផ្ទះ (Delivery)'
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    initialInvoice?.payment.status || 'UNPAID'
  );

  // Recalculate item values
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

  const handleAddItem = () => {
    const nextNo = items.length + 1;
    const newItem: InvoiceItem = {
      id: 'item-' + Date.now() + '-' + nextNo,
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
      unitPrice: 145,
      shippingCost: 14.5,
      chinaWarehouse: 'Guangzhou'
    };
    setItems([...items, newItem]);
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

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0] || {
    id: 'temp',
    customerId: 'EL-0000',
    name: 'General Customer',
    phone: '',
    address: 'Phnom Penh, Cambodia',
    destination: 'Phnom Penh'
  };

  const activeCompany = companies.find(c => c.id === companyId) || companies[0];

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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-khmer flex items-center gap-2">
              <span>{initialInvoice ? 'កែសម្រួលវិក្កយបត្រ / Edit Invoice' : 'បង្កើតវិក្កយបត្រថ្មី / New Logistics Invoice'}</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono">Invoice № {invoiceNo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Company Brand Switcher */}
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                🏢 {c.name} ({c.khmerName})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleTriggerPreview}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
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
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ព / Print</span>
          </button>

          <button
            type="button"
            onClick={handleSaveInvoice}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#0B2545] hover:bg-blue-900 text-white transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>រក្សាទុក / Save Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Shipment Info */}
        <div className="space-y-6">
          {/* 1. Customer Information Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                ព័ត៌មានអតិថិជន / Customer Information
              </h2>
              <button
                type="button"
                onClick={() => setIsNewCustomerModal(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> + New
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ជ្រើសរើសអតិថិជន / Select Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  const cust = customers.find(c => c.id === e.target.value);
                  if (cust?.defaultRate) {
                    // Update default rates for items
                    setItems(items.map(it => ({
                      ...it,
                      unitPrice: cust.defaultRate || it.unitPrice,
                      shippingCost: Number((it.totalCbm * (cust.defaultRate || it.unitPrice)).toFixed(2))
                    })));
                  }
                }}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.customerId}] {c.name} - {c.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Customer ID:</span>
                <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                  {activeCustomer.customerId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Phone / Tel:</span>
                <span className="font-mono font-bold text-slate-800">{activeCustomer.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Address in Cambodia:</span>
                <p className="font-khmer text-slate-700 bg-white p-2 rounded border border-slate-200 text-[11px] leading-relaxed">
                  {activeCustomer.address}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Shipment Information Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              ព័ត៌មានដឹកជញ្ជូន / Shipment Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Transportation Mode / មធ្យោបាយដឹកជញ្ជូន
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['LAND', 'SEA', 'AIR'] as TransportMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTransportation(mode)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      transportation === mode
                        ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{mode === 'LAND' ? '🚚' : mode === 'SEA' ? '🚢' : '✈️'}</span>
                    <span>{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cabinet / Container No. (លេខទូកុងតឺន័រ)
              </label>
              <input
                type="text"
                value={cabinetNo}
                onChange={(e) => setCabinetNo(e.target.value)}
                placeholder="e.g. CAB-2026-GZ-8891"
                className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Origin (From)
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Guangzhou (ក្វាងចូវ)">Guangzhou (ក្វាងចូវ)</option>
                  <option value="Foshan (ហ្វូសាន)">Foshan (ហ្វូសាន)</option>
                  <option value="Yiwu (យីវូ)">Yiwu (យីវូ)</option>
                  <option value="Shenzhen (សិនជិន)">Shenzhen (សិនជិន)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination (To)
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Calculation Basis
                </label>
                <div className="flex border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCalculationBasis('CBM');
                      setItems(items.map(it => ({
                        ...it,
                        shippingCost: Number((it.totalCbm * it.unitPrice).toFixed(2))
                      })));
                    }}
                    className={`flex-1 py-1.5 font-bold transition ${
                      calculationBasis === 'CBM'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600'
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
                    className={`flex-1 py-1.5 font-bold transition ${
                      calculationBasis === 'WEIGHT'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600'
                    }`}
                  >
                    Weight ($/kg)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Status Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ស្ថានភាពទូទាត់ប្រាក់ / Payment Status
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {(['UNPAID', 'PENDING_SLIP', 'PAID'] as PaymentStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setPaymentStatus(status)}
                  className={`py-2 px-2 rounded-lg text-[11px] font-bold border transition ${
                    paymentStatus === status
                      ? status === 'PAID'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : status === 'PENDING_SLIP'
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-red-600 text-white border-red-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {status === 'PAID' ? '✓ PAID' : status === 'PENDING_SLIP' ? '⏳ SLIP SENT' : '✕ UNPAID'}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 font-khmer bg-slate-50 p-2 rounded border">
              គណនីទទួលប្រាក់ ABA: <strong className="text-blue-900">{activeCompany.bankAccountName}</strong> ({activeCompany.bankAccountNumber})
            </div>
          </div>
        </div>

        {/* Right Column (2 cols wide): Items Table & Totals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Table Container */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-khmer flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  តារាងទំនិញដឹកជញ្ជូន / Cargo Line Items
                </h2>
                <p className="text-xs text-slate-500">
                  {items.length} items recorded • Rate calculation by{' '}
                  <strong className="text-blue-700">{calculationBasis === 'CBM' ? 'Cubic Meters ($/m³)' : 'Gross Weight ($/kg)'}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ បន្ថែមទំនិញ / Add Item</span>
              </button>
            </div>

            {/* Scrollable table for accurate data entry */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#0B2545] text-white text-[11px] font-khmer">
                    <th className="p-2 text-center w-8">№</th>
                    <th className="p-2 text-left w-24">លេខចូលឃ្លាំង</th>
                    <th className="p-2 text-left w-28">លេខដឹកជញ្ជូន</th>
                    <th className="p-2 text-left min-w-[140px]">ឈ្មោះទំនិញ</th>
                    <th className="p-2 text-left w-28">ប្រភេទទំនិញ</th>
                    <th className="p-2 text-center w-14">ចំនួនកេស</th>
                    <th className="p-2 text-center w-14">CBM/កេស</th>
                    <th className="p-2 text-center w-14">ទម្ងន់(kg)</th>
                    <th className="p-2 text-center w-14">CBMសរុប</th>
                    <th className="p-2 text-center w-16 bg-[#F5A623] text-slate-950">តម្លៃឯកតា</th>
                    <th className="p-2 text-center w-16 bg-[#F5A623] text-slate-950">ថ្លៃដឹក($)</th>
                    <th className="p-2 text-center w-20">ឃ្លាំងចិន</th>
                    <th className="p-2 text-center w-16">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-bold text-slate-500 text-[11px]">
                        {index + 1}
                      </td>

                      {/* លេខចូលឃ្លាំង */}
                      <td className="p-1">
                        <input
                          type="text"
                          value={item.warehouseInboundNo}
                          onChange={(e) => handleItemChange(index, 'warehouseInboundNo', e.target.value)}
                          placeholder="GZ-001"
                          className="w-full font-mono text-[11px] p-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* លេខដឹកជញ្ជូន */}
                      <td className="p-1">
                        <input
                          type="text"
                          value={item.trackingNo}
                          onChange={(e) => handleItemChange(index, 'trackingNo', e.target.value)}
                          placeholder="SF/ZTO..."
                          className="w-full font-mono text-[11px] p-1.5 border border-slate-300 rounded font-semibold text-blue-900 focus:border-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* ឈ្មោះទំនិញ */}
                      <td className="p-1">
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          placeholder="ឈ្មោះទំនិញ / Item Description"
                          className="w-full font-khmer text-[11px] p-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* ប្រភេទទំនិញ */}
                      <td className="p-1">
                        <select
                          value={item.itemType}
                          onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
                          className="w-full font-khmer text-[10px] p-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                        >
                          {GOODS_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* ចំនួន (Quantity) */}
                      <td className="p-1">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full text-center font-bold p-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* ម៉ែត្រគូប (Unit CBM) */}
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.001"
                          value={item.cbm || ''}
                          onChange={(e) => handleItemChange(index, 'cbm', e.target.value)}
                          className="w-full text-center font-mono text-[11px] p-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* ទម្ងន់សរុប (kg) */}
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={item.totalWeight || ''}
                          onChange={(e) => handleItemChange(index, 'totalWeight', e.target.value)}
                          className="w-full text-center font-mono text-[11px] p-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* ម៉ែត្រគូបសរុប (Total CBM - Computed) */}
                      <td className="p-2 text-center font-mono font-bold text-blue-900 bg-blue-50/50">
                        {item.totalCbm.toFixed(3)}
                      </td>

                      {/* តម្លៃឯកតា (Unit Price) */}
                      <td className="p-1 bg-amber-50/40">
                        <input
                          type="number"
                          step="0.5"
                          value={item.unitPrice || ''}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          className="w-full text-center font-mono font-bold text-[11px] p-1.5 border border-amber-300 rounded focus:border-amber-500 focus:outline-none"
                        />
                      </td>

                      {/* តម្លៃដឹកជញ្ជូន (Freight - Computed) */}
                      <td className="p-2 text-center font-mono font-black text-emerald-800 bg-amber-50/60">
                        ${item.shippingCost.toFixed(2)}
                      </td>

                      {/* ឃ្លាំងចិន */}
                      <td className="p-1">
                        <select
                          value={item.chinaWarehouse}
                          onChange={(e) => handleItemChange(index, 'chinaWarehouse', e.target.value)}
                          className="w-full text-[10px] p-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                        >
                          {CHINA_WAREHOUSES.map((wh) => (
                            <option key={wh} value={wh}>
                              {wh}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-1 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCloneItem(index)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            title="Clone item"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            disabled={items.length <= 1}
                            className={`p-1 rounded ${
                              items.length <= 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'hover:bg-red-100 text-red-600'
                            }`}
                            title="Delete item"
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

            {/* Calculations Summary Grid */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block">TOTAL ITEMS (កេស)</span>
                  <span className="text-xl font-bold font-mono text-slate-900">{totalItem} pkgs</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block">TOTAL CBM (ម៉ែត្រគូប)</span>
                  <span className="text-xl font-bold font-mono text-blue-900">{totalCbm.toFixed(3)} m³</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block">TOTAL WEIGHT (ទម្ងន់)</span>
                  <span className="text-xl font-bold font-mono text-slate-800">{totalWeight} kg</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block">SUB TOTAL (តម្លៃដើម)</span>
                  <span className="text-xl font-bold font-mono text-slate-900">${subTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Adjustments: Discount & Other Charges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700 w-28">
                    DISCOUNT ($):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-36 text-xs font-mono font-bold text-red-600 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-700 w-32">
                    OTHER CHARGES ($):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={otherCharges || ''}
                    onChange={(e) => setOtherCharges(Number(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-28 text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={otherChargesDesc}
                    onChange={(e) => setOtherChargesDesc(e.target.value)}
                    placeholder="Reason (e.g. Local Delivery)"
                    className="flex-1 text-xs font-khmer border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grand Total Highlight Bar */}
              <div className="mt-4 bg-[#0B2545] text-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 block font-sans">
                    GRAND TOTAL / សរុបទឹកប្រាក់ត្រូវទូទាត់
                  </span>
                  <span className="text-[11px] text-sky-200 font-khmer">
                    អតិថិជនអាចស្កេនទូទាត់តាម ABA PAY / KHQR
                  </span>
                </div>
                <div className="text-3xl font-black font-mono text-amber-400">
                  ${grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Customer */}
      {isNewCustomerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-khmer mb-4 flex items-center gap-2">
              <span>👤</span> បង្កើតអតិថិជនថ្មី / New Customer
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
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  placeholder="e.g. Chan Mean"
                  className="w-full text-xs font-khmer border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full text-xs font-khmer border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
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
