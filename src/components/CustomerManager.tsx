import React, { useState } from 'react';
import { Customer, Invoice } from '../types';
import { Search, Plus, Edit, Trash2, Phone, MapPin, Send, User } from 'lucide-react';

interface CustomerManagerProps {
  customers: Customer[];
  invoices: Invoice[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({
  customers,
  invoices,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [form, setForm] = useState<Omit<Customer, 'id'>>({
    customerId: '',
    name: '',
    phone: '',
    telegram: '',
    address: '',
    destination: 'Phnom Penh, Cambodia',
    defaultRate: 145
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setForm({
      customerId: `EL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      phone: '',
      telegram: '',
      address: '',
      destination: 'Phnom Penh, Cambodia',
      defaultRate: 145
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      customerId: customer.customerId,
      name: customer.name,
      phone: customer.phone,
      telegram: customer.telegram || '',
      address: customer.address,
      destination: customer.destination,
      defaultRate: customer.defaultRate || 145
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        ...form
      });
    } else {
      onAddCustomer({
        id: 'cust-' + Date.now(),
        ...form
      });
    }
    setModalOpen(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#0B2545] text-amber-400 font-black shadow-md">
            <User className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 font-khmer flex items-center gap-2">
              គ្រប់គ្រងអតិថិជន / Customer Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              បញ្ជីឈ្មោះអតិថិជន លេខកូដសម្គាល់ និងអាសយដ្ឋានដឹកជញ្ជូននៅកម្ពុជា
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ បង្កើតអតិថិជនថ្មី (New Customer)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Search className="w-4 h-4 absolute left-7 top-7 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Customer ID, Name, Phone, or Address..."
          className="w-full text-xs pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const customerInvoices = invoices.filter(inv => inv.customer.id === cust.id || inv.customer.customerId === cust.customerId);
          const totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
          const totalCbm = customerInvoices.reduce((sum, inv) => sum + inv.totalCbm, 0);

          return (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center font-bold text-sm">
                      <User className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm font-khmer">
                        {cust.name}
                      </h3>
                      <span className="font-mono text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        {cust.customerId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cust)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-amber-600" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete customer ${cust.name}?`)) {
                          onDeleteCustomer(cust.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-medium text-slate-900">{cust.phone}</span>
                  </div>
                  {cust.telegram && (
                    <div className="flex items-center gap-2 text-sky-600">
                      <Send className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px]">{cust.telegram}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="font-khmer text-[11px] text-slate-700 leading-tight">
                      {cust.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Invoices</span>
                  <span className="font-mono font-bold text-slate-900">{customerInvoices.length}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Total CBM</span>
                  <span className="font-mono font-bold text-blue-900">{totalCbm.toFixed(2)}m³</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Total Spent</span>
                  <span className="font-mono font-bold text-emerald-700">${totalSpent.toFixed(0)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add/Edit Customer */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-khmer mb-4">
              {editingCustomer ? 'កែសម្រួលព័ត៌មានអតិថិជន / Edit Customer' : 'បង្កើតអតិថិជនថ្មី / Add New Customer'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer ID (លេខកូដអតិថិជន)
                </label>
                <input
                  type="text"
                  required
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Full Name (ឈ្មោះអតិថិជន)
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sokha Mean"
                  className="w-full text-xs font-khmer border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (លេខទូរស័ព្ទ)
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="012 888 999"
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telegram Username
                  </label>
                  <input
                    type="text"
                    value={form.telegram}
                    onChange={(e) => setForm({ ...form, telegram: e.target.value })}
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
                  rows={3}
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="ផ្ទះលេខ... ផ្លូវ... សង្កាត់... ខណ្ឌ... រាជធានីភ្នំពេញ"
                  className="w-full text-xs font-khmer border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination City
                  </label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default CBM Rate ($)
                  </label>
                  <input
                    type="number"
                    value={form.defaultRate}
                    onChange={(e) => setForm({ ...form, defaultRate: Number(e.target.value) || 145 })}
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
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
