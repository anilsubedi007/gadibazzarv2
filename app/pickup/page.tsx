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
interface Pickup {
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
  driveType: string;
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

interface PickupCardProps {
  pickup: Pickup;
  onSave: (id: string) => void;
  onImageClick: (pickup: Pickup) => void;
  savedItems: Set<string>;
}

// ============ FILTER DATA ============
const pickupData = {
  "Toyota": ["Hilux", "Tacoma", "Vigo", "Revo", "Fortuner"],
  "Mahindra": ["Scorpio Pickup", "Bolero Pickup", "Imperio", "Supro"],
  "Isuzu": ["D-Max", "Trooper", "Rodeo", "Panther"],
  "Tata": ["Xenon", "Yodha", "207 DI", "Sumo Grande"],
  "Mitsubishi": ["L200", "Triton", "Strada", "Canter"],
  "Nissan": ["Navara", "Frontier", "NP300", "Hardbody"],
  "Ford": ["Ranger", "F-150", "Courier", "Raptor"],
  "Suzuki": ["Super Carry", "APV", "Mega Carry"],
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

// Price options for pickups
const priceOptions = [
  { value: "0", label: "₨0" },
  { value: "1000000", label: "₨10,00,000" },
  { value: "1500000", label: "₨15,00,000" },
  { value: "2000000", label: "₨20,00,000" },
  { value: "2500000", label: "₨25,00,000" },
  { value: "3000000", label: "₨30,00,000" },
  { value: "3500000", label: "₨35,00,000" },
  { value: "4000000", label: "₨40,00,000" },
  { value: "5000000", label: "₨50,00,000" },
  { value: "6000000", label: "₨60,00,000" },
  { value: "8000000", label: "₨80,00,000" },
  { value: "10000000", label: "₨1,00,00,000" },
];

const yearOptions = Array.from({ length: 22 }, (_, i) => 2026 - i);

const odometerOptions = [
  { value: "0", label: "0 km" },
  { value: "10000", label: "10,000 km" },
  { value: "25000", label: "25,000 km" },
  { value: "50000", label: "50,000 km" },
  { value: "75000", label: "75,000 km" },
  { value: "100000", label: "1,00,000 km" },
  { value: "150000", label: "1,50,000 km" },
  { value: "200000", label: "2,00,000 km" },
  { value: "300000", label: "3,00,000 km" },
];

const conditionOptions = ["New", "Used"];

// ============ SAMPLE PICKUP DATA ============
const generateNepalPickups = (): Pickup[] => [
  {
    id: "1",
    name: "Toyota Hilux Revo",
    brand: "Toyota",
    model: "Hilux",
    year: 2023,
    price: 6850000,
    engine: "2400cc",
    mileage: "12 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Toyota+Hilux"],
    seller: { name: "Toyota Center", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9841234567" },
    postedDate: "2025-11-10",
    views: 245,
    description: "Toyota Hilux Revo in excellent condition with 4WD capability.",
    kmDriven: "45,200 km",
    driveType: "4WD",
    transmission: "Manual"
  },
  {
    id: "2",
    name: "Mahindra Scorpio Pickup",
    brand: "Mahindra",
    model: "Scorpio Pickup",
    year: 2024,
    price: 4250000,
    engine: "2200cc",
    mileage: "14 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mahindra+Scorpio+Pickup"],
    seller: { name: "Mahindra Dealer", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9851234567" },
    postedDate: "2025-11-14",
    views: 156,
    description: "Brand new Mahindra Scorpio pickup with powerful diesel engine.",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "3",
    name: "Isuzu D-Max",
    brand: "Isuzu",
    model: "D-Max",
    year: 2022,
    price: 5850000,
    engine: "2500cc",
    mileage: "13 km/l",
    location: "Lalitpur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Isuzu+D-Max"],
    seller: { name: "Isuzu Nepal", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9861234567" },
    postedDate: "2025-11-08",
    views: 189,
    description: "Isuzu D-Max pickup with excellent build quality and reliability.",
    kmDriven: "62,800 km",
    driveType: "4WD",
    transmission: "Automatic"
  },
  {
    id: "4",
    name: "Tata Xenon",
    brand: "Tata",
    model: "Xenon",
    year: 2023,
    price: 3950000,
    engine: "2200cc",
    mileage: "15 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Tata+Xenon"],
    seller: { name: "Tata Motors", rating: 4.4, responseTime: "< 3 hours", phone: "+977-9871234567" },
    postedDate: "2025-11-13",
    views: 134,
    description: "New Tata Xenon pickup with modern features and efficiency.",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "5",
    name: "Mitsubishi L200",
    brand: "Mitsubishi",
    model: "L200",
    year: 2024,
    price: 7250000,
    engine: "2400cc",
    mileage: "11 km/l",
    location: "Biratnagar",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mitsubishi+L200"],
    seller: { name: "Mitsubishi Center", rating: 4.9, responseTime: "< 30 min", phone: "+977-9881234567" },
    postedDate: "2025-11-12",
    views: 98,
    description: "Premium Mitsubishi L200 with advanced 4WD system.",
    driveType: "4WD",
    transmission: "Automatic"
  },
  {
    id: "6",
    name: "Nissan Navara",
    brand: "Nissan",
    model: "Navara",
    year: 2023,
    price: 6450000,
    engine: "2300cc",
    mileage: "13 km/l",
    location: "Butwal",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Nissan+Navara"],
    seller: { name: "Nissan Nepal", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9891234567" },
    postedDate: "2025-11-05",
    views: 167,
    description: "Nissan Navara with comfortable interior and strong performance.",
    kmDriven: "38,500 km",
    driveType: "4WD",
    transmission: "Manual"
  },
  {
    id: "7",
    name: "Ford Ranger",
    brand: "Ford",
    model: "Ranger",
    year: 2024,
    price: 8950000,
    engine: "2000cc",
    mileage: "10 km/l",
    location: "Dhangadhi",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Ford+Ranger"],
    seller: { name: "Ford Dealer", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9801234567" },
    postedDate: "2025-11-11",
    views: 89,
    description: "Ford Ranger with turbo diesel engine and premium features.",
    driveType: "4WD",
    transmission: "Automatic"
  },
  {
    id: "8",
    name: "Suzuki Super Carry",
    brand: "Suzuki",
    model: "Super Carry",
    year: 2023,
    price: 2850000,
    engine: "800cc",
    mileage: "18 km/l",
    location: "Nepalgunj",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Suzuki+Super+Carry"],
    seller: { name: "Suzuki Center", rating: 4.3, responseTime: "< 3 hours", phone: "+977-9811234567" },
    postedDate: "2025-11-09",
    views: 178,
    description: "Compact Suzuki Super Carry pickup for light commercial use.",
    kmDriven: "42,100 km",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "9",
    name: "Toyota Vigo",
    brand: "Toyota",
    model: "Vigo",
    year: 2022,
    price: 5950000,
    engine: "2500cc",
    mileage: "12 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Toyota+Vigo"],
    seller: { name: "Toyota Premium", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9821234567" },
    postedDate: "2025-11-06",
    views: 223,
    description: "Toyota Vigo pickup with reliable performance and durability.",
    kmDriven: "55,700 km",
    driveType: "4WD",
    transmission: "Manual"
  },
  {
    id: "10",
    name: "Mahindra Imperio",
    brand: "Mahindra",
    model: "Imperio",
    year: 2024,
    price: 3650000,
    engine: "2200cc",
    mileage: "16 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mahindra+Imperio"],
    seller: { name: "Mahindra Showroom", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9831234567" },
    postedDate: "2025-11-13",
    views: 112,
    description: "Mahindra Imperio with modern design and fuel efficiency.",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "11",
    name: "Isuzu Trooper",
    brand: "Isuzu",
    model: "Trooper",
    year: 2023,
    price: 7850000,
    engine: "3000cc",
    mileage: "10 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Isuzu+Trooper"],
    seller: { name: "Isuzu Premium", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9841234568" },
    postedDate: "2025-11-07",
    views: 156,
    description: "Isuzu Trooper with powerful engine and off-road capabilities.",
    kmDriven: "35,400 km",
    driveType: "4WD",
    transmission: "Automatic"
  },
  {
    id: "12",
    name: "Tata Yodha",
    brand: "Tata",
    model: "Yodha",
    year: 2024,
    price: 4150000,
    engine: "2200cc",
    mileage: "14 km/l",
    location: "Lalitpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Tata+Yodha"],
    seller: { name: "Tata Commercial", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9851234568" },
    postedDate: "2025-11-12",
    views: 134,
    description: "Tata Yodha pickup with strong build and commercial features.",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "13",
    name: "Mitsubishi Triton",
    brand: "Mitsubishi",
    model: "Triton",
    year: 2023,
    price: 6850000,
    engine: "2400cc",
    mileage: "12 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mitsubishi+Triton"],
    seller: { name: "Mitsubishi Motors", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9861234568" },
    postedDate: "2025-11-04",
    views: 189,
    description: "Mitsubishi Triton with advanced safety features and comfort.",
    kmDriven: "47,800 km",
    driveType: "4WD",
    transmission: "Manual"
  },
  {
    id: "14",
    name: "Nissan NP300",
    brand: "Nissan",
    model: "NP300",
    year: 2024,
    price: 5250000,
    engine: "2500cc",
    mileage: "13 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Nissan+NP300"],
    seller: { name: "Nissan Showroom", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9871234568" },
    postedDate: "2025-11-11",
    views: 95,
    description: "Nissan NP300 with modern technology and reliable performance.",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "15",
    name: "Ford Courier",
    brand: "Ford",
    model: "Courier",
    year: 2022,
    price: 4850000,
    engine: "2200cc",
    mileage: "14 km/l",
    location: "Biratnagar",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Ford+Courier"],
    seller: { name: "Ford Center", rating: 4.4, responseTime: "< 3 hours", phone: "+977-9881234568" },
    postedDate: "2025-11-08",
    views: 167,
    description: "Ford Courier pickup with practical design and efficiency.",
    kmDriven: "58,200 km",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "16",
    name: "Suzuki APV",
    brand: "Suzuki",
    model: "APV",
    year: 2023,
    price: 3250000,
    engine: "1600cc",
    mileage: "16 km/l",
    location: "Butwal",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Suzuki+APV"],
    seller: { name: "Suzuki Motors", rating: 4.2, responseTime: "< 2 hours", phone: "+977-9891234568" },
    postedDate: "2025-11-06",
    views: 143,
    description: "Suzuki APV pickup with versatile cargo space and comfort.",
    kmDriven: "41,500 km",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "17",
    name: "Toyota Tacoma",
    brand: "Toyota",
    model: "Tacoma",
    year: 2024,
    price: 9850000,
    engine: "2700cc",
    mileage: "9 km/l",
    location: "Dhangadhi",
    fuelType: "Petrol",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Toyota+Tacoma"],
    seller: { name: "Toyota Premium", rating: 4.9, responseTime: "< 30 min", phone: "+977-9801234568" },
    postedDate: "2025-11-14",
    views: 78,
    description: "Premium Toyota Tacoma with advanced off-road capabilities.",
    driveType: "4WD",
    transmission: "Automatic"
  },
  {
    id: "18",
    name: "Mahindra Bolero Pickup",
    brand: "Mahindra",
    model: "Bolero Pickup",
    year: 2023,
    price: 3850000,
    engine: "2500cc",
    mileage: "15 km/l",
    location: "Nepalgunj",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+Bolero+Pickup"],
    seller: { name: "Bolero Center", rating: 4.3, responseTime: "< 2 hours", phone: "+977-9811234568" },
    postedDate: "2025-11-09",
    views: 189,
    description: "Mahindra Bolero pickup with rugged build and reliability.",
    kmDriven: "52,300 km",
    driveType: "4WD",
    transmission: "Manual"
  },
  {
    id: "19",
    name: "Isuzu Panther",
    brand: "Isuzu",
    model: "Panther",
    year: 2024,
    price: 6450000,
    engine: "2300cc",
    mileage: "12 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Isuzu+Panther"],
    seller: { name: "Isuzu Motors", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9821234568" },
    postedDate: "2025-11-10",
    views: 112,
    description: "Isuzu Panther with excellent payload capacity and durability.",
    driveType: "2WD",
    transmission: "Manual"
  },
  {
    id: "20",
    name: "Tata Sumo Grande",
    brand: "Tata",
    model: "Sumo Grande",
    year: 2023,
    price: 4650000,
    engine: "2200cc",
    mileage: "13 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+Sumo+Grande"],
    seller: { name: "Tata Grande", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9831234568" },
    postedDate: "2025-11-13",
    views: 156,
    description: "Tata Sumo Grande with spacious cabin and strong performance.",
    kmDriven: "39,800 km",
    driveType: "4WD",
    transmission: "Manual"
  }
];

// Component structure continues the same as other vehicle pages...
// [Rest of the code follows the same pattern with PickupCard, FilterPanel, and main component]

export default dynamic(() => Promise.resolve(NepalPickupListings), {
  ssr: false,
});