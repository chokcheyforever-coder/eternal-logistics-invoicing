import { CompanyProfile, Customer, Invoice, ContainerManifest } from '../types';

export const COMPANY_PROFILES: CompanyProfile[] = [
  {
    id: 'eternal-logistics',
    name: 'ETERNAL LOGISTICS',
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
    qrImageUrl: './qr_eternal_logistics.png',
    qrMode: 'PHOTO',
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
    qrImageUrl: './qr_a2m_express.png',
    qrMode: 'PHOTO',
    notes: [
      'សូមអតិថិជនពិនិត្យចំនួនទំនិញ និងតម្លៃឱ្យបានត្រឹមត្រូវ មុនពេលទទួលទំនិញ។',
      'បន្ទាប់ពីទទួលទំនិញ សូមពិនិត្យស្ថានភាពទំនិញ និងជូនដំណឹងភ្លាមៗប្រសិនបើមានបញ្ហា',
      'ពេលវេលាដឹកជញ្ជូនអាចប្រែប្រួល ដោយសារអាកាសធាតុ ការត្រួតពិនិត្យ អាជ្ញាធរគយ ឬកត្តាផ្សេងៗ ដែលក្រុមហ៊ុនមិនអាចគ្រប់គ្រងបាន។',
      'ទំនិញពិសេស ឬទំនិញហាមឃាត់ អតិថិជនត្រូវជូនដំណឹងជាមុនអំពីទំនិញដែលមានការរឹតត្បិត ឬតម្រូវឱ្យមានលិខិតអនុញ្ញាត។',
      'វិក្កយបត្រនេះប្រើប្រាស់សម្រាប់តែក្រុមហ៊ុនយើងខ្ញុំប៉ុណ្ណោះ។'
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_CONTAINERS: ContainerManifest[] = [];
