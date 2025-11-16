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
interface Car {
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
  bodyType: string;
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

interface CarCardProps {
  car: Car;
  onSave: (id: string) => void;
  onImageClick: (car: Car) => void;
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
const carData = {
  "Maruti Suzuki": ["Alto", "Swift", "Dzire", "Baleno", "Ertiga", "Wagon R", "Celerio", "S-Cross"],
  "Hyundai": ["i10", "i20", "Verna", "Creta", "Venue", "Elantra", "Tucson", "Santro"],
  "Toyota": ["Vitz", "Corolla", "Camry", "Hiace", "Land Cruiser", "Hilux", "Prius", "RAV4"],
  "Honda": ["City", "Civic", "Accord", "CR-V", "HR-V", "Jazz", "BR-V", "Pilot"],
  "Tata": ["Nano", "Tiago", "Tigor", "Nexon", "Harrier", "Safari", "Punch", "Altroz"],
  "Mahindra": ["Scorpio", "XUV500", "Bolero", "KUV100", "Marazzo", "XUV300", "Thar", "Alturas"],
  "Kia": ["Picanto", "Rio", "Sportage", "Seltos", "Carnival", "Sonet", "Stinger", "Sorento"],
  "Nissan": ["Micra", "Sunny", "Terrano", "X-Trail", "Patrol", "Kicks", "Magnite", "GT-R"],
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

// Price options for cars (higher range than bikes)
const priceOptions = [
  { value: "0", label: "₨ 0" },
  { value: "500000", label: "₨ 5,00,000" },
  { value: "1000000", label: "₨ 10,00,000" },
  { value: "1500000", label: "₨ 15,00,000" },
  { value: "2000000", label: "₨ 20,00,000" },
  { value: "2500000", label: "₨ 25,00,000" },
  { value: "3000000", label: "₨ 30,00,000" },
  { value: "3500000", label: "₨ 35,00,000" },
  { value: "4000000", label: "₨ 40,00,000" },
  { value: "4500000", label: "₨ 45,00,000" },
  { value: "5000000", label: "₨ 50,00,000" },
  { value: "6000000", label: "₨ 60,00,000" },
  { value: "7000000", label: "₨ 70,00,000" },
  { value: "8000000", label: "₨ 80,00,000" },
  { value: "9000000", label: "₨ 90,00,000" },
  { value: "10000000", label: "₨ 1,00,00,000" },
  { value: "12000000", label: "₨ 1,20,00,000" },
  { value: "15000000", label: "₨ 1,50,00,000" },
    { value: "20000000", label: "₨ 2,00,00,000" },
    { value: "25000000", label: "₨ 2,50,00,000" },
    { value: "30000000", label: "₨ 3,00,00,000" },
    { value: "40000000", label: "₨ 4,00,00,000" },
    { value: "50000000", label: "₨ 5,00,00,000" },
];

// Year options: 2026 down to 2005
const yearOptions = Array.from({ length: 50 }, (_, i) => 2026 - i);

// Odometer options for cars
const odometerOptions = [
  { value: "0", label: "0 km" },
  { value: "10000", label: "10,000 km" },
  { value: "20000", label: "20,000 km" },
  { value: "30000", label: "30,000 km" },
  { value: "50000", label: "50,000 km" },
  { value: "75000", label: "75,000 km" },
  { value: "100000", label: "1,00,000 km" },
  { value: "125000", label: "1,25,000 km" },
  { value: "150000", label: "1,50,000 km" },
  { value: "200000", label: "2,00,000 km" },
  { value: "250000", label: "2,50,000 km" },
];

const conditionOptions = ["New", "Used"];

// ============ SAMPLE CAR DATA ============
const generateNepalCars = (): Car[] => [
  {
    id: "1",
    name: "Maruti Suzuki Alto",
    brand: "Maruti Suzuki",
    model: "Alto",
    year: 2022,
    price: 2850000,
    engine: "800cc",
    mileage: "22 km/l",
    location: "Kathmandu",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Maruti+Alto"],
    seller: { name: "Auto Nepal", rating: 4.5, responseTime: "< 1 hour", phone: "+977-9841234567" },
    postedDate: "2025-11-10",
    views: 156,
    description: "Well maintained Maruti Alto in excellent condition. Single owner.",
    kmDriven: "45,200 km",
    bodyType: "Hatchback",
    transmission: "Manual"
  },
  {
    id: "2",
    name: "Hyundai i20",
    brand: "Hyundai",
    model: "i20",
    year: 2023,
    price: 4250000,
    engine: "1200cc",
    mileage: "20 km/l",
    location: "Lalitpur",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Hyundai+i20"],
    seller: { name: "City Motors", rating: 4.7, responseTime: "< 2 hours", phone: "+977-9851234567" },
    postedDate: "2025-11-12",
    views: 89,
    description: "Hyundai i20 in pristine condition with all features.",
    kmDriven: "28,500 km",
    bodyType: "Hatchback",
    transmission: "Automatic"
  },
  {
    id: "3",
    name: "Toyota Vitz",
    brand: "Toyota",
    model: "Vitz",
    year: 2021,
    price: 3650000,
    engine: "1000cc",
    mileage: "25 km/l",
    location: "Pokhara",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Toyota+Vitz"],
    seller: { name: "Toyota Center", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9861234567" },
    postedDate: "2025-11-08",
    views: 203,
    description: "Toyota Vitz with excellent fuel efficiency and reliability.",
    kmDriven: "52,000 km",
    bodyType: "Hatchback",
    transmission: "CVT"
  },
  {
    id: "4",
    name: "Honda City",
    brand: "Honda",
    model: "City",
    year: 2024,
    price: 5850000,
    engine: "1500cc",
    mileage: "17 km/l",
    location: "Chitwan",
    fuelType: "Petrol",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Honda+City"],
    seller: { name: "Honda Showroom", rating: 4.9, responseTime: "< 30 min", phone: "+977-9871234567" },
    postedDate: "2025-11-14",
    views: 67,
    description: "Brand new Honda City with latest features and warranty.",
    bodyType: "Sedan",
    transmission: "CVT"
  },
  {
    id: "5",
    name: "Tata Nexon",
    brand: "Tata",
    model: "Nexon",
    year: 2023,
    price: 4950000,
    engine: "1200cc",
    mileage: "19 km/l",
    location: "Biratnagar",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Tata+Nexon"],
    seller: { name: "Tata Motors", rating: 4.3, responseTime: "< 3 hours", phone: "+977-9881234567" },
    postedDate: "2025-11-06",
    views: 124,
    description: "Tata Nexon compact SUV with modern features.",
    kmDriven: "31,800 km",
    bodyType: "SUV",
    transmission: "Manual"
  },
  {
    id: "6",
    name: "Mahindra Scorpio",
    brand: "Mahindra",
    model: "Scorpio",
    year: 2022,
    price: 7250000,
    engine: "2200cc",
    mileage: "15 km/l",
    location: "Butwal",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+Scorpio"],
    seller: { name: "Mahindra Dealer", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9891234567" },
    postedDate: "2025-11-05",
    views: 178,
    description: "Powerful Mahindra Scorpio SUV perfect for Nepal terrain.",
    kmDriven: "42,300 km",
    bodyType: "SUV",
    transmission: "Manual"
  },
  {
    id: "7",
    name: "Kia Seltos",
    brand: "Kia",
    model: "Seltos",
    year: 2024,
    price: 6750000,
    engine: "1400cc",
    mileage: "16 km/l",
    location: "Dhangadhi",
    fuelType: "Petrol",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Kia+Seltos"],
    seller: { name: "Kia Motors", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9801234567" },
    postedDate: "2025-11-13",
    views: 92,
    description: "Latest Kia Seltos with premium features and technology.",
    bodyType: "SUV",
    transmission: "Automatic"
  },
  {
    id: "8",
    name: "Nissan Kicks",
    brand: "Nissan",
    model: "Kicks",
    year: 2023,
    price: 5450000,
    engine: "1600cc",
    mileage: "18 km/l",
    location: "Nepalgunj",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Nissan+Kicks"],
    seller: { name: "Nissan Center", rating: 4.4, responseTime: "< 2 hours", phone: "+977-9811234567" },
    postedDate: "2025-11-09",
    views: 134,
    description: "Nissan Kicks crossover with stylish design and comfort.",
    kmDriven: "35,600 km",
    bodyType: "Crossover",
    transmission: "CVT"
  },
  {
    id: "9",
    name: "Maruti Suzuki Swift",
    brand: "Maruti Suzuki",
    model: "Swift",
    year: 2021,
    price: 3950000,
    engine: "1200cc",
    mileage: "23 km/l",
    location: "Janakpur",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Maruti+Swift"],
    seller: { name: "Swift Auto", rating: 4.5, responseTime: "< 1 hour", phone: "+977-9821234567" },
    postedDate: "2025-11-11",
    views: 187,
    description: "Maruti Swift hatchback with sporty design and efficiency.",
    kmDriven: "48,900 km",
    bodyType: "Hatchback",
    transmission: "Manual"
  },
  {
    id: "10",
    name: "Toyota Corolla",
    brand: "Toyota",
    model: "Corolla",
    year: 2024,
    price: 8250000,
    engine: "1800cc",
    mileage: "15 km/l",
    location: "Bhaktapur",
    fuelType: "Hybrid",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Toyota+Corolla"],
    seller: { name: "Toyota Premium", rating: 4.9, responseTime: "< 30 min", phone: "+977-9831234567" },
    postedDate: "2025-11-15",
    views: 45,
    description: "Brand new Toyota Corolla Hybrid with advanced safety features.",
    bodyType: "Sedan",
    transmission: "CVT"
  },
  {
    id: "11",
    name: "Hyundai Creta",
    brand: "Hyundai",
    model: "Creta",
    year: 2023,
    price: 7850000,
    engine: "1500cc",
    mileage: "17 km/l",
    location: "Kathmandu",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Hyundai+Creta"],
    seller: { name: "Hyundai Motors", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9841234568" },
    postedDate: "2025-11-07",
    views: 198,
    description: "Hyundai Creta SUV with premium interior and features.",
    kmDriven: "25,400 km",
    bodyType: "SUV",
    transmission: "Automatic"
  },
  {
    id: "12",
    name: "Honda Jazz",
    brand: "Honda",
    model: "Jazz",
    year: 2022,
    price: 4650000,
    engine: "1200cc",
    mileage: "19 km/l",
    location: "Lalitpur",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Honda+Jazz"],
    seller: { name: "Honda Authorized", rating: 4.6, responseTime: "< 2 hours", phone: "+977-9851234568" },
    postedDate: "2025-11-04",
    views: 156,
    description: "Honda Jazz with spacious interior and reliable performance.",
    kmDriven: "38,700 km",
    bodyType: "Hatchback",
    transmission: "CVT"
  },
  {
    id: "13",
    name: "Tata Harrier",
    brand: "Tata",
    model: "Harrier",
    year: 2024,
    price: 9450000,
    engine: "2000cc",
    mileage: "14 km/l",
    location: "Pokhara",
    fuelType: "Diesel",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Tata+Harrier"],
    seller: { name: "Tata Premium", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9861234568" },
    postedDate: "2025-11-12",
    views: 87,
    description: "Premium Tata Harrier SUV with luxury features.",
    bodyType: "SUV",
    transmission: "Automatic"
  },
  {
    id: "14",
    name: "Mahindra XUV300",
    brand: "Mahindra",
    model: "XUV300",
    year: 2023,
    price: 5950000,
    engine: "1500cc",
    mileage: "18 km/l",
    location: "Chitwan",
    fuelType: "Diesel",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Mahindra+XUV300"],
    seller: { name: "Mahindra Center", rating: 4.5, responseTime: "< 3 hours", phone: "+977-9871234568" },
    postedDate: "2025-11-03",
    views: 167,
    description: "Compact SUV Mahindra XUV300 with modern features.",
    kmDriven: "29,800 km",
    bodyType: "SUV",
    transmission: "Manual"
  },
  {
    id: "15",
    name: "Kia Sonet",
    brand: "Kia",
    model: "Sonet",
    year: 2024,
    price: 5250000,
    engine: "1000cc",
    mileage: "20 km/l",
    location: "Biratnagar",
    fuelType: "Petrol",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Kia+Sonet"],
    seller: { name: "Kia Showroom", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9881234568" },
    postedDate: "2025-11-14",
    views: 73,
    description: "Compact SUV Kia Sonet with turbo engine and features.",
    bodyType: "SUV",
    transmission: "Automatic"
  },
  {
    id: "16",
    name: "Nissan Magnite",
    brand: "Nissan",
    model: "Magnite",
    year: 2023,
    price: 4750000,
    engine: "1000cc",
    mileage: "21 km/l",
    location: "Butwal",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Nissan+Magnite"],
    seller: { name: "Nissan Motors", rating: 4.4, responseTime: "< 2 hours", phone: "+977-9891234568" },
    postedDate: "2025-11-06",
    views: 142,
    description: "Nissan Magnite compact SUV with tech features.",
    kmDriven: "32,100 km",
    bodyType: "SUV",
    transmission: "CVT"
  },
  {
    id: "17",
    name: "Maruti Suzuki Baleno",
    brand: "Maruti Suzuki",
    model: "Baleno",
    year: 2022,
    price: 4150000,
    engine: "1200cc",
    mileage: "22 km/l",
    location: "Dhangadhi",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Maruti+Baleno"],
    seller: { name: "Maruti Center", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9801234568" },
    postedDate: "2025-11-08",
    views: 189,
    description: "Premium hatchback Maruti Baleno with modern styling.",
    kmDriven: "41,600 km",
    bodyType: "Hatchback",
    transmission: "Manual"
  },
  {
    id: "18",
    name: "Toyota Prius",
    brand: "Toyota",
    model: "Prius",
    year: 2024,
    price: 12500000,
    engine: "1800cc",
    mileage: "26 km/l",
    location: "Nepalgunj",
    fuelType: "Hybrid",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Toyota+Prius"],
    seller: { name: "Toyota Hybrid", rating: 4.9, responseTime: "< 30 min", phone: "+977-9811234568" },
    postedDate: "2025-11-15",
    views: 34,
    description: "Eco-friendly Toyota Prius hybrid with cutting-edge technology.",
    bodyType: "Sedan",
    transmission: "CVT"
  },
  {
    id: "19",
    name: "Hyundai Venue",
    brand: "Hyundai",
    model: "Venue",
    year: 2023,
    price: 5650000,
    engine: "1000cc",
    mileage: "19 km/l",
    location: "Janakpur",
    fuelType: "Petrol",
    condition: "used",
    images: ["/api/placeholder/400/300?text=Hyundai+Venue"],
    seller: { name: "Hyundai Center", rating: 4.7, responseTime: "< 1 hour", phone: "+977-9821234568" },
    postedDate: "2025-11-10",
    views: 119,
    description: "Compact SUV Hyundai Venue with connected features.",
    kmDriven: "27,300 km",
    bodyType: "SUV",
    transmission: "Manual"
  },
  {
    id: "20",
    name: "Honda CR-V",
    brand: "Honda",
    model: "CR-V",
    year: 2024,
    price: 15750000,
    engine: "1500cc",
    mileage: "13 km/l",
    location: "Bhaktapur",
    fuelType: "Petrol",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Honda+CR-V"],
    seller: { name: "Honda Premium", rating: 4.8, responseTime: "< 1 hour", phone: "+977-9831234568" },
    postedDate: "2025-11-13",
    views: 56,
    description: "Premium SUV Honda CR-V with advanced safety and comfort.",
    bodyType: "SUV",
    transmission: "CVT"
  }
];

// ============ COMPONENTS ============
const CarCard: React.FC<CarCardProps> = ({ car, onSave, onImageClick, savedItems }) => {
  const isSaved = savedItems.has(car.id);
  
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
    
    return `₨${formatted.split('').reverse().join('')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onImageClick(car)}
        />
        
        {/* Heart Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(car.id);
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
            <span className="text-lg font-bold text-gray-900">{car.year}</span>
            <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-8 md:gap-12 mb-2">
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-xs text-gray-700 flex items-center gap-1">
                <Car className="w-5 h-5" />
                Body:
              </span>
              <span className="text-xs font-medium text-gray-900 ml-1">{car.bodyType}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-700 flex items-center gap-1">
                <Settings className="w-5 h-5" />
                Fuel:
              </span>
              <span className="text-xs font-medium text-gray-900 ml-1">{car.fuelType}</span>
            </div>
            
          </div>
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-xs text-gray-700 flex items-center gap-1">
                <Gauge className="w-5 h-5" />
                Odometer:
              </span>
              <span className="text-xs font-medium text-gray-900 ml-1">{car.kmDriven || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-700 flex items-center gap-1">
                <Cog className="w-5 h-5" />
                Transmission:
              </span>
              <span className="text-xs font-medium text-gray-900 ml-1">{car.transmission}</span>
            </div>
          </div>
        </div>

        {/* Location and Price */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {car.location}
          </div>
          <div className="text-xl font-bold" style={{ color: '#1e3a8a' }}>{formatPrice(car.price)}</div>
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
      : filters.selectedModels.filter(model => !carData[brand as keyof typeof carData]?.includes(model));

    onFiltersChange({
      ...filters,
      selectedBrands: newBrands,
      selectedModels: newModels
    });
    
    setOpenDropdown('');
  };

  const toggleModel = (model: string): void => {
    const newModels = filters.selectedModels.includes(model)
      ? filters.selectedModels.filter(m => m !== model)
      : [...filters.selectedModels, model];
    
    onFiltersChange({ ...filters, selectedModels: newModels });
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
    
    setOpenDropdown('');
  };

  const toggleDistrict = (district: string): void => {
    const newDistricts = filters.selectedDistricts.includes(district)
      ? filters.selectedDistricts.filter(d => d !== district)
      : [...filters.selectedDistricts, district];
    
    onFiltersChange({ ...filters, selectedDistricts: newDistricts });
    setOpenDropdown('');
  };

  const toggleCondition = (condition: string): void => {
    const newConditions = filters.selectedConditions.includes(condition)
      ? filters.selectedConditions.filter(c => c !== condition)
      : [...filters.selectedConditions, condition];
    
    onFiltersChange({ ...filters, selectedConditions: newConditions });
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
                {Object.keys(carData).map(brand => (
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

          {/* Model Selection */}
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
                    carData[brand as keyof typeof carData].map(model => (
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

          {/* District Selection */}
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
function NepalCarListings() {
  const router = useRouter();
  
  // State
  const [cars] = useState<Car[]>(generateNepalCars());
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
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
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...cars];

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter(car => filters.selectedBrands.includes(car.brand));
    }

    // Model filter
    if (filters.selectedModels.length > 0) {
      filtered = filtered.filter(car => filters.selectedModels.includes(car.model));
    }

    // Location filter
    if (filters.selectedProvinces.length > 0 || filters.selectedDistricts.length > 0) {
      filtered = filtered.filter(car => {
        const hasProvince = filters.selectedProvinces.length === 0 || 
          filters.selectedProvinces.some(province => car.location.includes(province));
        const hasDistrict = filters.selectedDistricts.length === 0 || 
          filters.selectedDistricts.some(district => car.location.includes(district));
        return hasProvince || hasDistrict;
      });
    }

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter(car => car.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(car => car.price <= parseInt(filters.priceMax));
    }

    // Year filter
    if (filters.yearMin) {
      filtered = filtered.filter(car => car.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      filtered = filtered.filter(car => car.year <= parseInt(filters.yearMax));
    }

    // Odometer filter
    if (filters.odometerMin || filters.odometerMax) {
      filtered = filtered.filter(car => {
        if (!car.kmDriven) return false;
        const kmValue = parseInt(car.kmDriven.replace(/[^0-9]/g, ''));
        
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
      filtered = filtered.filter(car => 
        filters.selectedConditions.some(condition => 
          condition.toLowerCase() === car.condition.toLowerCase()
        )
      );
    }

    setFilteredCars(filtered);
  }, [cars, filters, searchQuery]);

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

  const handleImageClick = (car: Car): void => {
    router.push(`/cars/${car.id}`);
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
              <h1 className="text-xl font-bold text-gray-900">Cars in Nepal</h1>
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
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredCars.length} cars found
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
              <h1 className="text-2xl font-bold text-gray-900">Cars in Nepal</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filteredCars.length} Results
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
                  placeholder="Search cars..."
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
        {/* Cars Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 mb-8">          {currentCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
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
        {filteredCars.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
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

export default dynamic(() => Promise.resolve(NepalCarListings), {
  ssr: false,
});