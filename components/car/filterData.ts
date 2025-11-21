// =========================
// Car Filter Data
// =========================

export const carData = {
  Toyota: ["Corolla", "Camry", "Prius", "RAV4", "Highlander"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Versa"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
  Kia: ["Optima", "Forte", "Sorento", "Sportage", "Rio"],
  "Tata Motors": ["Nexon", "Harrier", "Safari", "Altroz", "Tigor"],
  Mahindra: ["Scorpio", "XUV300", "XUV700", "Bolero", "Thar"],
  Maruti: ["Swift", "Baleno", "Vitara Brezza", "Dzire", "Alto"],
};

export const nepalProvinces = [
  "Province 1",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

export const nepalDistricts = {
  "Province 1": ["Jhapa", "Ilam", "Panchthar", "Taplejung", "Morang", "Sunsari", "Dhankuta", "Terhathum"],
  "Madhesh Province": ["Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi", "Bara", "Parsa", "Rautahat"],
  "Bagmati Province": ["Kathmandu", "Lalitpur", "Bhaktapur", "Kavrepalanchok", "Sindhupalchok", "Chitwan", "Makwanpur"],
  "Gandaki Province": ["Gorkha", "Lamjung", "Tanahu", "Syangja", "Kaski", "Manang", "Mustang", "Baglung"],
  "Lumbini Province": ["Kapilvastu", "Rupandehi", "Palpa", "Gulmi", "Arghakhanchi", "Banke", "Bardiya", "Dang"],
  "Karnali Province": ["Surkhet", "Dailekh", "Jajarkot", "Dolpa", "Humla", "Jumla", "Kalikot", "Mugu"],
  "Sudurpashchim Province": ["Kailali", "Kanchanpur", "Dadeldhura", "Baitadi", "Darchula", "Bajhang", "Bajura", "Achham"],
};

export const priceOptions = [
  { value: "0", label: "₨0" },
  { value: "50000", label: "₨50,000" },
  { value: "100000", label: "₨1,00,000" },
  { value: "150000", label: "₨1,50,000" },
  { value: "200000", label: "₨2,00,000" },
  { value: "250000", label: "₨2,50,000" },
  { value: "300000", label: "₨3,00,000" },
  { value: "350000", label: "₨3,50,000" },
  { value: "400000", label: "₨4,00,000" },
  { value: "450000", label: "₨4,50,000" },
  { value: "500000", label: "₨5,00,000" },
  { value: "600000", label: "₨6,00,000" },
  { value: "700000", label: "₨7,00,000" },
  { value: "800000", label: "₨8,00,000" },
  { value: "900000", label: "₨9,00,000" },
  { value: "1000000", label: "₨10,00,000" },
  { value: "1100000", label: "₨11,00,000" },
  { value: "1200000", label: "₨12,00,000" },
  { value: "1300000", label: "₨13,00,000" },
  { value: "1400000", label: "₨14,00,000" },
  { value: "1500000", label: "₨15,00,000" },
];

export const yearOptions = Array.from({ length: 17 }, (_, i) => 2026 - i);

export const odometerOptions = [
  { value: "0", label: "0 km" },
  { value: "20000", label: "20,000 km" },
  { value: "40000", label: "40,000 km" },
  { value: "60000", label: "60,000 km" },
  { value: "80000", label: "80,000 km" },
  { value: "100000", label: "1,00,000 km" },
  { value: "120000", label: "1,20,000 km" },
  { value: "140000", label: "1,40,000 km" },
  { value: "160000", label: "1,60,000 km" },
  { value: "180000", label: "1,80,000 km" },
  { value: "200000", label: "2,00,000 km" },
];

export const conditionOptions = ["New", "Used"];

export interface FilterPanelProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onApply: () => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
  forceFullPage?: boolean;
}