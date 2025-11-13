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
interface MicroBus {
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

interface MicroBusCardProps {
  microbus: MicroBus;
  onSave: (id: string) => void;
  onImageClick: (microbus: MicroBus) => void;
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
const microbusData = {
  "Tata": ["Magic", "Winger", "Ultra", "407", "LP 713"],
  "Mahindra": ["Tourister", "Supro", "Bolero Maxi Truck", "Jeeto"],
  "Force": ["Traveller", "Tempo Traveller", "Trax", "Cruiser"],
  "Maruti Suzuki": ["Omni", "Eeco", "Super Carry"],
  "Toyota": ["Hiace", "Coaster", "Commuter"],
  "Hyundai": ["H100", "H1", "County"],
  "Ashok Leyland": ["Dost", "Partner", "MiTR"],
  "Bajaj": ["Maxima", "RE"],
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
  { value: "500000", label: "₨5,00,000" },
  { value: "1000000", label: "₨10,00,000" },
  { value: "1500000", label: "₨15,00,000" },
  { value: "2000000", label: "₨20,00,000" },
  { value: "2500000", label: "₨25,00,000" },
  { value: "3000000", label: "₨30,00,000" },
  { value: "3500000", label: "₨35,00,000" },
  { value: "4000000", label: "₨40,00,000" },
  { value: "5000000", label: "₨50,00,000" },
  { value: "6000000", label: "₨60,00,000" },
];

const yearOptions = Array.from({ length: 22 }, (_, i) => 2026 - i);
const odometerOptions = [
  { value: "0", label: "0 km" },
  { value: "25000", label: "25,000 km" },
  { value: "50000", label: "50,000 km" },
  { value: "75000", label: "75,000 km" },
  { value: "100000", label: "1,00,000 km" },
  { value: "150000", label: "1,50,000 km" },
  { value: "200000", label: "2,00,000 km" },
  { value: "300000", label: "3,00,000 km" },
];

const conditionOptions = ["New", "Used"];

// ============ SAMPLE MICROBUS DATA ============
const generateNepalMicroBuses = (): MicroBus[] => [
  {
    id: "1",
    name: "Tata Magic Express",
    brand: "Tata",
    model: "Magic",
    year: 2023,
    price: 1650000,
    engine: "700cc",
    mileage: "18 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+Magic"],
    seller: { name: "Tata Commercial", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9841234567" },
    postedDate: "2025-11-10",
    views: 189,
    description: "Tata Magic microbus in excellent condition for passenger transport.",
    kmDriven: "85,200 km",
    seatingCapacity: "9 Seater",
    transmission: "Manual"
  },
  {
    id: "2",
    name: "Mahindra Tourister",
    brand: "Mahindra",
    model: "Tourister",
    year: 2024,
    price: 2850000,
    engine: "2200cc",
    mileage: "14 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mahindra+Tourister"],
    seller: { name: "Mahindra Commercial", rating: 4.8, responseTime: "< 30 min", phone: "+977-9851234567" },
    postedDate: "2025-11-14",
    views: 134,
    description: "Brand new Mahindra Tourister with comfortable seating and AC.",
    seatingCapacity: "17 Seater",
    transmission: "Manual"
  },
  {
    id: "3",
    name: "Force Tempo Traveller",
    brand: "Force",
    model: "Tempo Traveller",
    year: 2023,
    price: 3250000,
    engine: "2600cc",
    mileage: "12 km/l",
    location: "Lalitpur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Force+Tempo+Traveller"],
    seller: { name: "Force Motors", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9861234567" },
    postedDate: "2025-11-08",
    views: 167,
    description: "Force Tempo Traveller with luxury features and smooth ride.",
    kmDriven: "62,800 km",
    seatingCapacity: "20 Seater",
    transmission: "Manual"
  },
  {
    id: "4",
    name: "Maruti Suzuki Eeco",
    brand: "Maruti Suzuki",
    model: "Eeco",
    year: 2024,
    price: 1850000,
    engine: "1200cc",
    mileage: "16 km/l",
    location: "Chitwan",
    fuelType: "CNG",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Maruti+Eeco"],
    seller: { name: "Maruti Center", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9871234567" },
    postedDate: "2025-11-13",
    views: 156,
    description: "Maruti Eeco with CNG kit for economical passenger transport.",
    seatingCapacity: "7 Seater",
    transmission: "Manual"
  },
  {
    id: "5",
    name: "Toyota Hiace",
    brand: "Toyota",
    model: "Hiace",
    year: 2024,
    price: 4850000,
    engine: "2800cc",
    mileage: "11 km/l",
    location: "Biratnagar",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Toyota+Hiace"],
    seller: { name: "Toyota Commercial", rating: 4.9, responseTime: "< 30 min", phone: "+977-9881234567" },
    postedDate: "2025-11-12",
    views: 95,
    description: "Premium Toyota Hiace with advanced safety features.",
    seatingCapacity: "15 Seater",
    transmission: "Manual"
  },
  {
    id: "6",
    name: "Hyundai H100",
    brand: "Hyundai",
    model: "H100",
    year: 2022,
    price: 2650000,
    engine: "2500cc",
    mileage: "13 km/l",
    location: "Butwal",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Hyundai+H100"],
    seller: { name: "Hyundai Center", rating: 4.4, responseTime: "< 3 hours", phone: "+977-9891234567" },
    postedDate: "2025-11-05",
    views: 178,
    description: "Hyundai H100 microbus with reliable performance and comfort.",
    kmDriven: "95,500 km",
    seatingCapacity: "12 Seater",
    transmission: "Manual"
  },
  {
    id: "7",
    name: "Ashok Leyland Dost",
    brand: "Ashok Leyland",
    model: "Dost",
    year: 2024,
    price: 2150000,
    engine: "1500cc",
    mileage: "15 km/l",
    location: "Dhangadhi",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Dost"],
    seller: { name: "Ashok Leyland", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9801234567" },
    postedDate: "2025-11-11",
    views: 123,
    description: "Ashok Leyland Dost with efficient engine and strong build.",
    seatingCapacity: "8 Seater",
    transmission: "Manual"
  },
  {
    id: "8",
    name: "Bajaj Maxima",
    brand: "Bajaj",
    model: "Maxima",
    year: 2023,
    price: 1450000,
    engine: "500cc",
    mileage: "20 km/l",
    location: "Nepalgunj",
    fuelType: "CNG",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Bajaj+Maxima"],
    seller: { name: "Bajaj Commercial", rating: 4.3, responseTime: "< 2 hours", phone: "+977-9811234567" },
    postedDate: "2025-11-09",
    views: 145,
    description: "Bajaj Maxima with CNG conversion for cost-effective operation.",
    kmDriven: "78,100 km",
    seatingCapacity: "6 Seater",
    transmission: "Manual"
  },
  {
    id: "9",
    name: "Tata Winger",
    brand: "Tata",
    model: "Winger",
    year: 2024,
    price: 3650000,
    engine: "2200cc",
    mileage: "12 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Tata+Winger"],
    seller: { name: "Tata Motors", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9821234567" },
    postedDate: "2025-11-13",
    views: 112,
    description: "Tata Winger with spacious interior and modern amenities.",
    seatingCapacity: "17 Seater",
    transmission: "Manual"
  },
  {
    id: "10",
    name: "Mahindra Supro",
    brand: "Mahindra",
    model: "Supro",
    year: 2023,
    price: 1950000,
    engine: "800cc",
    mileage: "17 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+Supro"],
    seller: { name: "Mahindra Dealer", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9831234567" },
    postedDate: "2025-11-06",
    views: 189,
    description: "Mahindra Supro microbus with fuel efficiency and reliability.",
    kmDriven: "65,400 km",
    seatingCapacity: "8 Seater",
    transmission: "Manual"
  },
  {
    id: "11",
    name: "Force Traveller",
    brand: "Force",
    model: "Traveller",
    year: 2024,
    price: 2950000,
    engine: "2500cc",
    mileage: "13 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Force+Traveller"],
    seller: { name: "Force Commercial", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9841234568" },
    postedDate: "2025-11-12",
    views: 134,
    description: "Force Traveller with comfortable seating and air conditioning.",
    seatingCapacity: "15 Seater",
    transmission: "Manual"
  },
  {
    id: "12",
    name: "Maruti Suzuki Omni",
    brand: "Maruti Suzuki",
    model: "Omni",
    year: 2022,
    price: 1350000,
    engine: "800cc",
    mileage: "18 km/l",
    location: "Lalitpur",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Maruti+Omni"],
    seller: { name: "Maruti Motors", rating: 4.2, responseTime: "< 3 hours", phone: "+977-9851234568" },
    postedDate: "2025-11-04",
    views: 167,
    description: "Classic Maruti Omni with proven reliability and low maintenance.",
    kmDriven: "125,800 km",
    seatingCapacity: "8 Seater",
    transmission: "Manual"
  },
  {
    id: "13",
    name: "Toyota Coaster",
    brand: "Toyota",
    model: "Coaster",
    year: 2024,
    price: 5850000,
    engine: "4000cc",
    mileage: "9 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Toyota+Coaster"],
    seller: { name: "Toyota Premium", rating: 4.9, responseTime: "< 30 min", phone: "+977-9861234568" },
    postedDate: "2025-11-14",
    views: 78,
    description: "Toyota Coaster premium microbus with luxury features.",
    seatingCapacity: "30 Seater",
    transmission: "Manual"
  },
  {
    id: "14",
    name: "Hyundai County",
    brand: "Hyundai",
    model: "County",
    year: 2023,
    price: 4250000,
    engine: "3900cc",
    mileage: "10 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Hyundai+County"],
    seller: { name: "Hyundai Commercial", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9871234568" },
    postedDate: "2025-11-07",
    views: 145,
    description: "Hyundai County with high seating capacity and comfort.",
    kmDriven: "48,700 km",
    seatingCapacity: "25 Seater",
    transmission: "Manual"
  },
  {
    id: "15",
    name: "Ashok Leyland Partner",
    brand: "Ashok Leyland",
    model: "Partner",
    year: 2024,
    price: 2450000,
    engine: "1500cc",
    mileage: "14 km/l",
    location: "Biratnagar",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+Partner"],
    seller: { name: "Ashok Leyland Center", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9881234568" },
    postedDate: "2025-11-11",
    views: 123,
    description: "Ashok Leyland Partner with commercial grade performance.",
    seatingCapacity: "10 Seater",
    transmission: "Manual"
  },
  {
    id: "16",
    name: "Tata Ultra",
    brand: "Tata",
    model: "Ultra",
    year: 2023,
    price: 3150000,
    engine: "2200cc",
    mileage: "12 km/l",
    location: "Butwal",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+Ultra"],
    seller: { name: "Tata Ultra Center", rating: 4.4, responseTime: "< 3 hours", phone: "+977-9891234568" },
    postedDate: "2025-11-08",
    views: 156,
    description: "Tata Ultra microbus with strong engine and durability.",
    kmDriven: "72,300 km",
    seatingCapacity: "14 Seater",
    transmission: "Manual"
  },
  {
    id: "17",
    name: "Force Cruiser",
    brand: "Force",
    model: "Cruiser",
    year: 2024,
    price: 3450000,
    engine: "2600cc",
    mileage: "11 km/l",
    location: "Dhangadhi",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Force+Cruiser"],
    seller: { name: "Force Motors", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9801234568" },
    postedDate: "2025-11-13",
    views: 89,
    description: "Force Cruiser with premium interior and advanced features.",
    seatingCapacity: "18 Seater",
    transmission: "Manual"
  },
  {
    id: "18",
    name: "Mahindra Jeeto",
    brand: "Mahindra",
    model: "Jeeto",
    year: 2023,
    price: 1750000,
    engine: "600cc",
    mileage: "19 km/l",
    location: "Nepalgunj",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+Jeeto"],
    seller: { name: "Mahindra Jeeto", rating: 4.3, responseTime: "< 2 hours", phone: "+977-9811234568" },
    postedDate: "2025-11-09",
    views: 134,
    description: "Compact Mahindra Jeeto for urban passenger transport.",
    kmDriven: "58,900 km",
    seatingCapacity: "6 Seater",
    transmission: "Manual"
  },
  {
    id: "19",
    name: "Tata LP 713",
    brand: "Tata",
    model: "LP 713",
    year: 2024,
    price: 4650000,
    engine: "5700cc",
    mileage: "8 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Tata+LP+713"],
    seller: { name: "Tata Commercial", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9821234568" },
    postedDate: "2025-11-12",
    views: 95,
    description: "Tata LP 713 with large seating capacity for route operations.",
    seatingCapacity: "35 Seater",
    transmission: "Manual"
  },
  {
    id: "20",
    name: "Ashok Leyland MiTR",
    brand: "Ashok Leyland",
    model: "MiTR",
    year: 2023,
    price: 3850000,
    engine: "2500cc",
    mileage: "11 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Ashok+Leyland+MiTR"],
    seller: { name: "Ashok Leyland", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9831234568" },
    postedDate: "2025-11-10",
    views: 167,
    description: "Ashok Leyland MiTR with modern design and passenger comfort.",
    kmDriven: "55,400 km",
    seatingCapacity: "22 Seater",
    transmission: "Manual"
  }
];

// Component structure follows the same pattern as other vehicle pages...
export default dynamic(() => Promise.resolve(NepalMicroBusListings), {
  ssr: false,
});