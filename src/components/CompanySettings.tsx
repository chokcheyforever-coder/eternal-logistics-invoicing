import React, { useState, useRef } from 'react';
import { CompanyProfile } from '../types';
import { Building2, Save, Plus, Check, Phone, Mail, Send, QrCode, Download, Upload, HardDrive, KeyRound, Camera, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface CompanySettingsProps {
  companies: CompanyProfile[];
  onUpdateCompany: (company: CompanyProfile) => void;
  onAddCompany: (company: CompanyProfile) => void;
  onExportBackup?: () => void;
  onImportBackup?: (data: any) => void;
  currentPin?: string;
  onUpdatePin?: (newPin: string) => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({
  companies,
  onUpdateCompany,
  onAddCompany,
  onExportBackup,
  onImportBackup,
  currentPin = '8899',
  onUpdatePin
}) => {
  const [activeCompanyId, setActiveCompanyId] = useState<string>(companies[0]?.id || 'eternal-logistics');
  const [successSaved, setSuccessSaved] = useState(false);
  const [pinInput, setPinInput] = useState(currentPin);
  const [pinSaved, setPinSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];
  const [form, setForm] = useState<CompanyProfile>(activeCompany);

  const handleQrPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Photo is too large! Please choose an image smaller than 8MB.');
      return;
    }

    // Auto-compress photo using canvas to optimize browser storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400; // Optimal for QR scan and lightweight
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          setForm((prev) => ({
            ...prev,
            qrImageUrl: compressed,
            qrMode: 'PHOTO'
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            qrImageUrl: event.target?.result as string,
            qrMode: 'PHOTO'
          }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    if (qrFileInputRef.current) qrFileInputRef.current.value = '';
  };

  const handleResetQrDefault = () => {
    const defaultUrl = form.id === 'eternal-logistics' ? './qr_eternal_logistics.png' : './qr_a2m_express.png';
    setForm((prev) => ({
      ...prev,
      qrImageUrl: defaultUrl,
      qrMode: 'PHOTO'
    }));
  };

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

        {/* Banking & ABA Scan-to-Pay QR Info & Photo Upload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-500" />
              <span>ការទូទាត់ ABA PAY & KHQR / Bank Details & QR Photo</span>
            </h2>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              ABA PAY & BAKONG
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Bank Info & QR Mode Selection */}
            <div className="lg:col-span-2 space-y-4">
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
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-400 focus:outline-none"
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
                    className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* QR Code Display Mode */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-800 font-khmer">
                  ទម្រង់បង្ហាញ QR Code លើវិក្កយបត្រ (QR Display Mode on Invoice):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition ${
                    (form.qrMode || 'PHOTO') === 'PHOTO'
                      ? 'bg-amber-50 border-amber-400 text-slate-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="qrMode"
                      checked={(form.qrMode || 'PHOTO') === 'PHOTO'}
                      onChange={() => setForm({ ...form, qrMode: 'PHOTO' })}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>📸 ប្រើរូបថត QR Code (Photo QR - Recommended)</span>
                  </label>

                  <label className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition ${
                    form.qrMode === 'DYNAMIC'
                      ? 'bg-amber-50 border-amber-400 text-slate-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="qrMode"
                      checked={form.qrMode === 'DYNAMIC'}
                      onChange={() => setForm({ ...form, qrMode: 'DYNAMIC' })}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>⚡ បង្កើត QR ស្វ័យប្រវត្តិ (Dynamic Amount)</span>
                  </label>
                </div>
              </div>

              {/* QR Payload URL (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom KHQR Deep Link / Payload (Optional)
                </label>
                <input
                  type="text"
                  value={form.qrPayload || ''}
                  onChange={(e) => setForm({ ...form, qrPayload: e.target.value })}
                  placeholder="https://qr.ababank.com/pay?acc=..."
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Right 1 Col: QR Photo Preview & Upload Controls */}
            <div className="flex flex-col items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-700 font-khmer">
                រូបថត QR Code បច្ចុប្បន្ន (Active QR Photo)
              </span>

              {/* Photo Box */}
              <div className="relative group p-2 bg-white rounded-xl border-2 border-dashed border-amber-400 shadow-sm flex items-center justify-center">
                <img
                  src={form.qrImageUrl || (form.id === 'eternal-logistics' ? './qr_eternal_logistics.png' : './qr_a2m_express.png')}
                  alt="QR Code Preview"
                  className="w-32 h-32 object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback to artboard photo if local path has trouble
                    (e.target as HTMLImageElement).src = form.id === 'eternal-logistics' ? './qr_eternal_logistics.png' : './qr_a2m_express.png';
                  }}
                />
              </div>

              {/* File Input for Uploading custom photo */}
              <input
                type="file"
                ref={qrFileInputRef}
                onChange={handleQrPhotoUpload}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />

              {/* Action Buttons */}
              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={() => qrFileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-lg text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition shadow flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>📸 ផ្លាស់ប្តូររូបថតថ្មី (Upload New Photo)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetQrDefault}
                  className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>🔄 ប្រើរូបដើមពីប្រព័ន្ធ (Reset Default)</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                ជ្រើសរើសរូបថត QR Code (PNG, JPG) ពីទូរស័ព្ទ ឬកុំព្យូទ័ររបស់អ្នក រូបភាពនឹងបង្ហាញលើវិក្កយបត្រភ្លាមៗ។
              </p>
            </div>
          </div>
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
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>ការបម្រុងទុក និងស្តារទិន្នន័យ / Google Drive Backup & Restore</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              ERP MIGRATION READY
            </span>
          </div>
          
          <p className="text-xs text-slate-600">
            Export all invoices, customers, containers, and brand settings into a single backup JSON file that you can store in your Google Drive or restore on any computer. When your permanent ERP system is finished in 1-2 months, this data can be imported directly without losing any shipment records.
          </p>

          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="font-bold flex items-center gap-1.5">
                <span>🛡️</span>
                <span>ការការពារទិន្នន័យសម្រាប់ 1-2 ខែ (1-2 Months Operational Safety)</span>
              </span>
              <p className="text-[11px] text-blue-800">
                ទិន្នន័យទាំងអស់ត្រូវរក្សាទុកស្វ័យប្រវត្តិក្នង Browser។ សូមចុច Export Backup ម្តងក្នុងមួយសប្តាហ៍ចូល Google Drive។
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onExportBackup && (
              <button
                type="button"
                onClick={onExportBackup}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
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

        {/* Company Access Passcode / PIN Security Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-khmer flex items-center gap-2 border-b pb-2">
            <KeyRound className="w-4 h-4 text-amber-500" />
            សុវត្ថិភាពលេខកូដសម្ងាត់ / Company Access PIN Lock
          </h2>
          <p className="text-xs text-slate-600">
            Set a 4-to-6 digit passcode required by staff to open the invoicing system on any computer or phone.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="w-48">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Company Passcode (PIN)
              </label>
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, ''));
                  setPinSaved(false);
                }}
                placeholder="e.g. 8899"
                className="w-full text-center font-mono font-black text-sm tracking-widest border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (pinInput.length >= 4 && onUpdatePin) {
                    onUpdatePin(pinInput);
                    setPinSaved(true);
                    setTimeout(() => setPinSaved(false), 2500);
                  } else {
                    alert('Please enter at least 4 digits for your PIN.');
                  }
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-blue-900 text-white transition shadow-sm"
              >
                Save New PIN
              </button>
              {pinSaved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> PIN Updated!
                </span>
              )}
            </div>
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
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>រក្សាទុកព័ត៌មានក្រុមហ៊ុន / Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
