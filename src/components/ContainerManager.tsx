import React, { useState } from 'react';
import { ContainerManifest, Invoice, TransportMode } from '../types';
import { Truck, Plus, CheckCircle, Clock, MapPin, Box, ArrowRight, ShieldCheck } from 'lucide-react';

interface ContainerManagerProps {
  containers: ContainerManifest[];
  invoices: Invoice[];
  onAddContainer: (container: ContainerManifest) => void;
  onUpdateStatus: (id: string, status: ContainerManifest['status']) => void;
  onSelectInvoice: (invoice: Invoice) => void;
}

export const ContainerManager: React.FC<ContainerManagerProps> = ({
  containers,
  invoices,
  onAddContainer,
  onUpdateStatus,
  onSelectInvoice
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [cabinetNo, setCabinetNo] = useState(`CAB-2026-GZ-${Math.floor(1000 + Math.random() * 9000)}`);
  const [mode, setMode] = useState<TransportMode>('LAND');
  const [origin, setOrigin] = useState('Guangzhou');
  const [destination, setDestination] = useState('Phnom Penh');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [arrivalDate, setArrivalDate] = useState(
    new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );

  const handleCreateContainer = (e: React.FormEvent) => {
    e.preventDefault();
    const newManifest: ContainerManifest = {
      id: 'cont-' + Date.now(),
      cabinetNo,
      mode,
      origin,
      destination,
      departureDate,
      arrivalDate,
      status: 'LOADING',
      totalCbm: 0,
      totalWeight: 0,
      totalPackages: 0,
      invoiceIds: []
    };
    onAddContainer(newManifest);
    setModalOpen(false);
  };

  const getStatusBadge = (status: ContainerManifest['status']) => {
    switch (status) {
      case 'LOADING':
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-bold">📦 LOADING (កំពុងផ្ទុកទំនិញ)</span>;
      case 'IN_TRANSIT':
        return <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-[11px] font-bold animate-pulse">🚚 IN TRANSIT (កំពុងធ្វើដំណើរ)</span>;
      case 'CUSTOMS':
        return <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-full text-[11px] font-bold">🏛️ CUSTOMS (ត្រួតពិនិត្យគយ)</span>;
      case 'ARRIVED':
        return <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full text-[11px] font-bold">📍 ARRIVED (ដល់ឃ្លាំងភ្នំពេញ)</span>;
      case 'DISTRIBUTED':
        return <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full text-[11px] font-bold">✓ DELIVERED (បានចែកចប់)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 font-khmer flex items-center gap-2">
            <span>🚚</span> គ្រប់គ្រងទូកុងតឺន័រ / Container & Manifest Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            តាមដានដំណើរទូកុងតឺន័រ ផ្លូវគោក ផ្លូវទឹក ផ្លូវអាកាស ពីប្រទេសចិនមកកម្ពុជា
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-blue-900 text-white transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ បង្កើតទូកុងតឺន័រថ្មី (New Manifest)</span>
        </button>
      </div>

      {/* Containers List */}
      <div className="space-y-4">
        {containers.map((cont) => {
          // Find linked invoices
          const linkedInvoices = invoices.filter(
            inv => inv.shipment.cabinetNo === cont.cabinetNo || cont.invoiceIds.includes(inv.id)
          );
          const computedTotalCbm = linkedInvoices.reduce((sum, inv) => sum + inv.totalCbm, 0);
          const computedTotalPkgs = linkedInvoices.reduce((sum, inv) => sum + inv.totalItem, 0);
          const computedTotalWeight = linkedInvoices.reduce((sum, inv) => sum + inv.totalWeight, 0);

          return (
            <div
              key={cont.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-slate-900">
                        {cont.cabinetNo}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {cont.mode === 'LAND' ? '🚚 LAND ផ្លូវគោក' : cont.mode === 'SEA' ? '🚢 SEA ផ្លូវទឹក' : '✈️ AIR ផ្លូវអាកាស'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-medium">Origin: <strong>{cont.origin}</strong></span>
                      <span>➔</span>
                      <span className="font-medium">Destination: <strong>{cont.destination}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(cont.status)}
                  <select
                    value={cont.status}
                    onChange={(e) => onUpdateStatus(cont.id, e.target.value as any)}
                    className="text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-slate-50 font-bold focus:outline-none"
                  >
                    <option value="LOADING">📦 LOADING</option>
                    <option value="IN_TRANSIT">🚚 IN TRANSIT</option>
                    <option value="CUSTOMS">🏛️ CUSTOMS</option>
                    <option value="ARRIVED">📍 ARRIVED</option>
                    <option value="DISTRIBUTED">✓ DISTRIBUTED</option>
                  </select>
                </div>
              </div>

              {/* Progress & Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Departure Date</span>
                  <span className="font-mono font-bold text-slate-800">{cont.departureDate}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Arrival Date</span>
                  <span className="font-mono font-bold text-blue-900">{cont.arrivalDate}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Consolidated CBM</span>
                  <span className="font-mono font-black text-amber-600">
                    {(computedTotalCbm || cont.totalCbm).toFixed(3)} m³
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Packages</span>
                  <span className="font-mono font-black text-purple-900">
                    {(computedTotalPkgs || cont.totalPackages)} pkgs ({((computedTotalWeight || cont.totalWeight))}kg)
                  </span>
                </div>
              </div>

              {/* Associated Customer Invoices in this container */}
              {linkedInvoices.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2 font-khmer">
                    📦 វិក្កយបត្រក្នុងទូនេះ ({linkedInvoices.length} invoices):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {linkedInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => onSelectInvoice(inv)}
                        className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-mono font-bold text-blue-900">{inv.invoiceNo}</div>
                          <div className="text-[11px] text-slate-600 font-khmer truncate max-w-[150px]">
                            {inv.customer.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900">${inv.grandTotal.toFixed(2)}</div>
                          <div className="text-[10px] font-mono text-slate-500">{inv.totalCbm.toFixed(2)}m³</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: New Container */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-khmer mb-4">
              🚢 បង្កើតទូកុងតឺន័រថ្មី / Create Container Manifest
            </h3>
            <form onSubmit={handleCreateContainer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cabinet / Container No. (លេខទូកុងតឺន័រ)
                </label>
                <input
                  type="text"
                  required
                  value={cabinetNo}
                  onChange={(e) => setCabinetNo(e.target.value)}
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transportation Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as TransportMode)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="LAND">🚚 LAND (ផ្លូវគោក 5-7 ថ្ងៃ)</option>
                  <option value="SEA">🚢 SEA (ផ្លូវទឹក 12-16 ថ្ងៃ)</option>
                  <option value="AIR">✈️ AIR (ផ្លូវអាកាស 2-3 ថ្ងៃ)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Origin China Hub
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Guangzhou">Guangzhou (ក្វាងចូវ)</option>
                    <option value="Foshan">Foshan (ហ្វូសាន)</option>
                    <option value="Yiwu">Yiwu (យីវូ)</option>
                    <option value="Shenzhen">Shenzhen (សិនជិន)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Arrival
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0B2545] hover:bg-blue-900 text-white rounded-lg shadow-sm"
                >
                  Save Container
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
