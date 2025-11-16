"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin, Gauge,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  X,
  Package,
  Settings,
  Cog,
} from "lucide-react";
import dynamic from "next/dynamic";

// ============ TYPES ============
interface Bike {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  cc: string;
  mileage: string;
  location: string;
  fuelType: string;
  condition: "new" | "used";
  images: string[];
  seller: {
    name: string;
    rating: number;
    responseTime: string;
    phone: string;
  };
  postedDate: string;
  views: number;
  description: string;
  kmDriven?: string;
  engineType: string;
}

interface FilterState {
  selectedBrands: string[];
  selectedModels: string[];
  selectedProvinces: string[];
  selectedDistricts: string[];
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  odometerMin: string;
  odometerMax: string;
  selectedConditions: string[];
}

interface BikeCardProps {
  bike: Bike;
  onSave: (id: string) => void;
  onImageClick: (bike: Bike) => void;
  savedItems: Set<string>;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

// ============ FILTER DATA ============
const bikeData = {
  "Yamaha": ["R15", "FZ", "MT-15", "Fascino", "Ray ZR"],
  "Honda": ["Shine SP", "CB Shine", "Activa", "Dio", "Hornet 2.0"],
  "KTM": ["Duke 200", "Duke 390", "RC 200", "RC 390", "Adventure 250"],
  "Bajaj": ["Pulsar NS200", "Pulsar RS200", "Dominar 400", "Platina", "CT100"],
  "TVS": ["Apache RTR 160", "Apache RTR 200", "Ntorq", "Jupiter", "Sport"],
  "Royal Enfield": ["Hunter 350", "Classic 350", "Bullet 350", "Himalayan", "Meteor 350"],
  "Hero": ["Splendor Plus", "HF Deluxe", "Passion Pro", "Maestro Edge", "Pleasure Plus"],
  "Suzuki": ["Gixxer", "Gixxer SF", "Access 125", "Burgman Street", "Intruder"],
};

const nepalProvinces = [
  "Province 1", "Madhesh Province", "Bagmati Province", 
  "Gandaki Province", "Lumbini Province", "Karnali Province", "Sudurpashchim Province"
];

const nepalDistricts = {
  "Province 1": ["Jhapa", "Ilam", "Panchthar", "Taplejung", "Morang", "Sunsari", "Dhankuta", "Terhathum"],
  "Madhesh Province": ["Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi", "Bara", "Parsa", "Rautahat"],
  "Bagmati Province": ["Kathmandu", "Lalitpur", "Bhaktapur", "Kavrepalanchok", "Sindhupalchok", "Chitwan", "Makwanpur"],
  "Gandaki Province": ["Gorkha", "Lamjung", "Tanahu", "Syangja", "Kaski", "Manang", "Mustang", "Baglung"],
  "Lumbini Province": ["Kapilvastu", "Rupandehi", "Palpa", "Gulmi", "Arghakhanchi", "Banke", "Bardiya", "Dang"],
  "Karnali Province": ["Surkhet", "Dailekh", "Jajarkot", "Dolpa", "Humla", "Jumla", "Kalikot", "Mugu"],
  "Sudurpashchim Province": ["Kailali", "Kanchanpur", "Dadeldhura", "Baitadi", "Darchula", "Bajhang", "Bajura", "Achham"]
};

// Price options: 0 to 5L with 50k difference, then 1L difference to 15L
const priceOptions = [
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

// Year options: 2026 down to 2010
const yearOptions = Array.from({ length: 17 }, (_, i) => 2026 - i);

// Odometer options: 20k difference up to 2L (same as original data but for dropdowns)
const odometerOptions = [
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

const conditionOptions = ["New", "Used"];

// ============ SAMPLE BIKE DATA ============
const generateNepalBikes = (): Bike[] => [
  {
    "id": "1",
    "name": "Bajaj Platina 100",
    "brand": "Bajaj",
    "model": "Platina 100",
    "year": 2018,
    "price": 1081504,
    "cc": "102cc",
    "mileage": "57 km/l",
    "location": "Biratnagar, Province 1",
    "fuelType": "Electric",
    "condition": "new",
    "images": [
      "/api/placeholder/400/300?text=Bajaj+Platina+100"
    ],
    "seller": {
      "name": "Hero Motors Janakpur",
      "rating": 4.7,
      "responseTime": "< 2 hours",
      "phone": "+977-9899671425"
    },
    "postedDate": "2025-09-30",
    "views": 179,
    "description": "Well maintained Bajaj Platina 100 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "16340 km",
    "engineType": "4-stroke, Liquid cooled"
  },
  {
    "id": "2",
    "name": "Crossfire Tracker 250",
    "brand": "Crossfire",
    "model": "Tracker 250",
    "year": 2025,
    "price": 536803,
    "cc": "249cc",
    "mileage": "53-69 km/l",
    "location": "Pokhara, Gandaki",
    "fuelType": "Petrol",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Crossfire+Tracker+250"
    ],
    "seller": {
      "name": "Rajesh Maharjan",
      "rating": 4.4,
      "responseTime": "< 3 hours",
      "phone": "+977-9821044394"
    },
    "postedDate": "2025-06-20",
    "views": 222,
    "description": "Well maintained Crossfire Tracker 250 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "29385 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "3",
    "name": "TVS Raider 125",
    "brand": "TVS",
    "model": "Raider 125",
    "year": 2023,
    "price": 1171780,
    "cc": "124cc",
    "mileage": "51-65 km/l",
    "location": "Nepalgunj, Lumbini",
    "fuelType": "Petrol",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=TVS+Raider+125"
    ],
    "seller": {
      "name": "Bikram Thapa",
      "rating": 4.5,
      "responseTime": "< 1 hours",
      "phone": "+977-9878252098"
    },
    "postedDate": "2025-01-24",
    "views": 503,
    "description": "Well maintained TVS Raider 125 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "16348 km",
    "engineType": "Single cylinder, Oil cooled"
  },
  {
    "id": "4",
    "name": "Honda XBlade",
    "brand": "Honda",
    "model": "XBlade",
    "year": 2019,
    "price": 834377,
    "cc": "160cc",
    "mileage": "34-62 km/l",
    "location": "Chitwan, Bagmati",
    "fuelType": "Petrol",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Honda+XBlade"
    ],
    "seller": {
      "name": "Honda Showroom",
      "rating": 4.1,
      "responseTime": "< 3 hours",
      "phone": "+977-9886604200"
    },
    "postedDate": "2025-10-28",
    "views": 195,
    "description": "Well maintained Honda XBlade in excellent condition. Smooth engine and great performance.",
    "kmDriven": "10178 km",
    "engineType": "Single cylinder, Oil cooled"
  },
  {
    "id": "5",
    "name": "KTM RC 390",
    "brand": "KTM",
    "model": "RC 390",
    "year": 2023,
    "price": 364558,
    "cc": "373cc",
    "mileage": "57-68 km/l",
    "location": "Chitwan, Bagmati",
    "fuelType": "Electric",
    "condition": "new",
    "images": [
      "/api/placeholder/400/300?text=KTM+RC+390"
    ],
    "seller": {
      "name": "Royal Enfield Lalitpur",
      "rating": 4.7,
      "responseTime": "< 1 hours",
      "phone": "+977-9859648771"
    },
    "postedDate": "2025-06-09",
    "views": 336,
    "description": "Well maintained KTM RC 390 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "10622 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "6",
    "name": "Honda Hornet 2.0",
    "brand": "Honda",
    "model": "Hornet 2.0",
    "year": 2020,
    "price": 193951,
    "cc": "184cc",
    "mileage": "39-79 km/l",
    "location": "Pokhara, Gandaki",
    "fuelType": "Electric",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Honda+Hornet+2.0"
    ],
    "seller": {
      "name": "Bikram Thapa",
      "rating": 4.5,
      "responseTime": "< 1 hours",
      "phone": "+977-9859719204"
    },
    "postedDate": "2025-01-18",
    "views": 311,
    "description": "Well maintained Honda Hornet 2.0 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "9613 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "7",
    "name": "Yamaha Fascino 125",
    "brand": "Yamaha",
    "model": "Fascino 125",
    "year": 2020,
    "price": 556533,
    "cc": "125cc",
    "mileage": "46-63 km/l",
    "location": "Bhaktapur, Bagmati",
    "fuelType": "Electric",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Yamaha+Fascino+125"
    ],
    "seller": {
      "name": "Rajesh Maharjan",
      "rating": 4.7,
      "responseTime": "< 3 hours",
      "phone": "+977-9854726730"
    },
    "postedDate": "2025-03-17",
    "views": 522,
    "description": "Well maintained Yamaha Fascino 125 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "14337 km",
    "engineType": "4-stroke, Liquid cooled"
  },
  {
    "id": "8",
    "name": "Suzuki Burgman Street",
    "brand": "Suzuki",
    "model": "Burgman Street",
    "year": 2022,
    "price": 139481,
    "cc": "125cc",
    "mileage": "39 km/l",
    "location": "Bhaktapur, Bagmati",
    "fuelType": "Electric",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Suzuki+Burgman+Street"
    ],
    "seller": {
      "name": "Kiran Rai",
      "rating": 4.9,
      "responseTime": "< 3 hours",
      "phone": "+977-9890910649"
    },
    "postedDate": "2025-08-24",
    "views": 462,
    "description": "Well maintained Suzuki Burgman Street in excellent condition. Smooth engine and great performance.",
    "kmDriven": "6626 km",
    "engineType": "Single cylinder, Oil cooled"
  },
  {
    "id": "9",
    "name": "KTM RC 390",
    "brand": "KTM",
    "model": "RC 390",
    "year": 2022,
    "price": 849646,
    "cc": "373cc",
    "mileage": "43-66 km/l",
    "location": "Bhaktapur, Bagmati",
    "fuelType": "Petrol",
    "condition": "new",
    "images": [
      "/api/placeholder/400/300?text=KTM+RC+390"
    ],
    "seller": {
      "name": "TVS Showroom Butwal",
      "rating": 4.3,
      "responseTime": "< 3 hours",
      "phone": "+977-9874043906"
    },
    "postedDate": "2025-02-14",
    "views": 331,
    "description": "Well maintained KTM RC 390 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "9492 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "10",
    "name": "Suzuki Access 125",
    "brand": "Suzuki",
    "model": "Access 125",
    "year": 2020,
    "price": 708030,
    "cc": "124cc",
    "mileage": "39-75 km/l",
    "location": "Dhangadhi, Sudurpashchim",
    "fuelType": "Electric",
    "condition": "new",
    "images": [
      "/api/placeholder/400/300?text=Suzuki+Access+125"
    ],
    "seller": {
      "name": "Bikram Thapa",
      "rating": 4.1,
      "responseTime": "< 2 hours",
      "phone": "+977-9825055270"
    },
    "postedDate": "2025-04-21",
    "views": 322,
    "description": "Well maintained Suzuki Access 125 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "16093 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "11",
    "name": "Suzuki Access 125",
    "brand": "Suzuki",
    "model": "Access 125",
    "year": 2018,
    "price": 251780,
    "cc": "124cc",
    "mileage": "32 km/l",
    "location": "Lalitpur, Bagmati",
    "fuelType": "Petrol",
    "condition": "new",
    "images": [
      "/api/placeholder/400/300?text=Suzuki+Access+125"
    ],
    "seller": {
      "name": "Honda Showroom",
      "rating": 4.8,
      "responseTime": "< 3 hours",
      "phone": "+977-9851850798"
    },
    "postedDate": "2025-09-12",
    "views": 188,
    "description": "Well maintained Suzuki Access 125 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "20061 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "12",
    "name": "Crossfire HJS 250",
    "brand": "Crossfire",
    "model": "HJS 250",
    "year": 2024,
    "price": 550468,
    "cc": "249cc",
    "mileage": "31-68 km/l",
    "location": "Bhaktapur, Bagmati",
    "fuelType": "Electric",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Crossfire+HJS+250"
    ],
    "seller": {
      "name": "Rajesh Maharjan",
      "rating": 4.9,
      "responseTime": "< 1 hours",
      "phone": "+977-9828723867"
    },
    "postedDate": "2025-05-13",
    "views": 130,
    "description": "Well maintained Crossfire HJS 250 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "16586 km",
    "engineType": "4-stroke, Liquid cooled"
  },
  {
    "id": "13",
    "name": "Benelli 302S",
    "brand": "Benelli",
    "model": "302S",
    "year": 2025,
    "price": 1063555,
    "cc": "300cc",
    "mileage": "30-80 km/l",
    "location": "Butwal, Lumbini",
    "fuelType": "Petrol",
    "condition": "new",
    "images": [
      "/api/placeholder/400/300?text=Benelli+302S"
    ],
    "seller": {
      "name": "TVS Showroom Butwal",
      "rating": 4.8,
      "responseTime": "< 2 hours",
      "phone": "+977-9862544559"
    },
    "postedDate": "2025-08-18",
    "views": 587,
    "description": "Well maintained Benelli 302S in excellent condition. Smooth engine and great performance.",
    "kmDriven": "3188 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "14",
    "name": "Honda XBlade",
    "brand": "Honda",
    "model": "XBlade",
    "year": 2024,
    "price": 624271,
    "cc": "160cc",
    "mileage": "37-73 km/l",
    "location": "Biratnagar, Province 1",
    "fuelType": "Petrol",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Honda+XBlade"
    ],
    "seller": {
      "name": "Suresh Tamang",
      "rating": 4.7,
      "responseTime": "< 3 hours",
      "phone": "+977-9828388439"
    },
    "postedDate": "2025-09-30",
    "views": 249,
    "description": "Well maintained Honda XBlade in excellent condition. Smooth engine and great performance.",
    "kmDriven": "26808 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "15",
    "name": "Crossfire Tracker 250",
    "brand": "Crossfire",
    "model": "Tracker 250",
    "year": 2018,
    "price": 791701,
    "cc": "249cc",
    "mileage": "60-69 km/l",
    "location": "Chitwan, Bagmati",
    "fuelType": "Petrol",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Crossfire+Tracker+250"
    ],
    "seller": {
      "name": "Royal Enfield Lalitpur",
      "rating": 4.8,
      "responseTime": "< 2 hours",
      "phone": "+977-9830141583"
    },
    "postedDate": "2025-06-29",
    "views": 532,
    "description": "Well maintained Crossfire Tracker 250 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "21141 km",
    "engineType": "4-stroke, Air cooled"
  },
  {
    "id": "16",
    "name": "Bajaj NS200",
    "brand": "Bajaj",
    "model": "NS200",
    "year": 2023,
    "price": 894167,
    "cc": "199cc",
    "mileage": "59-80 km/l",
    "location": "Biratnagar, Province 1",
    "fuelType": "Petrol",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Bajaj+NS200"
    ],
    "seller": {
      "name": "Bajaj Dealer Pokhara",
      "rating": 4.9,
      "responseTime": "< 2 hours",
      "phone": "+977-9876645041"
    },
    "postedDate": "2025-03-05",
    "views": 194,
    "description": "Well maintained Bajaj NS200 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "14926 km",
    "engineType": "Single cylinder, Oil cooled"
  },
  {
    "id": "17",
    "name": "Suzuki Access 125",
    "brand": "Suzuki",
    "model": "Access 125",
    "year": 2023,
    "price": 1077461,
    "cc": "124cc",
    "mileage": "60-63 km/l",
    "location": "Dhangadhi, Sudurpashchim",
    "fuelType": "Petrol",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Suzuki+Access+125"
    ],
    "seller": {
      "name": "Hero Motors Janakpur",
      "rating": 4.1,
      "responseTime": "< 3 hours",
      "phone": "+977-9891824124"
    },
    "postedDate": "2025-04-04",
    "views": 73,
    "description": "Well maintained Suzuki Access 125 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "4198 km",
    "engineType": "4-stroke, Liquid cooled"
  },
  {
    "id": "18",
    "name": "Honda XBlade",
    "brand": "Honda",
    "model": "XBlade",
    "year": 2024,
    "price": 695668,
    "cc": "160cc",
    "mileage": "44-70 km/l",
    "location": "Biratnagar, Province 1",
    "fuelType": "Petrol",
    "condition": "new",
    "images": [
      "/api/placeholder/400/300?text=Honda+XBlade"
    ],
    "seller": {
      "name": "Bajaj Dealer Pokhara",
      "rating": 4.7,
      "responseTime": "< 1 hours",
      "phone": "+977-9849537927"
    },
    "postedDate": "2025-05-23",
    "views": 97,
    "description": "Well maintained Honda XBlade in excellent condition. Smooth engine and great performance.",
    "kmDriven": "29675 km",
    "engineType": "Single cylinder, Oil cooled"
  },
  {
    "id": "19",
    "name": "Bajaj Dominar 400",
    "brand": "Bajaj",
    "model": "Dominar 400",
    "year": 2019,
    "price": 785133,
    "cc": "373cc",
    "mileage": "38 km/l",
    "location": "Nepalgunj, Lumbini",
    "fuelType": "Electric",
    "condition": "new",
    "images": [
      "/api/placeholder/400/300?text=Bajaj+Dominar+400"
    ],
    "seller": {
      "name": "TVS Showroom Butwal",
      "rating": 4.6,
      "responseTime": "< 1 hours",
      "phone": "+977-9893086264"
    },
    "postedDate": "2025-07-15",
    "views": 424,
    "description": "Well maintained Bajaj Dominar 400 in excellent condition. Smooth engine and great performance.",
    "kmDriven": "1700 km",
    "engineType": "Single cylinder, Oil cooled"
  },
  {
    "id": "20",
    "name": "Suzuki Gixxer SF",
    "brand": "Suzuki",
    "model": "Gixxer SF",
    "year": 2023,
    "price": 795283,
    "cc": "155cc",
    "mileage": "35-75 km/l",
    "location": "Chitwan, Bagmati",
    "fuelType": "Electric",
    "condition": "used",
    "images": [
      "/api/placeholder/400/300?text=Suzuki+Gixxer+SF"
    ],
    "seller": {
      "name": "Rajesh Maharjan",
      "rating": 4.3,
      "responseTime": "< 2 hours",
      "phone": "+977-9822887977"
    },
    "postedDate": "2025-03-24",
    "views": 293,
    "description": "Well maintained Suzuki Gixxer SF in excellent condition. Smooth engine and great performance.",
    "kmDriven": "29875 km",
    "engineType": "Single cylinder, Oil cooled"
  },
  
];


// ============ COMPONENTS ============
const BikeCard: React.FC<BikeCardProps> = ({ bike, onSave, onImageClick, savedItems }) => {
  const isSaved = savedItems.has(bike.id);
  
  const formatPrice = (price: number): string => {
    const priceStr = price.toString();
    const reversedStr = priceStr.split('').reverse().join('');
    
    let formatted = '';
    for (let i = 0; i < reversedStr.length; i++) {
      if (i > 0 && (i === 3 || (i > 3 && (i - 3) % 2 === 0))) {
        formatted += ',';
      }
      formatted += reversedStr[i];
    }
    
    return `₨ ${formatted.split('').reverse().join('')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={bike.images[0]}
          alt={bike.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onImageClick(bike)}
        />
        
        {/* Heart Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(bike.id);
            }}
            className={`p-2 rounded-full ${isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'}`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Year, Name */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{bike.year}</span>
            <h3 className="text-lg font-bold text-gray-900">{bike.name}</h3>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 md:gap-10 xl:gap-14 mb-3">
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-xs text-gray-700 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Type:
              </span>
              <span className="text-xs font-medium text-gray-900 ml-1">Bike</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-700 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Engine:
              </span>
              <span className="text-xs font-medium text-gray-900 ml-1">{bike.cc}</span>
            </div>
            
          </div>
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-xs text-gray-700 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Odometer:
              </span>
              <span className="text-xs font-medium text-gray-900 ml-1">{bike.kmDriven || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-700 flex items-center gap-2">
                <Cog className="w-4 h-4" />
                Transmission:
              </span>
              <span className="text-xs font-medium text-gray-900 ml-1">Manual</span>
            </div>
            
          </div>
        </div>

        {/* Location and Price */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {bike.location}
          </div>
          <div className="text-l font-bold" style={{ color: '#071640ff' }}>{formatPrice(bike.price)}</div>
        </div>
      </div>
    </div>
  );
};

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  onApply, 
  onReset, 
  isOpen, 
  onClose 
}) => {
  const [openDropdown, setOpenDropdown] = useState<string>('');

  const toggleBrand = (brand: string): void => {
    const newBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    
    const newModels = newBrands.includes(brand) 
      ? filters.selectedModels 
      : filters.selectedModels.filter(model => !bikeData[brand as keyof typeof bikeData]?.includes(model));

    onFiltersChange({
      ...filters,
      selectedBrands: newBrands,
      selectedModels: newModels
    });
    
    // Auto-close dropdown after selection
    setOpenDropdown('');
  };

  const toggleModel = (model: string): void => {
    const newModels = filters.selectedModels.includes(model)
      ? filters.selectedModels.filter(m => m !== model)
      : [...filters.selectedModels, model];
    
    onFiltersChange({ ...filters, selectedModels: newModels });
    
    // Auto-close dropdown after selection
    setOpenDropdown('');
  };

  const toggleProvince = (province: string): void => {
    const newProvinces = filters.selectedProvinces.includes(province)
      ? filters.selectedProvinces.filter(p => p !== province)
      : [...filters.selectedProvinces, province];
    
    const newDistricts = newProvinces.includes(province) 
      ? filters.selectedDistricts 
      : filters.selectedDistricts.filter(district => !nepalDistricts[province as keyof typeof nepalDistricts]?.includes(district));

    onFiltersChange({
      ...filters,
      selectedProvinces: newProvinces,
      selectedDistricts: newDistricts
    });
    
    // Auto-close dropdown after selection
    setOpenDropdown('');
  };

  const toggleDistrict = (district: string): void => {
    const newDistricts = filters.selectedDistricts.includes(district)
      ? filters.selectedDistricts.filter(d => d !== district)
      : [...filters.selectedDistricts, district];
    
    onFiltersChange({ ...filters, selectedDistricts: newDistricts });
    
    // Auto-close dropdown after selection
    setOpenDropdown('');
  };

  const toggleCondition = (condition: string): void => {
    const newConditions = filters.selectedConditions.includes(condition)
      ? filters.selectedConditions.filter(c => c !== condition)
      : [...filters.selectedConditions, condition];
    
    onFiltersChange({ ...filters, selectedConditions: newConditions });
    
    // Auto-close dropdown after selection
    setOpenDropdown('');
  };

  const getSelectedBrandsText = (): string => {
    if (filters.selectedBrands.length === 0) return "Select Brands";
    if (filters.selectedBrands.length === 1) return filters.selectedBrands[0];
    return `${filters.selectedBrands.length} brands selected`;
  };

  const getSelectedModelsText = (): string => {
    if (filters.selectedModels.length === 0) return "Select Models";
    if (filters.selectedModels.length === 1) return filters.selectedModels[0];
    return `${filters.selectedModels.length} models selected`;
  };

  const getSelectedProvincesText = (): string => {
    if (filters.selectedProvinces.length === 0) return "Select Provinces";
    if (filters.selectedProvinces.length === 1) return filters.selectedProvinces[0];
    return `${filters.selectedProvinces.length} provinces selected`;
  };

  const getSelectedDistrictsText = (): string => {
    if (filters.selectedDistricts.length === 0) return "Select Districts";
    if (filters.selectedDistricts.length === 1) return filters.selectedDistricts[0];
    return `${filters.selectedDistricts.length} districts selected`;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          
          {/* Brand Selection */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Brand/Make</label>
              {filters.selectedBrands.length > 0 && (
                <div className="text-xs text-blue-600 font-medium">
                  {filters.selectedBrands.join(", ")}
                </div>
              )}
            </div>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'brand' ? '' : 'brand')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center justify-between text-left"
            >
              <span className={filters.selectedBrands.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                {getSelectedBrandsText()}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'brand' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'brand' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {Object.keys(bikeData).map(brand => (
                  <label key={brand} className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="text-blue-600"
                    />
                    <span className={filters.selectedBrands.includes(brand) ? 'text-blue-600 font-medium' : ''}>{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Model Selection - Only show if brands are selected */}
          {filters.selectedBrands.length > 0 && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Models</label>
                {filters.selectedModels.length > 0 && (
                  <div className="text-xs text-blue-600 font-medium">
                    {filters.selectedModels.join(", ")}
                  </div>
                )}
              </div>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'model' ? '' : 'model')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center justify-between text-left"
              >
                <span className={filters.selectedModels.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                  {getSelectedModelsText()}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'model' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'model' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filters.selectedBrands.flatMap(brand => 
                    bikeData[brand as keyof typeof bikeData].map(model => (
                      <label key={model} className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.selectedModels.includes(model)}
                          onChange={() => toggleModel(model)}
                          className="text-blue-600"
                        />
                        <span className={filters.selectedModels.includes(model) ? 'text-blue-600 font-medium' : ''}>{model}</span>
                        <span className="text-xs text-gray-500 ml-auto">{brand}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Province Selection */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Province</label>
              {filters.selectedProvinces.length > 0 && (
                <div className="text-xs text-blue-600 font-medium">
                  {filters.selectedProvinces.join(", ")}
                </div>
              )}
            </div>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'province' ? '' : 'province')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center justify-between text-left"
            >
              <span className={filters.selectedProvinces.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                {getSelectedProvincesText()}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'province' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'province' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {nepalProvinces.map(province => (
                  <label key={province} className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedProvinces.includes(province)}
                      onChange={() => toggleProvince(province)}
                      className="text-blue-600"
                    />
                    <span className={filters.selectedProvinces.includes(province) ? 'text-blue-600 font-medium' : ''}>{province}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* District Selection - Only show if provinces are selected */}
          {filters.selectedProvinces.length > 0 && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Districts</label>
                {filters.selectedDistricts.length > 0 && (
                  <div className="text-xs text-blue-600 font-medium">
                    {filters.selectedDistricts.join(", ")}
                  </div>
                )}
              </div>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'district' ? '' : 'district')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center justify-between text-left"
              >
                <span className={filters.selectedDistricts.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                  {getSelectedDistrictsText()}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'district' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'district' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filters.selectedProvinces.flatMap(province => 
                    nepalDistricts[province as keyof typeof nepalDistricts].map(district => (
                      <label key={district} className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.selectedDistricts.includes(district)}
                          onChange={() => toggleDistrict(district)}
                          className="text-blue-600"
                        />
                        <span className={filters.selectedDistricts.includes(district) ? 'text-blue-600 font-medium' : ''}>{district}</span>
                        <span className="text-xs text-gray-500 ml-auto">{province}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filters.priceMin}
                onChange={(e) => onFiltersChange({ ...filters, priceMin: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Min</option>
                {priceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={filters.priceMax}
                onChange={(e) => onFiltersChange({ ...filters, priceMax: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Max</option>
                {priceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year Range</label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filters.yearMin}
                onChange={(e) => onFiltersChange({ ...filters, yearMin: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Min</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                value={filters.yearMax}
                onChange={(e) => onFiltersChange({ ...filters, yearMax: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Max</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Odometer Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Odometer Range</label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filters.odometerMin}
                onChange={(e) => onFiltersChange({ ...filters, odometerMin: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Min</option>
                {odometerOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={filters.odometerMax}
                onChange={(e) => onFiltersChange({ ...filters, odometerMax: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Max</option>
                {odometerOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              {filters.selectedConditions.length > 0 && (
                <div className="text-xs text-blue-600 font-medium">
                  {filters.selectedConditions.join(", ")}
                </div>
              )}
            </div>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'condition' ? '' : 'condition')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center justify-between text-left"
            >
              <span className={filters.selectedConditions.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                {filters.selectedConditions.length > 0 ? filters.selectedConditions.join(", ") : "Select Condition"}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'condition' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'condition' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {conditionOptions.map(condition => (
                  <label key={condition} className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedConditions.includes(condition)}
                      onChange={() => toggleCondition(condition)}
                      className="text-blue-600"
                    />
                    <span className={filters.selectedConditions.includes(condition) ? 'text-blue-600 font-medium' : ''}>{condition}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 md:p-6 border-t space-y-3">
          <button
            onClick={() => {
              onApply();
              setOpenDropdown('');
            }}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              onReset();
              setOpenDropdown('');
            }}
            className="w-full py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-[1]" 
          onClick={() => setOpenDropdown('')}
        />
      )}
    </div>
  );
};

// ============ MAIN COMPONENT ============
function NepalBikeListings() {
  const router = useRouter();
  
  // State
  const [bikes] = useState<Bike[]>(generateNepalBikes());
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>(bikes);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    selectedBrands: [],
    selectedModels: [],
    selectedProvinces: [],
    selectedDistricts: [],
    priceMin: "",
    priceMax: "",
    yearMin: "",
    yearMax: "",
    odometerMin: "",
    odometerMax: "",
    selectedConditions: [],
  });

  // Responsive items per page
  const itemsPerPage = isMobile ? 15 : 24;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBikes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBikes = filteredBikes.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...bikes];

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(bike =>
        bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter(bike => filters.selectedBrands.includes(bike.brand));
    }

    // Model filter
    if (filters.selectedModels.length > 0) {
      filtered = filtered.filter(bike => filters.selectedModels.includes(bike.model));
    }

    // Location filter
    if (filters.selectedProvinces.length > 0 || filters.selectedDistricts.length > 0) {
      filtered = filtered.filter(bike => {
        const hasProvince = filters.selectedProvinces.length === 0 || 
          filters.selectedProvinces.some(province => bike.location.includes(province));
        const hasDistrict = filters.selectedDistricts.length === 0 || 
          filters.selectedDistricts.some(district => bike.location.includes(district));
        return hasProvince || hasDistrict;
      });
    }

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter(bike => bike.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(bike => bike.price <= parseInt(filters.priceMax));
    }

    // Year filter
    if (filters.yearMin) {
      filtered = filtered.filter(bike => bike.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      filtered = filtered.filter(bike => bike.year <= parseInt(filters.yearMax));
    }

    // Odometer filter - convert kmDriven to number for comparison
    if (filters.odometerMin || filters.odometerMax) {
      filtered = filtered.filter(bike => {
        if (!bike.kmDriven) return false;
        const kmValue = parseInt(bike.kmDriven.replace(/[^0-9]/g, '')); // Extract number from "8,500 km"
        
        if (filters.odometerMin && kmValue < parseInt(filters.odometerMin)) {
          return false;
        }
        if (filters.odometerMax && kmValue > parseInt(filters.odometerMax)) {
          return false;
        }
        return true;
      });
    }

    // Condition filter
    if (filters.selectedConditions.length > 0) {
      filtered = filtered.filter(bike => 
        filters.selectedConditions.some(condition => 
          condition.toLowerCase() === bike.condition.toLowerCase()
        )
      );
    }

    setFilteredBikes(filtered);
  }, [bikes, filters, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handlers
  const handleSave = (id: string): void => {
    const newSavedItems = new Set(savedItems);
    if (newSavedItems.has(id)) {
      newSavedItems.delete(id);
    } else {
      newSavedItems.add(id);
    }
    setSavedItems(newSavedItems);
  };

  const handleImageClick = (bike: Bike): void => {
    router.push(`/bikes/${bike.id}`);
  };

  const resetFilters = (): void => {
    setFilters({
      selectedBrands: [],
      selectedModels: [],
      selectedProvinces: [],
      selectedDistricts: [],
      priceMin: "",
      priceMax: "",
      yearMin: "",
      yearMax: "",
      odometerMin: "",
      odometerMax: "",
      selectedConditions: [],
    });
    setCurrentPage(1);
  };

  const goToPage = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Spacer */}
      <div className="h-0 md:h-0"></div>
      
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-gray-900">Bikes in Nepal</h1>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>
            
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bikes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredBikes.length} bikes found
              </span>
              {totalPages > 1 && (
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Bikes in Nepal</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filteredBikes.length} Results
              </span>
              {totalPages > 1 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bikes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 text-gray-900"
                />
              </div>

              {/* Filters */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Bikes Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 mb-8">          {currentBikes.map((bike) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              onSave={handleSave}
              onImageClick={handleImageClick}
              savedItems={savedItems}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredBikes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bikes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onApply={() => setIsFilterOpen(false)}
        onReset={resetFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(NepalBikeListings), {
  ssr: false,
});