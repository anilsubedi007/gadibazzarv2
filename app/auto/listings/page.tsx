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
  Car,
  Gauge,
  Cog,
} from "lucide-react";
import dynamic from "next/dynamic";

// ============ TYPES ============
interface Auto {
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
  autoType: string;
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

interface AutoCardProps {
  auto: Auto;
  onSave: (id: string) => void;
  onImageClick: (auto: Auto) => void;
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
const autoData = {
  "Bajaj": ["RE Auto", "Maxima", "Compact", "CNG Auto", "Diesel Auto"],
  "Mahindra": ["Alfa", "Champion", "Gio", "Treo", "e-Alfa Mini"],
  "TVS": ["King", "King Deluxe", "King Duramax", "King 4S"],
  "Piaggio": ["Ape Auto", "Ape City", "Ape Xtra", "Ape E-City"],
  "Force": ["Traveller", "Tempo", "Trax", "Gurkha"],
  "Tata": ["Ace", "Magic", "Winger", "Ultra"],
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

// Price options for auto rickshaws
const priceOptions = [
  { value: "0", label: "₨0" },
  { value: "100000", label: "₨1,00,000" },
  { value: "200000", label: "₨2,00,000" },
  { value: "300000", label: "₨3,00,000" },
  { value: "400000", label: "₨4,00,000" },
  { value: "500000", label: "₨5,00,000" },
  { value: "600000", label: "₨6,00,000" },
  { value: "700000", label: "₨7,00,000" },
  { value: "800000", label: "₨8,00,000" },
  { value: "900000", label: "₨9,00,000" },
  { value: "1000000", label: "₨10,00,000" },
  { value: "1200000", label: "₨12,00,000" },
  { value: "1500000", label: "₨15,00,000" },
];

const yearOptions = Array.from({ length: 22 }, (_, i) => 2026 - i);

const odometerOptions = [
  { value: "0", label: "0 km" },
  { value: "10000", label: "10,000 km" },
  { value: "20000", label: "20,000 km" },
  { value: "30000", label: "30,000 km" },
  { value: "50000", label: "50,000 km" },
  { value: "75000", label: "75,000 km" },
  { value: "100000", label: "1,00,000 km" },
  { value: "150000", label: "1,50,000 km" },
  { value: "200000", label: "2,00,000 km" },
];

const conditionOptions = ["New", "Used"];

// ============ SAMPLE AUTO RICKSHAW DATA ============
const generateNepalAutos = (): Auto[] => [
  {
    id: "1",
    name: "Bajaj RE Auto Rickshaw",
    brand: "Bajaj",
    model: "RE Auto",
    year: 2023,
    price: 485000,
    engine: "200cc",
    mileage: "35 km/l",
    location: "Kathmandu",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Bajaj+RE+Auto"],
    seller: { name: "Auto Bajaj Center", rating: 4.5, responseTime: "< 1 hour", phone: "+977-9841234567" },
    postedDate: "2025-11-10",
    views: 178,
    description: "Well maintained Bajaj RE Auto in excellent running condition.",
    kmDriven: "45,200 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "2",
    name: "Mahindra Alfa Auto",
    brand: "Mahindra",
    model: "Alfa",
    year: 2024,
    price: 520000,
    engine: "145cc",
    mileage: "40 km/l",
    location: "Pokhara",
    fuelType: "CNG",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mahindra+Alfa"],
    seller: { name: "Mahindra Auto", rating: 4.7, responseTime: "< 2 hours", phone: "+977-9851234567" },
    postedDate: "2025-11-14",
    views: 89,
    description: "Brand new Mahindra Alfa with CNG kit and commercial permit.",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "3",
    name: "TVS King Auto Rickshaw",
    brand: "TVS",
    model: "King",
    year: 2022,
    price: 425000,
    engine: "200cc",
    mileage: "32 km/l",
    location: "Lalitpur",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=TVS+King"],
    seller: { name: "TVS Auto Sales", rating: 4.3, responseTime: "< 3 hours", phone: "+977-9861234567" },
    postedDate: "2025-11-08",
    views: 156,
    description: "TVS King auto with good engine condition and valid documents.",
    kmDriven: "62,800 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "4",
    name: "Piaggio Ape Auto",
    brand: "Piaggio",
    model: "Ape Auto",
    year: 2024,
    price: 550000,
    engine: "230cc",
    mileage: "30 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Piaggio+Ape"],
    seller: { name: "Piaggio Nepal", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9871234567" },
    postedDate: "2025-11-13",
    views: 92,
    description: "New Piaggio Ape auto with diesel engine and commercial registration.",
    autoType: "Cargo",
    transmission: "Manual"
  },
  {
    id: "5",
    name: "Bajaj Maxima Auto",
    brand: "Bajaj",
    model: "Maxima",
    year: 2023,
    price: 465000,
    engine: "236cc",
    mileage: "33 km/l",
    location: "Biratnagar",
    fuelType: "CNG",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Bajaj+Maxima"],
    seller: { name: "Bajaj Dealer", rating: 4.4, responseTime: "< 2 hours", phone: "+977-9881234567" },
    postedDate: "2025-11-06",
    views: 167,
    description: "Bajaj Maxima with CNG conversion and comfortable seating.",
    kmDriven: "38,500 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "6",
    name: "Mahindra Champion Auto",
    brand: "Mahindra",
    model: "Champion",
    year: 2022,
    price: 395000,
    engine: "145cc",
    mileage: "38 km/l",
    location: "Butwal",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+Champion"],
    seller: { name: "Champion Auto", rating: 4.2, responseTime: "< 3 hours", phone: "+977-9891234567" },
    postedDate: "2025-11-05",
    views: 145,
    description: "Mahindra Champion auto in good running condition with permit.",
    kmDriven: "55,200 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "7",
    name: "TVS King Deluxe",
    brand: "TVS",
    model: "King Deluxe",
    year: 2024,
    price: 575000,
    engine: "200cc",
    mileage: "35 km/l",
    location: "Dhangadhi",
    fuelType: "CNG",
    condition: "new",
    images: ["/api/placeholder/400/300?text=TVS+King+Deluxe"],
    seller: { name: "TVS Showroom", rating: 4.9, responseTime: "< 30 min", phone: "+977-9801234567" },
    postedDate: "2025-11-12",
    views: 73,
    description: "TVS King Deluxe with premium features and CNG system.",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "8",
    name: "Piaggio Ape City",
    brand: "Piaggio",
    model: "Ape City",
    year: 2023,
    price: 485000,
    engine: "200cc",
    mileage: "34 km/l",
    location: "Nepalgunj",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Piaggio+Ape+City"],
    seller: { name: "Ape Center", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9811234567" },
    postedDate: "2025-11-09",
    views: 134,
    description: "Piaggio Ape City auto with city permit and good condition.",
    kmDriven: "42,100 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "9",
    name: "Force Traveller Auto",
    brand: "Force",
    model: "Traveller",
    year: 2023,
    price: 685000,
    engine: "600cc",
    mileage: "25 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Force+Traveller"],
    seller: { name: "Force Motors", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9821234567" },
    postedDate: "2025-11-11",
    views: 118,
    description: "Force Traveller auto with higher capacity and diesel engine.",
    kmDriven: "28,700 km",
    autoType: "Commercial",
    transmission: "Manual"
  },
  {
    id: "10",
    name: "Tata Ace Auto",
    brand: "Tata",
    model: "Ace",
    year: 2024,
    price: 750000,
    engine: "700cc",
    mileage: "22 km/l",
    location: "Bhaktapur",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Tata+Ace"],
    seller: { name: "Tata Commercial", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9831234567" },
    postedDate: "2025-11-14",
    views: 67,
    description: "New Tata Ace auto for commercial use with warranty.",
    autoType: "Commercial",
    transmission: "Manual"
  },
  {
    id: "11",
    name: "Bajaj CNG Auto",
    brand: "Bajaj",
    model: "CNG Auto",
    year: 2022,
    price: 435000,
    engine: "200cc",
    mileage: "45 km/l",
    location: "Kathmandu",
    fuelType: "CNG",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Bajaj+CNG"],
    seller: { name: "CNG Auto Center", rating: 4.3, responseTime: "< 2 hours", phone: "+977-9841234568" },
    postedDate: "2025-11-07",
    views: 189,
    description: "Bajaj CNG auto with excellent fuel efficiency and clean emission.",
    kmDriven: "58,600 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "12",
    name: "Mahindra Treo Electric",
    brand: "Mahindra",
    model: "Treo",
    year: 2024,
    price: 890000,
    engine: "Electric",
    mileage: "85 km/charge",
    location: "Lalitpur",
    fuelType: "Electric",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Mahindra+Treo"],
    seller: { name: "Mahindra Electric", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9851234568" },
    postedDate: "2025-11-13",
    views: 95,
    description: "Electric Mahindra Treo auto with zero emission and low maintenance.",
    autoType: "Electric",
    transmission: "Automatic"
  },
  {
    id: "13",
    name: "TVS King 4S",
    brand: "TVS",
    model: "King 4S",
    year: 2023,
    price: 515000,
    engine: "200cc",
    mileage: "36 km/l",
    location: "Pokhara",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=TVS+King+4S"],
    seller: { name: "TVS Auto", rating: 4.4, responseTime: "< 3 hours", phone: "+977-9861234568" },
    postedDate: "2025-11-04",
    views: 156,
    description: "TVS King 4S with 4-stroke engine and better performance.",
    kmDriven: "35,400 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "14",
    name: "Piaggio Ape Xtra",
    brand: "Piaggio",
    model: "Ape Xtra",
    year: 2024,
    price: 595000,
    engine: "230cc",
    mileage: "28 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Piaggio+Ape+Xtra"],
    seller: { name: "Piaggio Premium", rating: 4.9, responseTime: "< 30 min", phone: "+977-9871234568" },
    postedDate: "2025-11-11",
    views: 84,
    description: "Piaggio Ape Xtra with enhanced features and diesel efficiency.",
    autoType: "Cargo",
    transmission: "Manual"
  },
  {
    id: "15",
    name: "Bajaj Compact Auto",
    brand: "Bajaj",
    model: "Compact",
    year: 2023,
    price: 445000,
    engine: "145cc",
    mileage: "42 km/l",
    location: "Biratnagar",
    fuelType: "CNG",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Bajaj+Compact"],
    seller: { name: "Bajaj Auto Sales", rating: 4.2, responseTime: "< 2 hours", phone: "+977-9881234568" },
    postedDate: "2025-11-08",
    views: 167,
    description: "Compact Bajaj auto with CNG conversion and city permit.",
    kmDriven: "47,300 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "16",
    name: "Mahindra Gio Auto",
    brand: "Mahindra",
    model: "Gio",
    year: 2022,
    price: 385000,
    engine: "145cc",
    mileage: "39 km/l",
    location: "Butwal",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+Gio"],
    seller: { name: "Gio Auto Center", rating: 4.1, responseTime: "< 3 hours", phone: "+977-9891234568" },
    postedDate: "2025-11-06",
    views: 143,
    description: "Mahindra Gio auto in working condition with valid papers.",
    kmDriven: "68,900 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "17",
    name: "Force Tempo Auto",
    brand: "Force",
    model: "Tempo",
    year: 2024,
    price: 720000,
    engine: "600cc",
    mileage: "24 km/l",
    location: "Dhangadhi",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Force+Tempo"],
    seller: { name: "Force Nepal", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9801234568" },
    postedDate: "2025-11-12",
    views: 76,
    description: "New Force Tempo auto with commercial permit and warranty.",
    autoType: "Commercial",
    transmission: "Manual"
  },
  {
    id: "18",
    name: "TVS King Duramax",
    brand: "TVS",
    model: "King Duramax",
    year: 2023,
    price: 495000,
    engine: "200cc",
    mileage: "34 km/l",
    location: "Nepalgunj",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=TVS+King+Duramax"],
    seller: { name: "King Auto", rating: 4.5, responseTime: "< 2 hours", phone: "+977-9811234568" },
    postedDate: "2025-11-09",
    views: 129,
    description: "TVS King Duramax with durable engine and good mileage.",
    kmDriven: "41,200 km",
    autoType: "Passenger",
    transmission: "Manual"
  },
  {
    id: "19",
    name: "Tata Magic Auto",
    brand: "Tata",
    model: "Magic",
    year: 2023,
    price: 665000,
    engine: "500cc",
    mileage: "26 km/l",
    location: "Janakpur",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+Magic"],
    seller: { name: "Tata Magic Center", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9821234568" },
    postedDate: "2025-11-10",
    views: 112,
    description: "Tata Magic auto with spacious seating and diesel efficiency.",
    kmDriven: "32,800 km",
    autoType: "Commercial",
    transmission: "Manual"
  },
  {
    id: "20",
    name: "Piaggio Ape E-City",
    brand: "Piaggio",
    model: "Ape E-City",
    year: 2024,
    price: 925000,
    engine: "Electric",
    mileage: "80 km/charge",
    location: "Bhaktapur",
    fuelType: "Electric",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Piaggio+Ape+E-City"],
    seller: { name: "Piaggio Electric", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9831234568" },
    postedDate: "2025-11-14",
    views: 58,
    description: "Electric Piaggio Ape with modern features and eco-friendly design.",
    autoType: "Electric",
    transmission: "Automatic"
  }
];

// ============ AUTO CARD COMPONENT ============
const AutoCard: React.FC<AutoCardProps> = ({ auto, onSave, onImageClick, savedItems }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={auto.images[0]}
          alt={auto.name}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => onImageClick(auto)}
        />
        <button
          onClick={() => onSave(auto.id)}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            savedItems.has(auto.id) ? "bg-red-500" : "bg-white"
          }`}
        >
          <Heart
            size={20}
            className={savedItems.has(auto.id) ? "text-white" : "text-gray-400"}
            fill={savedItems.has(auto.id) ? "white" : "none"}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{auto.name}</h3>
        <p className="text-2xl font-bold text-blue-600">₨{auto.price.toLocaleString()}</p>
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Gauge size={16} />
            {auto.kmDriven || "New"}
          </div>
          <div className="flex items-center gap-1">
            <Cog size={16} />
            {auto.year}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            {auto.location}
          </div>
          <div>{auto.fuelType}</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Posted: {auto.postedDate}</p>
      </div>
    </div>
  );
};

// ============ FILTER PANEL COMPONENT ============
const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleBrandChange = (brand: string) => {
    const updated = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter((b) => b !== brand)
      : [...filters.selectedBrands, brand];
    onFiltersChange({ ...filters, selectedBrands: updated });
  };

  const handleProvinceChange = (province: string) => {
    const updated = filters.selectedProvinces.includes(province)
      ? filters.selectedProvinces.filter((p) => p !== province)
      : [...filters.selectedProvinces, province];
    onFiltersChange({ ...filters, selectedProvinces: updated });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-96 bg-white overflow-y-auto z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Brand Filter */}
          <div>
            <h3 className="font-bold mb-3">Brand</h3>
            <div className="space-y-2">
              {Object.keys(autoData).map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="mr-2"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-bold mb-3">Price Range</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.priceMin}
                onChange={(e) =>
                  onFiltersChange({ ...filters, priceMin: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.priceMax}
                onChange={(e) =>
                  onFiltersChange({ ...filters, priceMax: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Year Range */}
          <div>
            <h3 className="font-bold mb-3">Year</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min Year"
                value={filters.yearMin}
                onChange={(e) =>
                  onFiltersChange({ ...filters, yearMin: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Max Year"
                value={filters.yearMax}
                onChange={(e) =>
                  onFiltersChange({ ...filters, yearMax: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <h3 className="font-bold mb-3">Condition</h3>
            <div className="space-y-2">
              {conditionOptions.map((condition) => (
                <label key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.selectedConditions.includes(condition)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...filters.selectedConditions, condition]
                        : filters.selectedConditions.filter(
                            (c) => c !== condition
                          );
                      onFiltersChange({
                        ...filters,
                        selectedConditions: updated,
                      });
                    }}
                    className="mr-2"
                  />
                  {condition}
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onApply}
              className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold"
            >
              Apply Filters
            </button>
            <button
              onClick={onReset}
              className="flex-1 border border-gray-300 py-2 rounded font-semibold"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
function NepalAutoListings() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [filteredAutos, setFilteredAutos] = useState<Auto[]>([]);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

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

  useEffect(() => {
    const data = generateNepalAutos();
    setAutos(data);
    setFilteredAutos(data);
  }, []);

  const applyFilters = useCallback(() => {
    let result = autos;

    if (filters.selectedBrands.length > 0) {
      result = result.filter((auto) =>
        filters.selectedBrands.includes(auto.brand)
      );
    }

    if (filters.priceMin) {
      result = result.filter(
        (auto) => auto.price >= parseInt(filters.priceMin)
      );
    }

    if (filters.priceMax) {
      result = result.filter(
        (auto) => auto.price <= parseInt(filters.priceMax)
      );
    }

    if (filters.yearMin) {
      result = result.filter((auto) => auto.year >= parseInt(filters.yearMin));
    }

    if (filters.yearMax) {
      result = result.filter((auto) => auto.year <= parseInt(filters.yearMax));
    }

    if (filters.selectedConditions.length > 0) {
      result = result.filter((auto) =>
        filters.selectedConditions.includes(
          auto.condition.charAt(0).toUpperCase() + auto.condition.slice(1)
        )
      );
    }

    if (searchTerm) {
      result = result.filter(
        (auto) =>
          auto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auto.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAutos(result);
    setFilterOpen(false);
  }, [autos, filters, searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, applyFilters]);

  const handleSave = (id: string) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedItems(newSaved);
  };

  const handleImageClick = (auto: Auto) => {
    router.push(`/auto/listings/${auto.id}`);
  };

  const resetFilters = () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Car className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold">Auto Rickshaws in Nepal</h1>
              <p className="text-gray-600">Find the best auto for your needs</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search autos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-2"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onApply={applyFilters}
        onReset={resetFilters}
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4 text-gray-600">
          Showing {filteredAutos.length} results
        </div>

        {filteredAutos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAutos.map((auto) => (
              <AutoCard
                key={auto.id}
                auto={auto}
                onSave={handleSave}
                onImageClick={handleImageClick}
                savedItems={savedItems}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No autos found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(NepalAutoListings), {
  ssr: false,
});