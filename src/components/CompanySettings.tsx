import React, { useState, useRef } from 'react';
import { CompanyProfile } from '../types';
import { Building2, Save, Plus, Check, Phone, Mail, Send, QrCode, Download, Upload, HardDrive } from 'lucide-react';

interface CompanySettingsProps {
  companies: CompanyProfile[];
  onUpdateCompany: (company: CompanyProfile) => void;
  onAddCompany: (company: CompanyProfile) => void;
  onExportBackup?: () => void;
  onImportBackup?: (data: any) => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({
  companies,
  onUpdateCompany,
  onAddCompany,
  onExportBackup,
  onImportBackup
}) => {
  const [activeCompanyId, setActiveCompanyId] = useState<string>(companies[0]?.id || 'eternal-logistics');
  const [successSaved, setSuccessSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];
  const [form, setForm] = useState<CompanyProfile>(activeCompany);

  const handleSelectCompany = (id: string) => {
    setActiveCompanyId(id);
    const selected = companies.find(c => c.id === id);
    if (selected) {
      setForm(selected);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(form);
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 2500);
  };

  const handleNoteChange = (index: number, val: string) => {
    const updatedNotes = [...form.notes];
    updatedNotes[index] = val;
    setForm({ ...form, notes: updatedNotes });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (onImportBackup) {
          onImportBackup(parsed);
          alert('Data successfully restored from backup file!');
        }
      } catch (err) {
        alert('Invalid backup file. Please select a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 font-khmer flex items-center gap-2">
            <span>⚙️</span> កំណត់រចនាសម្ព័ន្ធក្រុមហ៊ុន / Logistics Brand Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            គ្រប់គ្រងម៉ាកយីហោ គណនី ABA Bank លេខទូរស័ព្ទ និងខចែងលើវិក្កយបត្រ
          </p>
        </div>

        {/* Brand Selector Buttons */}
        <div className="flex items-center gap-2">
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCompany(c.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                activeCompanyId === c.id
                  ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Identity & Colors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            ព័ត៌មានម៉ាកយីហោ / Brand Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Brand Name (English)
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name (Khmer)
              </label>
              <input
                type="text"
                value={form.khmerName}
                onChange={(e) => setForm({ ...form, khmerName: e.target.value })}
                className="w-full text-xs font-khmer border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Route Header Text
              </label>
              <input
                type="text"
                value={form.routeTitle}
                onChange={(e) => setForm({ ...form, routeTitle: e.target.value })}
                className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Banking & ABA Scan-to-Pay QR Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-2">
            <QrCode className="w-4 h-4 text-amber-500" />
            ការទូទាត់ ABA PAY & KHQR / Bank Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ABA Account Name (ឈ្មោះគណនី)
              </label>
              <input
                type="text"
                required
                value={form.bankAccountName}
                onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ABA Account Number / Phone (លេខគណនី)
              </label>
              <input
                type="text"
                required
                value={form.bankAccountNumber}
                onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            QR code dynamically renders on printable invoices so customers can scan with any Bakong / ABA app to complete payment.
          </p>
        </div>

        {/* Contact Info & Warehouse Locations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            ទំនាក់ទំនង & ទីតាំងឃ្លាំង / Contact & Locations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Smart Phone(s)
              </label>
              <input
                type="text"
                value={form.smartPhone}
                onChange={(e) => setForm({ ...form, smartPhone: e.target.value })}
                className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cellcard Phone(s)
              </label>
              <input
                type="text"
                value={form.cellcardPhone}
                onChange={(e) => setForm({ ...form, cellcardPhone: e.target.value })}
                className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telegram Link / Channel
              </label>
              <input
                type="text"
                value={form.telegramLink}
                onChange={(e) => setForm({ ...form, telegramLink: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 5 Khmer Liability Notes on Invoice */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-2">
            <span>📝</span> កំណត់ចំណាំ និងលក្ខខណ្ឌវិក្កយបត្រ / Invoice Policy Notes
          </h2>

          <div className="space-y-2">
            {form.notes.map((note, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-bold text-xs text-blue-900 w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => handleNoteChange(idx, e.target.value)}
                  className="flex-1 text-xs font-khmer border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Backup & Restore (Google Drive Sync) Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-2">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            ការបម្រុងទុក និងស្តារទិន្នន័យ / Google Drive Backup & Restore
          </h2>
          <p className="text-xs text-slate-600">
            Export all invoices, customers, containers, and brand settings into a single backup JSON file that you can store in your Google Drive or restore on any computer.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onExportBackup && (
              <button
                type="button"
                onClick={onExportBackup}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>📥 Export Backup JSON (Save to Google Drive)</span>
              </button>
            )}

            {onImportBackup && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>📤 Restore from Google Drive JSON</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {successSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> បានរក្សាទុកជោគជ័យ! Saved successfully.
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-blue-900 text-white transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>រក្សាទុកព័ត៌មានក្រុមហ៊ុន / Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
