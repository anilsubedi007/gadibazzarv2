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
  Truck,
  Gauge,
  Cog,
} from "lucide-react";
import dynamic from "next/dynamic";

// ============ TYPES ============
interface TruckVehicle {
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
  payloadCapacity: string;
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

interface TruckCardProps {
  truck: TruckVehicle;
  onSave: (id: string) => void;
  onImageClick: (truck: TruckVehicle) => void;
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
const truckData = {
  "Tata": ["407", "709", "912", "1109", "1512", "LPT 1613", "Prima"],
  "Ashok Leyland": ["Dost", "Partner", "Boss", "Guru", "Captain", "U-Truck"],
  "Mahindra": ["Bolero Maxi Truck", "Jeeto", "Supro Maxi Truck", "Blazo"],
  "Eicher": ["Pro 2049", "Pro 3015", "Pro 6025"],
  "BharatBenz": ["1214", "1617", "2523", "3143"],
  "Volvo": ["FE", "FL", "FH", "FMX"],
  "Scania": ["P280", "G410", "R450"],
  "Isuzu": ["NPR", "Forward", "Giga"],
  "Force": ["Shaktimaan", "Trax Cruiser"],
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
  { value: "1000000", label: "₨10,00,000" },
  { value: "1500000", label: "₨15,00,000" },
  { value: "2000000", label: "₨20,00,000" },
  { value: "2500000", label: "₨25,00,000" },
  { value: "3000000", label: "₨30,00,000" },
  { value: "4000000", label: "₨40,00,000" },
  { value: "5000000", label: "₨50,00,000" },
  { value: "8000000", label: "₨80,00,000" },
  { value: "10000000", label: "₨1,00,00,000" },
  { value: "15000000", label: "₨1,50,00,000" },
];

const yearOptions = Array.from({ length: 22 }, (_, i) => 2026 - i);
const odometerOptions = [
  { value: "0", label: "0 km" },
  { value: "50000", label: "50,000 km" },
  { value: "100000", label: "1,00,000 km" },
  { value: "200000", label: "2,00,000 km" },
  { value: "300000", label: "3,00,000 km" },
  { value: "500000", label: "5,00,000 km" },
  { value: "750000", label: "7,50,000 km" },
  { value: "1000000", label: "10,00,000 km" },
];

const conditionOptions = ["New", "Used"];

// ============ SAMPLE TRUCK DATA ============
const generateNepalTrucks = (): TruckVehicle[] => [
  {
    id: "1",
    name: "Tata 407 Gold",
    brand: "Tata",
    model: "407",
    year: 2023,
    price: 2850000,
    engine: "3800cc",
    mileage: "8 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+407"],
    seller: { name: "Tata Commercial", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9841234567" },
    postedDate: "2025-11-10",
    views: 245,
    description: "Tata 407 Gold in excellent condition for goods transport.",
    kmDriven: "125,200 km",
    payloadCapacity: "2.5 Ton",
    transmission: "Manual"
  },
  {
    id: "2",
    name: "Ashok Leyland Dost Strong",
    brand: "Ashok Leyland",
    model: "Dost",
    year: 2024,
    price: 1850000,
    engine: "1500cc",
    mileage: "12 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Dost"],
    seller: { name: "Ashok Leyland Center", rating: 4.7, responseTime: "< 30 min", phone: "+977-9851234567" },
    postedDate: "2025-11-14",
    views: 134,
    description: "Brand new Ashok Leyland Dost with superior mileage.",
    payloadCapacity: "1.25 Ton",
    transmission: "Manual"
  },
  {
    id: "3",
    name: "Mahindra Bolero Maxi Truck Plus",
    brand: "Mahindra",
    model: "Bolero Maxi Truck",
    year: 2023,
    price: 2250000,
    engine: "2500cc",
    mileage: "10 km/l",
    location: "Lalitpur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+Bolero+Maxi"],
    seller: { name: "Mahindra Commercial", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9861234567" },
    postedDate: "2025-11-08",
    views: 189,
    description: "Mahindra Bolero Maxi Truck with rugged build quality.",
    kmDriven: "85,800 km",
    payloadCapacity: "1.7 Ton",
    transmission: "Manual"
  },
  {
    id: "4",
    name: "Eicher Pro 2049",
    brand: "Eicher",
    model: "Pro 2049",
    year: 2024,
    price: 3650000,
    engine: "3300cc",
    mileage: "9 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Eicher+Pro+2049"],
    seller: { name: "Eicher Motors", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9871234567" },
    postedDate: "2025-11-13",
    views: 156,
    description: "Eicher Pro 2049 with modern technology and efficiency.",
    payloadCapacity: "4.9 Ton",
    transmission: "Manual"
  },
  {
    id: "5",
    name: "BharatBenz 1214R",
    brand: "BharatBenz",
    model: "1214",
    year: 2024,
    price: 4850000,
    engine: "4800cc",
    mileage: "7 km/l",
    location: "Biratnagar",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=BharatBenz+1214"],
    seller: { name: "BharatBenz Center", rating: 4.9, responseTime: "< 30 min", phone: "+977-9881234567" },
    postedDate: "2025-11-12",
    views: 98,
    description: "BharatBenz 1214R with German engineering and reliability.",
    payloadCapacity: "7.2 Ton",
    transmission: "Manual"
  },
  {
    id: "6",
    name: "Tata 709g",
    brand: "Tata",
    model: "709",
    year: 2023,
    price: 3150000,
    engine: "3800cc",
    mileage: "8 km/l",
    location: "Butwal",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+709"],
    seller: { name: "Tata Motors", rating: 4.4, responseTime: "< 3 hours", phone: "+977-9891234567" },
    postedDate: "2025-11-05",
    views: 167,
    description: "Tata 709g with proven performance for medium loads.",
    kmDriven: "165,500 km",
    payloadCapacity: "4.0 Ton",
    transmission: "Manual"
  },
  {
    id: "7",
    name: "Volvo FE 280",
    brand: "Volvo",
    model: "FE",
    year: 2024,
    price: 8950000,
    engine: "7700cc",
    mileage: "5 km/l",
    location: "Dhangadhi",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Volvo+FE"],
    seller: { name: "Volvo Trucks", rating: 4.9, responseTime: "< 30 min", phone: "+977-9801234567" },
    postedDate: "2025-11-11",
    views: 89,
    description: "Volvo FE 280 with premium features and safety systems.",
    payloadCapacity: "12 Ton",
    transmission: "Automatic"
  },
  {
    id: "8",
    name: "Ashok Leyland Partner",
    brand: "Ashok Leyland",
    model: "Partner",
    year: 2023,
    price: 2450000,
    engine: "1500cc",
    mileage: "11 km/l",
    location: "Nepalgunj",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Partner"],
    seller: { name: "Ashok Leyland", rating: 4.3, responseTime: "< 2 hours", phone: "+977-9811234567" },
    postedDate: "2025-11-09",
    views: 178,
    description: "Ashok Leyland Partner with fuel efficiency and durability.",
    kmDriven: "95,100 km",
    payloadCapacity: "1.5 Ton",
    transmission: "Manual"
  },
  {
    id: "9",
    name: "Tata 1109",
    brand: "Tata",
    model: "1109",
    year: 2024,
    price: 5250000,
    engine: "5900cc",
    mileage: "6 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Tata+1109"],
    seller: { name: "Tata Heavy", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9821234567" },
    postedDate: "2025-11-13",
    views: 123,
    description: "Tata 1109 heavy duty truck with high payload capacity.",
    payloadCapacity: "9.5 Ton",
    transmission: "Manual"
  },
  {
    id: "10",
    name: "Mahindra Jeeto",
    brand: "Mahindra",
    model: "Jeeto",
    year: 2024,
    price: 1650000,
    engine: "600cc",
    mileage: "15 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mahindra+Jeeto"],
    seller: { name: "Mahindra Jeeto", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9831234567" },
    postedDate: "2025-11-14",
    views: 112,
    description: "Compact Mahindra Jeeto for urban goods transportation.",
    payloadCapacity: "750 Kg",
    transmission: "Manual"
  },
  {
    id: "11",
    name: "Scania P280",
    brand: "Scania",
    model: "P280",
    year: 2024,
    price: 12500000,
    engine: "9000cc",
    mileage: "4 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Scania+P280"],
    seller: { name: "Scania Nepal", rating: 5.0, responseTime: "< 30 min", phone: "+977-9841234568" },
    postedDate: "2025-11-12",
    views: 95,
    description: "Scania P280 premium truck with world-class performance.",
    payloadCapacity: "16 Ton",
    transmission: "Automatic"
  },
  {
    id: "12",
    name: "Eicher Pro 3015",
    brand: "Eicher",
    model: "Pro 3015",
    year: 2024,
    price: 4250000,
    engine: "4000cc",
    mileage: "8 km/l",
    location: "Lalitpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Eicher+Pro+3015"],
    seller: { name: "Eicher Commercial", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9851234568" },
    postedDate: "2025-11-11",
    views: 134,
    description: "Eicher Pro 3015 with advanced features and comfort.",
    payloadCapacity: "6.2 Ton",
    transmission: "Manual"
  },
  {
    id: "13",
    name: "Ashok Leyland Boss",
    brand: "Ashok Leyland",
    model: "Boss",
    year: 2023,
    price: 3850000,
    engine: "2500cc",
    mileage: "9 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Boss"],
    seller: { name: "Ashok Leyland Motors", rating: 4.5, responseTime: "< 3 hours", phone: "+977-9861234568" },
    postedDate: "2025-11-04",
    views: 189,
    description: "Ashok Leyland Boss with reliable performance and comfort.",
    kmDriven: "135,800 km",
    payloadCapacity: "3.5 Ton",
    transmission: "Manual"
  },
  {
    id: "14",
    name: "BharatBenz 1617",
    brand: "BharatBenz",
    model: "1617",
    year: 2024,
    price: 6850000,
    engine: "6700cc",
    mileage: "6 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=BharatBenz+1617"],
    seller: { name: "BharatBenz Motors", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9871234568" },
    postedDate: "2025-11-10",
    views: 95,
    description: "BharatBenz 1617 with German technology and efficiency.",
    payloadCapacity: "10 Ton",
    transmission: "Manual"
  },
  {
    id: "15",
    name: "Tata 1512",
    brand: "Tata",
    model: "1512",
    year: 2023,
    price: 7250000,
    engine: "5900cc",
    mileage: "5 km/l",
    location: "Biratnagar",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+1512"],
    seller: { name: "Tata Commercial", rating: 4.4, responseTime: "< 2 hours", phone: "+977-9881234568" },
    postedDate: "2025-11-08",
    views: 167,
    description: "Tata 1512 heavy duty truck for long distance hauling.",
    kmDriven: "285,200 km",
    payloadCapacity: "15 Ton",
    transmission: "Manual"
  },
  {
    id: "16",
    name: "Isuzu NPR",
    brand: "Isuzu",
    model: "NPR",
    year: 2024,
    price: 3950000,
    engine: "4300cc",
    mileage: "7 km/l",
    location: "Butwal",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Isuzu+NPR"],
    seller: { name: "Isuzu Center", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9891234568" },
    postedDate: "2025-11-13",
    views: 123,
    description: "Isuzu NPR with Japanese reliability and fuel efficiency.",
    payloadCapacity: "5 Ton",
    transmission: "Manual"
  },
  {
    id: "17",
    name: "Force Shaktimaan",
    brand: "Force",
    model: "Shaktimaan",
    year: 2023,
    price: 2950000,
    engine: "2600cc",
    mileage: "9 km/l",
    location: "Dhangadhi",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Force+Shaktimaan"],
    seller: { name: "Force Motors", rating: 4.3, responseTime: "< 2 hours", phone: "+977-9801234568" },
    postedDate: "2025-11-06",
    views: 145,
    description: "Force Shaktimaan with strong build for tough conditions.",
    kmDriven: "115,500 km",
    payloadCapacity: "3.5 Ton",
    transmission: "Manual"
  },
  {
    id: "18",
    name: "Volvo FL 240",
    brand: "Volvo",
    model: "FL",
    year: 2024,
    price: 9850000,
    engine: "5100cc",
    mileage: "6 km/l",
    location: "Nepalgunj",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Volvo+FL"],
    seller: { name: "Volvo Commercial", rating: 4.9, responseTime: "< 30 min", phone: "+977-9811234568" },
    postedDate: "2025-11-12",
    views: 89,
    description: "Volvo FL 240 with advanced safety and comfort features.",
    payloadCapacity: "8.5 Ton",
    transmission: "Automatic"
  },
  {
    id: "19",
    name: "Mahindra Blazo 25",
    brand: "Mahindra",
    model: "Blazo",
    year: 2024,
    price: 8450000,
    engine: "7200cc",
    mileage: "5 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mahindra+Blazo"],
    seller: { name: "Mahindra Heavy", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9821234568" },
    postedDate: "2025-11-09",
    views: 112,
    description: "Mahindra Blazo 25 with powerful engine and modern features.",
    payloadCapacity: "16.2 Ton",
    transmission: "Manual"
  },
  {
    id: "20",
    name: "Tata Prima 1928.K",
    brand: "Tata",
    model: "Prima",
    year: 2024,
    price: 11500000,
    engine: "6700cc",
    mileage: "4 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Tata+Prima"],
    seller: { name: "Tata Prima", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9831234568" },
    postedDate: "2025-11-14",
    views: 67,
    description: "Tata Prima with premium cabin and high performance engine.",
    payloadCapacity: "19 Ton",
    transmission: "Manual"
  }
];

// Component structure follows the same pattern as other vehicle pages...
export default dynamic(() => Promise.resolve(NepalTruckListings), {
  ssr: false,
});