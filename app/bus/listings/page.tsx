"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Settings,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  X,
  Bus,
  Gauge,
  Cog,
} from "lucide-react";
import dynamic from "next/dynamic";

// ============ TYPES ============
interface BusVehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  engine: string;
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
  seatingCapacity: string;
  transmission: string;
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

interface BusCardProps {
  bus: BusVehicle;
  onSave: (id: string) => void;
  onImageClick: (bus: BusVehicle) => void;
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
const busData = {
  "Tata": ["LP 407", "LP 713", "Starbus", "Ultra", "1512"],
  "Ashok Leyland": ["Viking", "Lynx", "Falcon", "U-Truck", "Boss"],
  "Mahindra": ["Tourister", "Blazo", "Navistar"],
  "Eicher": ["Skyline", "Pro Series"],
  "BharatBenz": ["1623", "1017", "814"],
  "Volvo": ["B7R", "B9R", "9400"],
  "Scania": ["K400", "Touring"],
  "Mercedes": ["OH 1626", "OF 917"],
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

const priceOptions = [
  { value: "0", label: "₨0" },
  { value: "2000000", label: "₨20,00,000" },
  { value: "3000000", label: "₨30,00,000" },
  { value: "4000000", label: "₨40,00,000" },
  { value: "5000000", label: "₨50,00,000" },
  { value: "6000000", label: "₨60,00,000" },
  { value: "8000000", label: "₨80,00,000" },
  { value: "10000000", label: "₨1,00,00,000" },
  { value: "15000000", label: "₨1,50,00,000" },
  { value: "20000000", label: "₨2,00,00,000" },
];

const yearOptions = Array.from({ length: 22 }, (_, i) => 2026 - i);
const odometerOptions = [
  { value: "0", label: "0 km" },
  { value: "50000", label: "50,000 km" },
  { value: "100000", label: "1,00,000 km" },
  { value: "150000", label: "1,50,000 km" },
  { value: "200000", label: "2,00,000 km" },
  { value: "300000", label: "3,00,000 km" },
  { value: "500000", label: "5,00,000 km" },
  { value: "750000", label: "7,50,000 km" },
];

const conditionOptions = ["New", "Used"];

// ============ SAMPLE BUS DATA ============
const generateNepalBuses = (): BusVehicle[] => [
  {
    id: "1",
    name: "Tata LP 713 Starbus",
    brand: "Tata",
    model: "LP 713",
    year: 2023,
    price: 8950000,
    engine: "5700cc",
    mileage: "6 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+LP+713"],
    seller: { name: "Tata Bus Center", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9841234567" },
    postedDate: "2025-11-10",
    views: 245,
    description: "Tata LP 713 bus in excellent condition for long route service.",
    kmDriven: "185,200 km",
    seatingCapacity: "48 Seater",
    transmission: "Manual"
  },
  {
    id: "2",
    name: "Ashok Leyland Viking",
    brand: "Ashok Leyland",
    model: "Viking",
    year: 2024,
    price: 12500000,
    engine: "6700cc",
    mileage: "5 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Viking"],
    seller: { name: "Ashok Leyland Commercial", rating: 4.8, responseTime: "< 30 min", phone: "+977-9851234567" },
    postedDate: "2025-11-14",
    views: 134,
    description: "Brand new Ashok Leyland Viking with AC and luxury seating.",
    seatingCapacity: "52 Seater",
    transmission: "Manual"
  },
  {
    id: "3",
    name: "Mahindra Tourister COSMO",
    brand: "Mahindra",
    model: "Tourister",
    year: 2023,
    price: 7850000,
    engine: "3800cc",
    mileage: "7 km/l",
    location: "Lalitpur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+Tourister"],
    seller: { name: "Mahindra Bus Center", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9861234567" },
    postedDate: "2025-11-08",
    views: 189,
    description: "Mahindra Tourister with comfortable seating for tourist routes.",
    kmDriven: "162,800 km",
    seatingCapacity: "35 Seater",
    transmission: "Manual"
  },
  {
    id: "4",
    name: "Eicher Skyline Pro",
    brand: "Eicher",
    model: "Skyline",
    year: 2024,
    price: 9850000,
    engine: "5900cc",
    mileage: "6 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Eicher+Skyline"],
    seller: { name: "Eicher Motors", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9871234567" },
    postedDate: "2025-11-13",
    views: 156,
    description: "Eicher Skyline Pro with modern amenities and safety features.",
    seatingCapacity: "45 Seater",
    transmission: "Manual"
  },
  {
    id: "5",
    name: "BharatBenz 1623",
    brand: "BharatBenz",
    model: "1623",
    year: 2024,
    price: 14250000,
    engine: "6700cc",
    mileage: "5 km/l",
    location: "Biratnagar",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=BharatBenz+1623"],
    seller: { name: "BharatBenz Center", rating: 4.9, responseTime: "< 30 min", phone: "+977-9881234567" },
    postedDate: "2025-11-12",
    views: 98,
    description: "Premium BharatBenz 1623 with German engineering and comfort.",
    seatingCapacity: "49 Seater",
    transmission: "Manual"
  },
  {
    id: "6",
    name: "Volvo B7R",
    brand: "Volvo",
    model: "B7R",
    year: 2023,
    price: 18500000,
    engine: "7100cc",
    mileage: "4 km/l",
    location: "Butwal",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Volvo+B7R"],
    seller: { name: "Volvo Bus Center", rating: 4.9, responseTime: "< 1 hour", phone: "+977-9891234567" },
    postedDate: "2025-11-05",
    views: 167,
    description: "Volvo B7R luxury bus with AC and premium interior.",
    kmDriven: "285,500 km",
    seatingCapacity: "41 Seater",
    transmission: "Automatic"
  },
  {
    id: "7",
    name: "Scania K400 Touring",
    brand: "Scania",
    model: "K400",
    year: 2024,
    price: 22000000,
    engine: "9000cc",
    mileage: "4 km/l",
    location: "Dhangadhi",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Scania+K400"],
    seller: { name: "Scania Nepal", rating: 5.0, responseTime: "< 30 min", phone: "+977-9801234567" },
    postedDate: "2025-11-11",
    views: 89,
    description: "Scania K400 premium tourist bus with world-class comfort.",
    seatingCapacity: "45 Seater",
    transmission: "Automatic"
  },
  {
    id: "8",
    name: "Tata Starbus Ultra",
    brand: "Tata",
    model: "Starbus",
    year: 2022,
    price: 6850000,
    engine: "5700cc",
    mileage: "6 km/l",
    location: "Nepalgunj",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+Starbus"],
    seller: { name: "Tata Motors", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9811234567" },
    postedDate: "2025-11-09",
    views: 178,
    description: "Tata Starbus Ultra with efficient engine and comfortable seating.",
    kmDriven: "242,100 km",
    seatingCapacity: "44 Seater",
    transmission: "Manual"
  },
  {
    id: "9",
    name: "Ashok Leyland Falcon",
    brand: "Ashok Leyland",
    model: "Falcon",
    year: 2024,
    price: 11850000,
    engine: "5900cc",
    mileage: "6 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Falcon"],
    seller: { name: "Ashok Leyland", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9821234567" },
    postedDate: "2025-11-13",
    views: 123,
    description: "Ashok Leyland Falcon with advanced safety and comfort features.",
    seatingCapacity: "50 Seater",
    transmission: "Manual"
  },
  {
    id: "10",
    name: "Mercedes OH 1626",
    brand: "Mercedes",
    model: "OH 1626",
    year: 2024,
    price: 19500000,
    engine: "7700cc",
    mileage: "4 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mercedes+OH+1626"],
    seller: { name: "Mercedes Bus Center", rating: 4.9, responseTime: "< 30 min", phone: "+977-9831234567" },
    postedDate: "2025-11-14",
    views: 95,
    description: "Mercedes OH 1626 luxury bus with premium amenities.",
    seatingCapacity: "42 Seater",
    transmission: "Automatic"
  },
  {
    id: "11",
    name: "Tata LP 407",
    brand: "Tata",
    model: "LP 407",
    year: 2023,
    price: 5850000,
    engine: "3800cc",
    mileage: "8 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+LP+407"],
    seller: { name: "Tata Commercial", rating: 4.4, responseTime: "< 2 hours", phone: "+977-9841234568" },
    postedDate: "2025-11-07",
    views: 156,
    description: "Tata LP 407 compact bus ideal for city routes and school service.",
    kmDriven: "195,400 km",
    seatingCapacity: "32 Seater",
    transmission: "Manual"
  },
  {
    id: "12",
    name: "Eicher Pro Series 3015",
    brand: "Eicher",
    model: "Pro Series",
    year: 2024,
    price: 8450000,
    engine: "4000cc",
    mileage: "7 km/l",
    location: "Lalitpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Eicher+Pro+Series"],
    seller: { name: "Eicher Commercial", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9851234568" },
    postedDate: "2025-11-12",
    views: 134,
    description: "Eicher Pro Series with modern design and fuel efficiency.",
    seatingCapacity: "39 Seater",
    transmission: "Manual"
  },
  {
    id: "13",
    name: "Ashok Leyland Lynx",
    brand: "Ashok Leyland",
    model: "Lynx",
    year: 2023,
    price: 7250000,
    engine: "4000cc",
    mileage: "7 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Lynx"],
    seller: { name: "Ashok Leyland Motors", rating: 4.5, responseTime: "< 3 hours", phone: "+977-9861234568" },
    postedDate: "2025-11-04",
    views: 189,
    description: "Ashok Leyland Lynx with reliable performance for regular routes.",
    kmDriven: "178,800 km",
    seatingCapacity: "36 Seater",
    transmission: "Manual"
  },
  {
    id: "14",
    name: "BharatBenz 1017",
    brand: "BharatBenz",
    model: "1017",
    year: 2024,
    price: 9650000,
    engine: "4800cc",
    mileage: "6 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=BharatBenz+1017"],
    seller: { name: "BharatBenz Motors", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9871234568" },
    postedDate: "2025-11-11",
    views: 95,
    description: "BharatBenz 1017 with German technology and comfort.",
    seatingCapacity: "41 Seater",
    transmission: "Manual"
  },
  {
    id: "15",
    name: "Volvo B9R Multi Axle",
    brand: "Volvo",
    model: "B9R",
    year: 2023,
    price: 25000000,
    engine: "9000cc",
    mileage: "3 km/l",
    location: "Biratnagar",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Volvo+B9R"],
    seller: { name: "Volvo Premium", rating: 5.0, responseTime: "< 30 min", phone: "+977-9881234568" },
    postedDate: "2025-11-08",
    views: 167,
    description: "Volvo B9R multi-axle luxury bus for long distance travel.",
    kmDriven: "345,200 km",
    seatingCapacity: "49 Seater",
    transmission: "Automatic"
  },
  {
    id: "16",
    name: "Mahindra Blazo 25",
    brand: "Mahindra",
    model: "Blazo",
    year: 2024,
    price: 10850000,
    engine: "7200cc",
    mileage: "5 km/l",
    location: "Butwal",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mahindra+Blazo"],
    seller: { name: "Mahindra Commercial", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9891234568" },
    postedDate: "2025-11-06",
    views: 143,
    description: "Mahindra Blazo with powerful engine and modern amenities.",
    seatingCapacity: "47 Seater",
    transmission: "Manual"
  },
  {
    id: "17",
    name: "Scania Touring",
    brand: "Scania",
    model: "Touring",
    year: 2024,
    price: 28500000,
    engine: "11000cc",
    mileage: "3 km/l",
    location: "Dhangadhi",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Scania+Touring"],
    seller: { name: "Scania Premium", rating: 5.0, responseTime: "< 30 min", phone: "+977-9801234568" },
    postedDate: "2025-11-14",
    views: 78,
    description: "Scania Touring luxury coach with world-class comfort and safety.",
    seatingCapacity: "53 Seater",
    transmission: "Automatic"
  },
  {
    id: "18",
    name: "Tata 1512 LPT",
    brand: "Tata",
    model: "1512",
    year: 2023,
    price: 8950000,
    engine: "5900cc",
    mileage: "6 km/l",
    location: "Nepalgunj",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+1512"],
    seller: { name: "Tata Heavy", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9811234568" },
    postedDate: "2025-11-09",
    views: 189,
    description: "Tata 1512 LPT with strong build for heavy duty routes.",
    kmDriven: "225,300 km",
    seatingCapacity: "45 Seater",
    transmission: "Manual"
  },
  {
    id: "19",
    name: "Mercedes OF 917",
    brand: "Mercedes",
    model: "OF 917",
    year: 2024,
    price: 16500000,
    engine: "6400cc",
    mileage: "5 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mercedes+OF+917"],
    seller: { name: "Mercedes Center", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9821234568" },
    postedDate: "2025-11-10",
    views: 112,
    description: "Mercedes OF 917 with premium features and German reliability.",
    seatingCapacity: "43 Seater",
    transmission: "Manual"
  },
  {
    id: "20",
    name: "Ashok Leyland Boss",
    brand: "Ashok Leyland",
    model: "Boss",
    year: 2024,
    price: 9850000,
    engine: "5200cc",
    mileage: "6 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Boss"],
    seller: { name: "Ashok Leyland Boss", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9831234568" },
    postedDate: "2025-11-13",
    views: 156,
    description: "Ashok Leyland Boss with modern design and passenger comfort.",
    seatingCapacity: "38 Seater",
    transmission: "Manual"
  }
];

// Component structure follows the same pattern as other vehicle pages...
export default dynamic(() => Promise.resolve(NepalBusListings), {
  ssr: false,
});