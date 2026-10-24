import React, { useState, useEffect } from 'react';
import { 
  Invoice, 
  Customer, 
  CompanyProfile, 
  ContainerManifest,
  PaymentStatus 
} from './types';
import { 
  COMPANY_PROFILES, 
  INITIAL_CUSTOMERS, 
  INITIAL_INVOICES, 
  INITIAL_CONTAINERS 
} from './data/mockData';
import { Dashboard } from './components/Dashboard';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceEditor } from './components/InvoiceEditor';
import { CustomerManager } from './components/CustomerManager';
import { ContainerManager } from './components/ContainerManager';
import { CompanySettings } from './components/CompanySettings';
import { PreviewModal } from './components/PreviewModal';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Users, 
  Truck, 
  Settings, 
  Menu, 
  X,
  Printer
} from 'lucide-react';

export const App: React.FC = () => {
  // Local storage state initialization
  const [companies, setCompanies] = useState<CompanyProfile[]>(() => {
    const saved = localStorage.getItem('eternal_companies');
    return saved ? JSON.parse(saved) : COMPANY_PROFILES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('eternal_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('eternal_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [containers, setContainers] = useState<ContainerManifest[]>(() => {
    const saved = localStorage.getItem('eternal_containers');
    return saved ? JSON.parse(saved) : INITIAL_CONTAINERS;
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('eternal_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('eternal_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('eternal_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('eternal_containers', JSON.stringify(containers));
  }, [containers]);

  // Invoice Handlers
  const handleSaveInvoice = (savedInvoice: Invoice) => {
    const existingIndex = invoices.findIndex((i) => i.id === savedInvoice.id);
    if (existingIndex >= 0) {
      const updated = [...invoices];
      updated[existingIndex] = savedInvoice;
      setInvoices(updated);
    } else {
      setInvoices([savedInvoice, ...invoices]);
    }
    setEditingInvoice(undefined);
    setActiveTab('invoices');
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter((i) => i.id !== id));
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    const duplicated: Invoice = {
      ...invoice,
      id: 'inv-' + Date.now(),
      invoiceNo: `INV-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      payment: {
        ...invoice.payment,
        status: 'UNPAID',
        paidAmount: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInvoices([duplicated, ...invoices]);
  };

  const handleStatusChange = (id: string, status: PaymentStatus) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              payment: {
                ...inv.payment,
                status,
                paidAmount: status === 'PAID' ? inv.grandTotal : 0
              }
            }
          : inv
      )
    );
  };

  // Customer Handlers
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);
  };

  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers(customers.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  // Container Handlers
  const handleAddContainer = (newContainer: ContainerManifest) => {
    setContainers([newContainer, ...containers]);
  };

  const handleUpdateContainerStatus = (id: string, status: ContainerManifest['status']) => {
    setContainers(containers.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  // Backup and Restore (Google Drive sync)
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      companies,
      customers,
      invoices,
      containers
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eternal_logistics_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (data: any) => {
    if (data.companies && Array.isArray(data.companies)) setCompanies(data.companies);
    if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
    if (data.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices);
    if (data.containers && Array.isArray(data.containers)) setContainers(data.containers);
  };

  // Company Handlers
  const handleUpdateCompany = (updated: CompanyProfile) => {
    setCompanies(companies.map((c) => (c.id === updated.id ? updated : c)));
  };

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'ទំព័រដើម / Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'វិក្កយបត្រ / Invoices', icon: FileText, count: invoices.length },
    { id: 'new-invoice', label: '+ ចេញវិក្កយបត្រ / New', icon: PlusCircle, highlight: true },
    { id: 'containers', label: 'ទូកុងតឺន័រ / Containers', icon: Truck, count: containers.length },
    { id: 'customers', label: 'អតិថិជន / Customers', icon: Users, count: customers.length },
    { id: 'settings', label: 'ការកំណត់ / Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      {/* Top Main Navigation Bar */}
      <header className="no-print bg-[#0B2545] text-white border-b border-blue-950 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow">
              EL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wide text-sm sm:text-base text-white">
                  ENTERNAL LOGISTICS
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/40 font-mono">
                  CHINA ➔ CAMBODIA
                </span>
              </div>
              <p className="text-[10px] text-sky-200 font-khmer">
                ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ និងទំនិញដឹកជញ្ជូន
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'new-invoice') {
                      setEditingInvoice(undefined);
                    }
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    item.highlight
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                      : isActive
                      ? 'bg-white/15 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-khmer">{item.label.split(' / ')[0]}</span>
                  {item.count !== undefined && !item.highlight && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-900 bg-[#071E3D] px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'new-invoice') {
                      setEditingInvoice(undefined);
                    }
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                    item.highlight
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : isActive
                      ? 'bg-white/20 text-white'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 font-khmer">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            invoices={invoices}
            containers={containers}
            companies={companies}
            onNewInvoice={() => {
              setEditingInvoice(undefined);
              setActiveTab('new-invoice');
            }}
            onPreviewInvoice={(inv) => setPreviewInvoice(inv)}
            onViewAllInvoices={() => setActiveTab('invoices')}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceList
            invoices={invoices}
            companies={companies}
            onNewInvoice={() => {
              setEditingInvoice(undefined);
              setActiveTab('new-invoice');
            }}
            onEditInvoice={(inv) => {
              setEditingInvoice(inv);
              setActiveTab('new-invoice');
            }}
            onPreviewInvoice={(inv) => setPreviewInvoice(inv)}
            onDeleteInvoice={handleDeleteInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
            onStatusChange={handleStatusChange}
          />
        )}

        {activeTab === 'new-invoice' && (
          <InvoiceEditor
            initialInvoice={editingInvoice}
            companies={companies}
            customers={customers}
            onSave={handleSaveInvoice}
            onCancel={() => {
              setEditingInvoice(undefined);
              setActiveTab('invoices');
            }}
            onPreview={(inv) => setPreviewInvoice(inv)}
            onCreateCustomer={handleAddCustomer}
          />
        )}

        {activeTab === 'containers' && (
          <ContainerManager
            containers={containers}
            invoices={invoices}
            onAddContainer={handleAddContainer}
            onUpdateStatus={handleUpdateContainerStatus}
            onSelectInvoice={(inv) => setPreviewInvoice(inv)}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerManager
            customers={customers}
            invoices={invoices}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        )}

        {activeTab === 'settings' && (
          <CompanySettings
            companies={companies}
            onUpdateCompany={handleUpdateCompany}
            onAddCompany={(newComp) => setCompanies([...companies, newComp])}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* Print / Full Preview Modal */}
      {previewInvoice && (
        <PreviewModal
          invoice={previewInvoice}
          company={companies.find((c) => c.id === previewInvoice.companyProfileId) || companies[0]}
          isOpen={Boolean(previewInvoice)}
          onClose={() => setPreviewInvoice(null)}
        />
      )}

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ENTERNAL LOGISTICS & A2M EXPRESS. Invoicing & Freight Forwarding System.</p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>China Warehouses: Guangzhou • Foshan • Yiwu</span>
            <span>•</span>
            <span>Cambodia Express Delivery</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
