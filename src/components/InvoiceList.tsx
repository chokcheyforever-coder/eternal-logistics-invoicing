import React, { useState } from 'react';
import { Invoice, CompanyProfile, PaymentStatus } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Printer, 
  Edit, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  companies: CompanyProfile[];
  onNewInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onPreviewInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onStatusChange: (invoiceId: string, status: PaymentStatus) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  companies,
  onNewInvoice,
  onEditInvoice,
  onPreviewInvoice,
  onDeleteInvoice,
  onDuplicateInvoice,
  onStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.phone.includes(searchTerm) ||
      inv.shipment.cabinetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.items.some(it => it.trackingNo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCompany = selectedCompany === 'ALL' || inv.companyProfileId === selectedCompany;
    const matchesStatus = selectedStatus === 'ALL' || inv.payment.status === selectedStatus;
    const matchesMode = selectedMode === 'ALL' || inv.shipment.transportation === selectedMode;

    return matchesSearch && matchesCompany && matchesStatus && matchesMode;
  });

  const exportToCSV = () => {
    const headers = [
      'Invoice No',
      'Date',
      'Customer ID',
      'Customer Name',
      'Phone',
      'Container No',
      'Transport Mode',
      'Total Items',
      'Total CBM',
      'Total Weight (kg)',
      'Subtotal ($)',
      'Discount ($)',
      'Other Charges ($)',
      'Grand Total ($)',
      'Payment Status'
    ];

    const rows = filteredInvoices.map(inv => [
      inv.invoiceNo,
      inv.date,
      inv.customer.customerId,
      `"${inv.customer.name}"`,
      inv.customer.phone,
      inv.shipment.cabinetNo,
      inv.shipment.transportation,
      inv.totalItem,
      inv.totalCbm.toFixed(3),
      inv.totalWeight,
      inv.subTotal.toFixed(2),
      inv.discount.toFixed(2),
      inv.otherCharges.toFixed(2),
      inv.grandTotal.toFixed(2),
      inv.payment.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `logistics_invoices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 font-khmer flex items-center gap-2">
            <span>📋</span> បញ្ជីវិក្កយបត្រ / Invoice Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            គ្រប់គ្រងការចេញវិក្កយបត្រ តាមដានការទូទាត់ និងដឹកជញ្ជូនចិន-កម្ពុជា
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewInvoice}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-blue-900 text-white transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ ចេញវិក្កយបត្រថ្មី / New Invoice</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice, customer, tracking..."
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Brand Selector */}
        <div>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full text-xs py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">🏢 All Logistics Brands</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Payment Status Selector */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-xs py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">💳 All Payment Statuses</option>
            <option value="UNPAID">🔴 UNPAID (មិនទាន់បង់)</option>
            <option value="PENDING_SLIP">🟡 PENDING SLIP (ផ្ញើបង្កាន់ដៃរួច)</option>
            <option value="PAID">🟢 PAID (បានទូទាត់រួច)</option>
          </select>
        </div>

        {/* Transport Mode Selector */}
        <div>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full text-xs py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">🚚 All Transport Modes</option>
            <option value="LAND">🚚 LAND (ផ្លូវគោក)</option>
            <option value="SEA">🚢 SEA (ផ្លូវទឹក)</option>
            <option value="AIR">✈️ AIR (ផ្លូវអាកាស)</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B2545] text-white text-[11px] font-khmer">
              <tr>
                <th className="py-3 px-3">លេខវិក្កយបត្រ (Invoice №)</th>
                <th className="py-3 px-3">កាលបរិច្ឆេទ (Date)</th>
                <th className="py-3 px-3">អតិថិជន (Customer)</th>
                <th className="py-3 px-3">ទូកុងតឺន័រ / ផ្លូវ</th>
                <th className="py-3 px-3 text-center">ចំនួនកេស (Pkgs)</th>
                <th className="py-3 px-3 text-center">CBM សរុប</th>
                <th className="py-3 px-3 text-right">ទឹកប្រាក់សរុប (Total)</th>
                <th className="py-3 px-3 text-center">ស្ថានភាពទូទាត់</th>
                <th className="py-3 px-3 text-center">សកម្មភាព (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold">រកមិនឃើញវិក្កយបត្រទេ / No invoices match your criteria</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const company = companies.find(c => c.id === inv.companyProfileId) || companies[0];
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition">
                      {/* Invoice No & Brand Tag */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-blue-900">
                          {inv.invoiceNo}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {company.name}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {inv.date}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 font-khmer flex items-center gap-1.5">
                          <span className="bg-blue-100 text-blue-900 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                            {inv.customer.customerId}
                          </span>
                          <span className="truncate max-w-[140px]">{inv.customer.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {inv.customer.phone}
                        </div>
                      </td>

                      {/* Shipment Container & Mode */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <span className="text-[11px]">
                            {inv.shipment.transportation === 'LAND' ? '🚚' : inv.shipment.transportation === 'SEA' ? '🚢' : '✈️'}
                          </span>
                          <span className="font-mono text-[11px]">{inv.shipment.cabinetNo}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {inv.shipment.origin.split(' ')[0]} ➔ KH
                        </div>
                      </td>

                      {/* Packages */}
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {inv.totalItem}
                      </td>

                      {/* Total CBM */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-blue-900">
                        {inv.totalCbm.toFixed(3)} m³
                      </td>

                      {/* Grand Total */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-mono font-black text-sm text-slate-950">
                          ${inv.grandTotal.toFixed(2)}
                        </div>
                        {inv.discount > 0 && (
                          <div className="text-[10px] text-red-500 font-mono">
                            -${inv.discount.toFixed(2)} off
                          </div>
                        )}
                      </td>

                      {/* Payment Status Dropdown */}
                      <td className="py-3 px-3 text-center">
                        <select
                          value={inv.payment.status}
                          onChange={(e) => onStatusChange(inv.id, e.target.value as PaymentStatus)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                            inv.payment.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : inv.payment.status === 'PENDING_SLIP'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-red-50 text-red-700 border-red-300'
                          }`}
                        >
                          <option value="UNPAID">🔴 UNPAID</option>
                          <option value="PENDING_SLIP">🟡 SLIP SENT</option>
                          <option value="PAID">🟢 PAID</option>
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onPreviewInvoice(inv)}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
                            title="Print / Preview"
                          >
                            <Printer className="w-4 h-4 text-blue-700" />
                          </button>

                          <button
                            onClick={() => onEditInvoice(inv)}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
                            title="Edit Invoice"
                          >
                            <Edit className="w-4 h-4 text-amber-700" />
                          </button>

                          <button
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4 text-slate-700" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete invoice ${inv.invoiceNo}?`)) {
                                onDeleteInvoice(inv.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-100 rounded text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
