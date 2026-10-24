# Eternal Logistics & A2M Express - Logistics Invoicing & Shipment Management System

A web-based logistics management and invoicing application designed specifically for **Cross-Border Freight Forwarding (China to Cambodia)** by Land, Sea, and Air.

Directly built from the invoice template designs in `Artboard 2.jpg` (Eternal Logistics) and `Artboard 1.jpg` (A2M Express).

---

## 🚀 Key Features

1. **Pixel-Perfect Invoice Printing & PDF Generation**:
   - Replicates the exact layout, Khmer typography (`Kantumruy Pro` / `Battambang`), header badges, color schemes, and 13 item columns.
   - Built-in `@media print` CSS optimized for clean A4 landscape paper and PDF exports.
   - Dynamic **ABA PAY / Bakong KHQR** QR Code generation with merchant account and payable invoice amount.

2. **Real-Time Automated Billing & Cargo Calculations**:
   - Automatic volume calculation: $\text{Total CBM} = \text{Quantity} \times \text{Unit CBM}$.
   - Automatic freight calculation: $\text{Shipping Cost} = \text{Total CBM} \times \text{Unit Price}$ (with one-click toggle to gross weight-based billing).
   - Real-time aggregation of **TOTAL ITEMS**, **TOTAL CBM**, **SUB TOTAL**, **DISCOUNTS**, **OTHER CHARGES**, and **GRAND TOTAL**.

3. **Multi-Brand Logistics Support**:
   - Switch between **Eternal Logistics** (Navy Blue & Amber theme) and **A2M Express** (Royal Blue & Red theme) or configure custom forwarders.
   - Configurable ABA Bank Account Names, Account Numbers, Contact phones, and Khmer liability policy clauses.

4. **Container & Manifest Tracking**:
   - Track shipments by Container / Cabinet No. (e.g., `CAB-2026-GZ-8891`).
   - Monitor transit lifecycle: `Loading in China` ➔ `In Transit` ➔ `Customs Clearance` ➔ `Arrived Cambodia Warehouse` ➔ `Distributed`.
   - See all customer invoices bundled inside each container.

5. **Customer Management (CRM)**:
   - Manage Customer IDs (e.g. `EL-8899`), Telegram accounts, Cambodian phone numbers, delivery addresses, and customer-specific pricing rates.

6. **Invoice Management & Export**:
   - Filter by status (`UNPAID`, `PENDING_SLIP`, `PAID`), shipping route, and brand.
   - 1-click Excel/CSV export of all manifests and invoices.
   - Duplicate, edit, and delete invoices.
   - Quick Telegram summary copy button for customer messaging.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Print Engine
- **Icons**: Lucide React
- **QR Engine**: `qrcode.react` (ABA KHQR & Bakong standard payload)
- **Persistence**: LocalStorage with realistic China-Cambodia mock data

---

## 🏃 Running the Application

### Development Server:
```bash
cd /Users/darith/Projects/eternal-logistics-invoicing
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build:
```bash
npm run build
npm run preview
```
