import React from 'react';
import { PrintableInvoice } from './PrintableInvoice';
import { Invoice, CompanyProfile } from '../types';
import { X, Printer, Download, Share2, Check } from 'lucide-react';

interface PreviewModalProps {
  invoice: Invoice;
  company: CompanyProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  invoice,
  company,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `📦 ${company.name || 'LOGISTICS'} INVOICE
№: ${invoice.invoiceNo}
Customer: ${invoice.customer.name} (${invoice.customer.customerId})
Container: ${invoice.shipment.cabinetNo}
Total Items: ${invoice.totalItem} pkgs
Total CBM: ${invoice.totalCbm.toFixed(3)} m³
Grand Total: $${invoice.grandTotal.toFixed(2)}
ABA Pay: ${company.bankAccountName} (${company.bankAccountNumber})
Status: ${invoice.payment.status}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-start p-4 sm:p-6">
      {/* Top Floating Control Bar (Hidden when printing!) */}
      <div className="no-print max-w-[1000px] w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-5 py-3 mb-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
          <div>
            <h3 className="text-sm font-bold tracking-wide">
              Print Preview • {invoice.invoiceNo}
            </h3>
            <p className="text-[11px] text-slate-400">
              Formatted for standard A4 landscape sheet printing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied Telegram Text!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Actual Printable Invoice Component */}
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 overflow-x-auto max-w-[1050px] w-full border border-slate-300">
        <PrintableInvoice invoice={invoice} company={company} />
      </div>
    </div>
  );
};
