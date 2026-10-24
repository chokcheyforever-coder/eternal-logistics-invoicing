import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Invoice, CompanyProfile } from '../types';

interface PrintableInvoiceProps {
  invoice: Invoice;
  company: CompanyProfile;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice, company }) => {
  // Ensure we have at least 7 rows to match the artboard grid height
  const paddedItems = [...invoice.items];
  const minRows = Math.max(7, invoice.items.length);
  while (paddedItems.length < minRows) {
    paddedItems.push({
      id: `empty-${paddedItems.length + 1}`,
      no: paddedItems.length + 1,
      warehouseInboundNo: '',
      trackingNo: '',
      itemName: '',
      itemType: '',
      quantity: 0,
      cbm: 0,
      totalWeight: 0,
      totalQuantity: 0,
      totalCbm: 0,
      unitPrice: 0,
      shippingCost: 0,
      chinaWarehouse: ''
    });
  }

  // Generate ABA KHQR payload string (Standard KHQR string or payment deeplink)
  const qrValue = company.qrPayload 
    ? `${company.qrPayload}&amount=${invoice.grandTotal.toFixed(2)}&inv=${invoice.invoiceNo}`
    : `https://checkout.ababank.com/pay?account=${company.bankAccountNumber}&amount=${invoice.grandTotal.toFixed(2)}&ref=${invoice.invoiceNo}`;

  return (
    <div className="printable-invoice bg-white text-slate-900 mx-auto select-none font-sans" style={{ width: '1000px', minHeight: '700px' }}>
      {/* ================= HEADER BANNER ================= */}
      <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-r from-[#071E3D] via-[#0B2545] to-[#134B70] text-white p-4 shadow-md">
        {/* Background Cargo Silhouette Decoration */}
        <div className="absolute right-48 top-0 bottom-0 opacity-20 pointer-events-none flex items-center gap-4">
          <svg className="w-40 h-28 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          {/* Company Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-amber-400 bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <div className="text-center">
                <span className="text-amber-400 font-extrabold text-xl tracking-tighter block leading-none">M</span>
                <span className="text-[9px] font-bold text-sky-200 tracking-widest block uppercase">Logistics</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider text-amber-400 drop-shadow-sm font-sans uppercase">
                {company.name}
              </h1>
              <p className="text-[11px] font-semibold tracking-widest text-sky-200 uppercase">
                {company.tagline}
              </p>
              {/* Service Badges */}
              <div className="flex items-center gap-3 mt-1.5 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-amber-300">
                  <span>🚢</span> SEA
                </span>
                <span className="text-slate-400">|</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <span>🚚</span> LAND
                </span>
                <span className="text-slate-400">|</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <span>✈️</span> AIR
                </span>
              </div>
            </div>
          </div>

          {/* Route Badge (China to Cambodia) */}
          <div className="bg-white/10 backdrop-blur-md border border-amber-400/40 rounded-lg px-4 py-1.5 text-center shadow-sm">
            <div className="text-[12px] font-black tracking-widest text-amber-400">
              CHINA - TO - CAMBODIA
            </div>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-base" title="Cambodia">🇰🇭</span>
              <span className="text-amber-300 text-xs">⇄</span>
              <span className="text-base" title="China">🇨🇳</span>
            </div>
          </div>

          {/* Document Title: INVOICE / វិក្កយបត្រ */}
          <div className="text-right">
            <h2 className="text-3xl font-black text-white tracking-wider leading-none">
              INVOICE
            </h2>
            <div className="text-2xl font-bold text-amber-400 font-khmer mt-0.5">
              វិក្កយបត្រ
            </div>
            <div className="text-[11px] text-sky-200 font-mono mt-1">
              № {invoice.invoiceNo} | Date: {invoice.date}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CUSTOMER & SHIPMENT SECTION ================= */}
      <div className="grid grid-cols-2 gap-3 mt-2.5">
        {/* Customer Information Box */}
        <div className="border border-[#0B2545] rounded-md overflow-hidden shadow-sm">
          <div className="bg-[#0B2545] text-white px-3 py-1 text-xs font-bold font-khmer flex items-center gap-2">
            <span>👤</span>
            <span>ព័ត៌មានអតិថិជន / CUSTOMER INFORMATION</span>
          </div>
          <div className="p-2 space-y-1.5 text-xs bg-slate-50/60">
            <div className="flex items-start">
              <span className="w-28 font-bold text-slate-700">Customer ID :</span>
              <span className="font-bold text-blue-900 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {invoice.customer.customerId}
              </span>
              <span className="ml-2 font-medium text-slate-800 font-khmer truncate">
                {invoice.customer.name}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-28 font-bold text-slate-700">Address :</span>
              <span className="flex-1 text-slate-800 font-khmer text-[11px] leading-tight">
                {invoice.customer.address}
              </span>
            </div>
            <div className="flex items-center text-[11px] text-slate-600">
              <span className="w-28 font-semibold">Phone / Tel :</span>
              <span className="font-mono text-slate-900 font-medium">{invoice.customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Shipment Information Box */}
        <div className="border border-[#0B2545] rounded-md overflow-hidden shadow-sm">
          <div className="bg-[#0B2545] text-white px-3 py-1 text-xs font-bold font-khmer flex items-center gap-2">
            <span>🚚</span>
            <span>ព័ត៌មានដឹកជញ្ជូន / SHIPMENT INFORMATION</span>
          </div>
          <div className="p-2 space-y-1.5 text-xs bg-slate-50/60">
            <div className="flex items-center">
              <span className="w-36 font-bold text-slate-700">Transportation :</span>
              <div className="flex items-center gap-3">
                <label className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded border text-[11px] ${
                  invoice.shipment.transportation === 'LAND'
                    ? 'bg-amber-100 border-amber-500 text-amber-900 font-extrabold'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  LAND
                </label>
                <label className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded border text-[11px] ${
                  invoice.shipment.transportation === 'SEA'
                    ? 'bg-sky-100 border-sky-500 text-sky-900 font-extrabold'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  SEA
                </label>
                <label className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded border text-[11px] ${
                  invoice.shipment.transportation === 'AIR'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-extrabold'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  AIR
                </label>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-36 font-bold text-slate-700">Cabinet / Container No. :</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-200/60 px-2 py-0.5 rounded">
                {invoice.shipment.cabinetNo || '---'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center">
                <span className="font-bold text-slate-700 mr-1">Origin (From):</span>
                <span className="text-slate-800 font-khmer">{invoice.shipment.origin}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-slate-700 mr-1">Destination (To):</span>
                <span className="text-slate-800 font-khmer">{invoice.shipment.destination}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ITEMS DETAILS TABLE ================= */}
      <div className="mt-2.5 border border-[#0B2545] rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            {/* Top Category Split Header */}
            <tr className="text-white font-khmer text-xs">
              <th colSpan={10} className="bg-[#0B2545] py-1 px-2 text-center border-r border-slate-600 font-bold tracking-wide">
                📋 ព័ត៌មានទំនិញ (GOODS INFORMATION)
              </th>
              <th colSpan={3} className="bg-[#F5A623] text-slate-950 py-1 px-2 text-center font-bold tracking-wide">
                💰 ព័ត៌មានតម្លៃ (PRICE INFORMATION)
              </th>
            </tr>
            {/* Column Headers */}
            <tr className="bg-[#E8F1F5] text-slate-900 font-bold border-y border-[#0B2545] font-khmer text-center">
              <th className="py-1 px-1 border-r border-slate-300 w-8">No.</th>
              <th className="py-1 px-1 border-r border-slate-300 w-24">លេខចូលឃ្លាំង</th>
              <th className="py-1 px-1 border-r border-slate-300 w-28">លេខដឹកជញ្ជូន</th>
              <th className="py-1 px-1 border-r border-slate-300">ឈ្មោះទំនិញ</th>
              <th className="py-1 px-1 border-r border-slate-300 w-24">ប្រភេទទំនិញ</th>
              <th className="py-1 px-1 border-r border-slate-300 w-12">ចំនួន</th>
              <th className="py-1 px-1 border-r border-slate-300 w-14">ម៉ែត្រគូប</th>
              <th className="py-1 px-1 border-r border-slate-300 w-14">ទម្ងន់សរុប</th>
              <th className="py-1 px-1 border-r border-slate-300 w-14">ចំនួនសរុប</th>
              <th className="py-1 px-1 border-r border-slate-400 w-16">ម៉ែត្រគូបសរុប</th>
              <th className="py-1 px-1 border-r border-slate-300 w-16 bg-amber-50">តម្លៃឯកតា</th>
              <th className="py-1 px-1 border-r border-slate-300 w-20 bg-amber-50">តម្លៃដឹកជញ្ជូន</th>
              <th className="py-1 px-1 w-16 bg-amber-50">ឃ្លាំងចិន</th>
            </tr>
          </thead>
          <tbody>
            {paddedItems.map((item, index) => {
              const hasData = Boolean(item.itemName || item.trackingNo || item.warehouseInboundNo);
              return (
                <tr 
                  key={item.id} 
                  className={`border-b border-slate-200 text-center ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  } ${!hasData ? 'h-6 text-transparent' : 'h-7'}`}
                >
                  <td className="py-1 px-1 border-r border-slate-200 font-medium text-slate-700">
                    {index + 1}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-mono text-[10px] text-slate-800">
                    {hasData ? item.warehouseInboundNo : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-mono text-[10px] text-blue-900 font-semibold truncate max-w-[110px]">
                    {hasData ? item.trackingNo : ''}
                  </td>
                  <td className="py-1 px-2 border-r border-slate-200 text-left font-khmer text-slate-900 truncate max-w-[160px]">
                    {hasData ? item.itemName : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-khmer text-slate-700 text-[10px] truncate max-w-[90px]">
                    {hasData ? item.itemType : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-semibold text-slate-900">
                    {hasData ? item.quantity || '-' : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-mono text-slate-800">
                    {hasData && item.cbm ? item.cbm.toFixed(3) : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-mono text-slate-800">
                    {hasData && item.totalWeight ? `${item.totalWeight}kg` : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-semibold text-slate-900">
                    {hasData ? item.totalQuantity || '-' : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-300 font-mono font-bold text-blue-950">
                    {hasData && item.totalCbm ? item.totalCbm.toFixed(3) : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-mono text-slate-800 bg-amber-50/40">
                    {hasData && item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : ''}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 font-mono font-bold text-emerald-800 bg-amber-50/40">
                    {hasData && item.shippingCost ? `$${item.shippingCost.toFixed(2)}` : ''}
                  </td>
                  <td className="py-1 px-1 font-khmer text-[10px] text-slate-700 bg-amber-50/40">
                    {hasData ? item.chinaWarehouse : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= SUMMARY & PAYMENT BOTTOM SECTION ================= */}
      <div className="grid grid-cols-12 gap-3 mt-2.5">
        {/* Left: Policy & Notes (5 points in Khmer) */}
        <div className="col-span-5 border border-[#0B2545] rounded-md overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="bg-[#0B2545] text-white px-3 py-1 text-xs font-bold font-khmer flex items-center gap-1.5">
            <span>📝</span>
            <span>កំណត់ចំណាំ / Notes</span>
          </div>
          <div className="p-2 text-[10px] font-khmer text-slate-800 space-y-1 leading-normal bg-slate-50/40 flex-1">
            {company.notes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-1">
                <span className="font-bold text-blue-900">{idx + 1}.</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Totals Summary Grid */}
        <div className="col-span-4 border border-[#0B2545] rounded-md overflow-hidden shadow-sm flex flex-col justify-between bg-slate-50">
          <div className="divide-y divide-slate-200 text-xs">
            <div className="flex justify-between items-center px-3 py-1">
              <span className="font-bold text-slate-700">TOTAL ITEM :</span>
              <span className="font-mono font-bold text-slate-900">{invoice.totalItem} pcs</span>
            </div>
            <div className="flex justify-between items-center px-3 py-1">
              <span className="font-bold text-slate-700">TOTAL CBM :</span>
              <span className="font-mono font-bold text-blue-900">{invoice.totalCbm.toFixed(3)} m³</span>
            </div>
            <div className="flex justify-between items-center px-3 py-1">
              <span className="font-bold text-slate-700">SUB TOTAL :</span>
              <span className="font-mono font-bold text-slate-900">${invoice.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-1">
              <span className="font-bold text-slate-700">DISCOUNT :</span>
              <span className="font-mono font-bold text-red-600">-${invoice.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-1">
              <span className="font-bold text-slate-700">OTHER CHARGES :</span>
              <span className="font-mono font-bold text-slate-900">+${invoice.otherCharges.toFixed(2)}</span>
            </div>
          </div>
          {/* Grand Total Bar */}
          <div className="bg-[#0B2545] text-white px-3 py-2 flex justify-between items-center">
            <span className="text-xs font-black tracking-wider text-amber-400">GRAND TOTAL:</span>
            <span className="text-xl font-black font-mono text-amber-400">
              ${invoice.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right: Payment & ABA KHQR Box */}
        <div className="col-span-3 border border-amber-500 rounded-md overflow-hidden shadow-sm flex flex-col justify-between bg-amber-50/20">
          <div className="bg-[#F5A623] text-slate-950 px-3 py-1 text-xs font-bold font-khmer flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>💳</span> ការទូទាត់ / PAYMENT
            </span>
            <span className="text-[10px] font-mono font-bold bg-white/80 px-1.5 rounded">ABA</span>
          </div>

          <div className="p-2 flex flex-col items-center justify-center text-center">
            {/* ABA PAY Header */}
            <div className="text-xs font-black tracking-tight text-blue-950 flex items-center gap-1 mb-1">
              <span className="text-red-600">ABA'</span> PAY
              <span className="text-[9px] font-bold text-slate-500 font-sans">SCAN TO PAY</span>
            </div>

            {/* Live QR Code (Bakong / ABA KHQR) */}
            <div className="p-1 bg-white rounded border border-slate-200 shadow-sm">
              <QRCodeSVG 
                value={qrValue} 
                size={82} 
                level="M" 
                fgColor="#0B2545"
                bgColor="#FFFFFF"
              />
            </div>

            {/* Account Details */}
            <div className="mt-1.5 text-[9px] space-y-0.5 w-full">
              <div className="font-bold text-slate-900 leading-tight truncate">
                {company.bankAccountName}
              </div>
              <div className="font-mono font-extrabold text-blue-900 text-[11px]">
                {company.bankAccountNumber}
              </div>
              <div className="text-[8px] font-khmer text-slate-600 leading-tight mt-1">
                សូមផ្ញើបង្កាន់ដៃបញ្ជាក់ការទូទាត់ប្រាក់ បន្ទាប់ពីទូទាត់រួច
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER CONTACT BAR ================= */}
      <div className="mt-2.5 rounded-b-xl bg-[#071E3D] text-white p-2.5 text-[10px] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold font-khmer">📞 ទំនាក់ទំនង / CONTACT US</span>
          <span className="text-slate-400">|</span>
          <span className="text-sky-200">Smart: <strong className="text-white">{company.smartPhone}</strong></span>
          <span className="text-slate-400">|</span>
          <span className="text-sky-200">Cellcard: <strong className="text-white">{company.cellcardPhone}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-300">
            <span>📍 Warehouses:</span>
            <span className="text-amber-300 font-semibold">{company.warehouses.join(' | ')}</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <span>✉️</span>
            <span>{company.email}</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1 text-sky-400">
            <span>✈️ Telegram:</span>
            <span className="font-mono text-white underline">{company.telegramLink.replace('https://', '')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
