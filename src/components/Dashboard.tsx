import React from 'react';
import { Invoice, CompanyProfile, ContainerManifest } from '../types';
import { 
  DollarSign, 
  Package, 
  Box, 
  Truck, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Plus, 
  Printer, 
  ArrowUpRight,
  FileText 
} from 'lucide-react';

interface DashboardProps {
  invoices: Invoice[];
  containers: ContainerManifest[];
  companies: CompanyProfile[];
  onNewInvoice: () => void;
  onPreviewInvoice: (invoice: Invoice) => void;
  onViewAllInvoices: () => void;
  onSelectTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  invoices,
  containers,
  companies,
  onNewInvoice,
  onPreviewInvoice,
  onViewAllInvoices,
  onSelectTab
}) => {
  // Financial calculations
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPaid = invoices
    .filter(inv => inv.payment.status === 'PAID')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalUnpaid = totalRevenue - totalPaid;

  const totalCbm = invoices.reduce((sum, inv) => sum + inv.totalCbm, 0);
  const totalItems = invoices.reduce((sum, inv) => sum + inv.totalItem, 0);

  const activeContainersCount = containers.filter(c => c.status === 'IN_TRANSIT' || c.status === 'LOADING').length;

  return (
    <div className="space-y-6">
      {/* Top Banner - Rich Logistics Navy & Warm Amber */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071E3D] via-[#0B2545] to-[#134B70] border border-blue-900/80 text-white p-6 sm:p-7 shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/40 font-mono">
              <span>🇨🇳 ⇄ 🇰🇭</span>
              <span>Cross-Border Logistics Operations (China ➔ Cambodia)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-khmer text-amber-400">
              ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ និងទំនិញដឹកជញ្ជូន
            </h1>
            <p className="text-xs sm:text-sm text-sky-200 max-w-xl">
              Automated logistics billing, ABA KHQR instant payment generation, CBM freight calculations, and China warehouse container tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewInvoice}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ បង្កើតវិក្កយបត្រថ្មី (New Invoice)</span>
            </button>

            <button
              onClick={() => onSelectTab('containers')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5 shadow"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>ទូកុងតឺន័រ ({activeContainersCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid with Vibrant Brand Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Invoiced (ចំណូលសរុប)
            </span>
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 shadow-sm">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full">{invoices.length}</span> invoices issued
            </p>
          </div>
        </div>

        {/* Payment Settlement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-emerald-600 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Collected vs Pending
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shadow-sm">
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-700">
              ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-red-600 font-bold mt-1 bg-red-50 inline-block px-2 py-0.5 rounded-full">
              Pending: ${totalUnpaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Shipped Volume (CBM) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Shipped Volume (CBM)
            </span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shadow-sm">
              <Box className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-amber-700">
              {totalCbm.toFixed(3)} m³
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Average CBM rate: <strong className="text-amber-900">$145 - $165</strong>
            </p>
          </div>
        </div>

        {/* Total Packages */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-indigo-600 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Packages (កេស/កញ្ចប់)
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 shadow-sm">
              <Package className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-indigo-900">
              {totalItems.toLocaleString()} pkgs
            </div>
            <p className="text-xs text-slate-500 mt-1">
              China Inbound Waybills recorded
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Invoices & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table (2 columns wide) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
          <div className="p-5 flex items-center justify-between border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-khmer flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-100 text-amber-800 font-bold">⚡</span>
                <span>វិក្កយបត្រថ្មីៗ / Recent Invoices</span>
              </h2>
              <p className="text-xs text-slate-500">
                Latest customer shipments ready for billing & collection
              </p>
            </div>
            <button
              onClick={onViewAllInvoices}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition"
            >
              <span>View All ({invoices.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B2545] text-white font-khmer text-xs font-bold">
                <tr>
                  <th className="py-2.5 px-3">លេខវិក្កយបត្រ</th>
                  <th className="py-2.5 px-3">អតិថិជន</th>
                  <th className="py-2.5 px-3 text-center">CBM</th>
                  <th className="py-2.5 px-3 text-right">តម្លៃសរុប</th>
                  <th className="py-2.5 px-3 text-center">ស្ថានភាព</th>
                  <th className="py-2.5 px-3 text-center">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <FileText className="w-7 h-7 text-slate-300 stroke-[1.5]" />
                        <span className="text-xs font-semibold text-slate-500 font-khmer">មិនទាន់មានវិក្កយបត្រនៅឡើយទេ / No invoices issued yet</span>
                        <button
                          onClick={onNewInvoice}
                          className="mt-1 text-xs font-bold text-blue-700 hover:text-blue-900 underline"
                        >
                          + ចេញវិក្កយបត្រដំបូង (Create First Invoice)
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.slice(0, 5).map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-blue-900">{inv.invoiceNo}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.date}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 font-khmer">{inv.customer.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {inv.customer.customerId}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                      {inv.totalCbm.toFixed(3)} m³
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900">
                      ${inv.grandTotal.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.payment.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.payment.status === 'PENDING_SLIP'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {inv.payment.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onPreviewInvoice(inv)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4 text-blue-700" />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Active Shipping Routes & China Hubs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-3">
            <span>🏭</span> ឃ្លាំងចិន / China Hubs & Rates
          </h2>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-950 font-khmer">📍 ឃ្លាំងក្វាងចូវ (Guangzhou Hub)</span>
                <span className="text-[10px] font-bold font-mono bg-blue-200/70 text-blue-900 px-2 py-0.5 rounded">
                  $145 / CBM
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Land & Sea forwarding. Transit time: 5-7 days (Land), 10-14 days (Sea).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-950 font-khmer">📍 ឃ្លាំងហ្វូសាន (Foshan Hub)</span>
                <span className="text-[10px] font-bold font-mono bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded">
                  $150 / CBM
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Heavy cargo, ceramics, electronics, and furniture consolidation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-950 font-khmer">📍 ឃ្លាំងយីវូ (Yiwu Hub)</span>
                <span className="text-[10px] font-bold font-mono bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded">
                  $155 / CBM
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Small commodities, accessories, and Taobao/1688 express parcels.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectTab('customers')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition text-center block"
            >
              👥 Open Customer Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
