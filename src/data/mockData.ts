import { CompanyProfile, Customer, Invoice, ContainerManifest } from '../types';

export const COMPANY_PROFILES: CompanyProfile[] = [
  {
    id: 'eternal-logistics',
    name: 'ENTERNAL LOGISTICS',
    khmerName: 'អុីថឺណល ឡូជីស្ទីក',
    tagline: 'YOUR CARGO. OUR RESPONSIBILITY',
    routeTitle: 'CHINA - TO - CAMBODIA',
    primaryColor: '#0B2545',
    secondaryColor: '#004B87',
    accentColor: '#F5A623',
    logoText: 'ETERNAL LOGISTICS',
    smartPhone: '010 311 321',
    cellcardPhone: '011 311 321',
    warehouses: ['Guangzhou', 'Foshan', 'Yiwu'],
    email: 'eternallogistics99@gmail.com',
    telegramLink: 'https://t.me/ETERNAL_LOGISTICS',
    bankAccountName: 'ETERNAL LOGISTICS by S.P',
    bankAccountNumber: '010 311 321',
    qrPayload: 'https://qr.ababank.com/pay?acc=010311321&name=ETERNAL+LOGISTICS+BY+SP',
    notes: [
      'សូមអតិថិជនពិនិត្យចំនួនទំនិញ និងតម្លៃឱ្យបានត្រឹមត្រូវ មុនពេលទទួលទំនិញ។',
      'បន្ទាប់ពីទទួលទំនិញ សូមពិនិត្យស្ថានភាពទំនិញ និងជូនដំណឹងភ្លាមៗប្រសិនបើមានបញ្ហា',
      'ពេលវេលាដឹកជញ្ជូនអាចប្រែប្រួល ដោយសារអាកាសធាតុ ការត្រួតពិនិត្យ អាជ្ញាធរគយ ឬកត្តាផ្សេងៗ ដែលក្រុមហ៊ុនមិនអាចគ្រប់គ្រងបាន។',
      'ទំនិញពិសេស ឬទំនិញហាមឃាត់ អតិថិជនត្រូវជូនដំណឹងជាមុនអំពីទំនិញដែលមានការរឹតត្បិត ឬតម្រូវឱ្យមានលិខិតអនុញ្ញាត។',
      'វិក្កយបត្រនេះប្រើប្រាស់សម្រាប់តែក្រុមហ៊ុនយើងខ្ញុំប៉ុណ្ណោះ។'
    ]
  },
  {
    id: 'a2m-express',
    name: 'A2M EXPRESS',
    khmerName: 'អេច ធូ អឹម អិចប្រេស',
    tagline: 'FAST . SAFE . RELIABLE',
    routeTitle: 'CHINA - TO - CAMBODIA',
    primaryColor: '#003B73',
    secondaryColor: '#E30613',
    accentColor: '#005FB8',
    logoText: 'A2M EXPRESS',
    smartPhone: '010 567 756 | 086 589 599',
    cellcardPhone: '089 567 756 | 092 589 599',
    warehouses: ['Guangzhou', 'Foshan', 'Yiwu'],
    email: 'a2mexpress168@gmail.com',
    telegramLink: 'https://t.me/A2M_Express_Cambodia',
    bankAccountName: 'PRAK SOEUNAMATAK',
    bankAccountNumber: '010 567 756',
    qrPayload: 'https://qr.ababank.com/pay?acc=010567756&name=PRAK+SOEUNAMATAK',
    notes: [
      'សូមអតិថិជនពិនិត្យចំនួនទំនិញ និងតម្លៃឱ្យបានត្រឹមត្រូវ មុនពេលទទួលទំនិញ។',
      'បន្ទាប់ពីទទួលទំនិញ សូមពិនិត្យស្ថានភាពទំនិញ និងជូនដំណឹងភ្លាមៗប្រសិនបើមានបញ្ហា',
      'ពេលវេលាដឹកជញ្ជូនអាចប្រែប្រួល ដោយសារអាកាសធាតុ ការត្រួតពិនិត្យ អាជ្ញាធរគយ ឬកត្តាផ្សេងៗ ដែលក្រុមហ៊ុនមិនអាចគ្រប់គ្រងបាន។',
      'ទំនិញពិសេស ឬទំនិញហាមឃាត់ អតិថិជនត្រូវជូនដំណឹងជាមុនអំពីទំនិញដែលមានការរឹតត្បិត ឬតម្រូវឱ្យមានលិខិតអនុញ្ញាត។',
      'វិក្កយបត្រនេះប្រើប្រាស់សម្រាប់តែក្រុមហ៊ុនយើងខ្ញុំប៉ុណ្ណោះ។'
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    customerId: 'EL-8899',
    name: 'Sokha Mean (ខេត្តកណ្តាល / ភ្នំពេញ)',
    phone: '012 889 977',
    telegram: '@sokhamean',
    address: 'ផ្ទះលេខ 45B ផ្លូវ 271 សង្កាត់ទួលទំពូង 2 ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
    destination: 'Phnom Penh, Cambodia',
    defaultRate: 145
  },
  {
    id: 'cust-2',
    customerId: 'EL-3320',
    name: 'Bona Tech Store (បូណា)',
    phone: '098 765 432',
    telegram: '@bonastore_kh',
    address: 'ផ្ទះលេខ 12A មហាវិថីព្រះមុនីវង្ស សង្កាត់បឹងកេងកង 1 ខណ្ឌបឹងកេងកង ភ្នំពេញ',
    destination: 'Phnom Penh, Cambodia',
    defaultRate: 160
  },
  {
    id: 'cust-3',
    customerId: 'EL-5501',
    name: 'Chanthy Fashion Wholesales',
    phone: '077 445 566',
    telegram: '@chanthy_import',
    address: 'ផ្សារអូរឫស្សី តូបលេខ E0-412 ខណ្ឌ ៧មករា ភ្នំពេញ',
    destination: 'Phnom Penh, Cambodia',
    defaultRate: 140
  },
  {
    id: 'cust-4',
    customerId: 'A2M-1002',
    name: 'Rithy Electronic Parts',
    phone: '010 882 112',
    telegram: '@rithy_parts',
    address: 'ផ្លូវ 2004 សង្កាត់ទឹកថ្លា ខណ្ឌសែនសុខ ភ្នំពេញ',
    destination: 'Phnom Penh, Cambodia',
    defaultRate: 155
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNo: 'INV-202610-0089',
    date: '2026-10-24',
    companyProfileId: 'eternal-logistics',
    customer: INITIAL_CUSTOMERS[0],
    shipment: {
      transportation: 'LAND',
      cabinetNo: 'CAB-2026-GZ-8891',
      origin: 'Guangzhou (ក្វាងចូវ)',
      destination: 'Phnom Penh (រាជធានីភ្នំពេញ)'
    },
    items: [
      {
        id: 'item-1',
        no: 1,
        warehouseInboundNo: 'GZ-2410-001',
        trackingNo: 'SF1428987162981',
        itemName: 'សម្លៀកបំពាក់នារី (Women Dresses)',
        itemType: 'ទំនិញទូទៅ (General)',
        quantity: 12,
        cbm: 0.125,
        totalWeight: 148,
        totalQuantity: 360,
        totalCbm: 1.5,
        unitPrice: 145,
        shippingCost: 217.5,
        chinaWarehouse: 'Guangzhou'
      },
      {
        id: 'item-2',
        no: 2,
        warehouseInboundNo: 'GZ-2410-004',
        trackingNo: 'YT987162541092',
        itemName: 'ស្បែកជើងកីឡា (Sneakers)',
        itemType: 'ទំនិញម៉ាក (Brand)',
        quantity: 8,
        cbm: 0.095,
        totalWeight: 92,
        totalQuantity: 120,
        totalCbm: 0.76,
        unitPrice: 155,
        shippingCost: 117.8,
        chinaWarehouse: 'Guangzhou'
      },
      {
        id: 'item-3',
        no: 3,
        warehouseInboundNo: 'GZ-2410-009',
        trackingNo: '78291038472910',
        itemName: 'គ្រឿងតុបតែងផ្ទះ (Home Decor)',
        itemType: 'ទំនិញទូទៅ (General)',
        quantity: 5,
        cbm: 0.08,
        totalWeight: 45,
        totalQuantity: 50,
        totalCbm: 0.4,
        unitPrice: 145,
        shippingCost: 58.0,
        chinaWarehouse: 'Guangzhou'
      }
    ],
    totalItem: 25,
    totalCbm: 2.66,
    totalWeight: 285,
    subTotal: 393.3,
    discount: 10.0,
    otherCharges: 15.0,
    otherChargesDescription: 'ថ្លៃដឹកជញ្ជូនដល់ផ្ទះ (Local Delivery PP)',
    grandTotal: 398.3,
    calculationBasis: 'CBM',
    payment: {
      method: 'ABA_PAY',
      accountName: 'ETERNAL LOGISTICS by S.P',
      accountNumber: '010 311 321',
      status: 'UNPAID',
      paidAmount: 0
    },
    createdAt: '2026-10-24T08:00:00.000Z',
    updatedAt: '2026-10-24T08:00:00.000Z'
  },
  {
    id: 'inv-2',
    invoiceNo: 'INV-202610-0090',
    date: '2026-10-23',
    companyProfileId: 'a2m-express',
    customer: INITIAL_CUSTOMERS[1],
    shipment: {
      transportation: 'LAND',
      cabinetNo: 'CAB-2026-FS-3329',
      origin: 'Foshan (ហ្វូសាន)',
      destination: 'Phnom Penh (រាជធានីភ្នំពេញ)'
    },
    items: [
      {
        id: 'item-201',
        no: 1,
        warehouseInboundNo: 'FS-2410-112',
        trackingNo: 'ZTO98172651420',
        itemName: 'គ្រឿងអេឡិចត្រូនិក និងខ្សែសាក (Power banks & Cables)',
        itemType: 'ទំនិញពិសេស (Sensitive)',
        quantity: 6,
        cbm: 0.075,
        totalWeight: 110,
        totalQuantity: 240,
        totalCbm: 0.45,
        unitPrice: 165,
        shippingCost: 74.25,
        chinaWarehouse: 'Foshan'
      },
      {
        id: 'item-202',
        no: 2,
        warehouseInboundNo: 'FS-2410-119',
        trackingNo: 'JT384729108234',
        itemName: 'ស្រោមទូរស័ព្ទ (Phone Cases)',
        itemType: 'ទំនិញទូទៅ (General)',
        quantity: 10,
        cbm: 0.06,
        totalWeight: 65,
        totalQuantity: 1000,
        totalCbm: 0.6,
        unitPrice: 150,
        shippingCost: 90.0,
        chinaWarehouse: 'Foshan'
      }
    ],
    totalItem: 16,
    totalCbm: 1.05,
    totalWeight: 175,
    subTotal: 164.25,
    discount: 0,
    otherCharges: 5.0,
    otherChargesDescription: 'ថ្លៃវេចខ្ចប់ការពារបែកបាក់ (Repacking fee)',
    grandTotal: 169.25,
    calculationBasis: 'CBM',
    payment: {
      method: 'ABA_PAY',
      accountName: 'PRAK SOEUNAMATAK',
      accountNumber: '010 567 756',
      status: 'PAID',
      paidAmount: 169.25
    },
    createdAt: '2026-10-23T14:30:00.000Z',
    updatedAt: '2026-10-23T16:00:00.000Z'
  }
];

export const INITIAL_CONTAINERS: ContainerManifest[] = [
  {
    id: 'cont-1',
    cabinetNo: 'CAB-2026-GZ-8891',
    mode: 'LAND',
    origin: 'Guangzhou',
    destination: 'Phnom Penh',
    departureDate: '2026-10-21',
    arrivalDate: '2026-10-26',
    status: 'IN_TRANSIT',
    totalCbm: 68.4,
    totalWeight: 14200,
    totalPackages: 480,
    invoiceIds: ['inv-1']
  },
  {
    id: 'cont-2',
    cabinetNo: 'CAB-2026-FS-3329',
    mode: 'LAND',
    origin: 'Foshan',
    destination: 'Phnom Penh',
    departureDate: '2026-10-18',
    arrivalDate: '2026-10-23',
    status: 'ARRIVED',
    totalCbm: 72.1,
    totalWeight: 15800,
    totalPackages: 530,
    invoiceIds: ['inv-2']
  }
];
