"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Cog,
  Gauge,
  Settings,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  ChevronDown,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Package,
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
  bikeType: string;
  make: string;
  province: string;
  district: string;
  priceMin: string;
  priceMax: string;
  odometerMin: string;
  odometerMax: string;
  engineSizeMin: string;
  engineSizeMax: string;
  condition: string;
}

// ============ NEPAL BIKE DATA ============
const generateNepalBikes = (): Bike[] => [
  {
    id: "1",
    name: "Yamaha R15 V4",
    brand: "Yamaha",
    model: "R15",
    year: 2024,
    price: 619000,
    cc: "155cc",
    mileage: "40-45 km/l",
    location: "Kathmandu, Bagmati",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/400/300?text=Yamaha+R15+Front",
      "/api/placeholder/400/300?text=Yamaha+R15+Side", 
      "/api/placeholder/400/300?text=Yamaha+R15+Back"
    ],
    seller: {
      name: "Rajesh Maharjan",
      rating: 4.8,
      responseTime: "< 2 hours",
      phone: "+977-9841234567"
    },
    postedDate: "2024-11-10",
    views: 247,
    description: "Well maintained Yamaha R15 V4 in excellent condition. Single owner, all papers clear.",
    kmDriven: "8,500 km",
    engineType: "4-stroke, Liquid cooled"
  },
  {
    id: "2",
    name: "KTM Duke 200",
    brand: "KTM", 
    model: "Duke 200",
    year: 2023,
    price: 569000,
    cc: "199cc",
    mileage: "35-40 km/l",
    location: "Pokhara, Gandaki",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/400/300?text=KTM+Duke+200+Orange",
      "/api/placeholder/400/300?text=KTM+Duke+200+Profile",
      "/api/placeholder/400/300?text=KTM+Duke+200+Engine"
    ],
    seller: {
      name: "Bikram Thapa",
      rating: 4.5,
      responseTime: "< 1 hour",
      phone: "+977-9851234567"
    },
    postedDate: "2024-11-12", 
    views: 189,
    description: "KTM Duke 200 in orange color. Great bike for city riding and highway cruising.",
    kmDriven: "12,300 km",
    engineType: "Single cylinder, Liquid cooled"
  },
  {
    id: "3",
    name: "Honda Shine SP 125",
    brand: "Honda",
    model: "Shine SP",
    year: 2024,
    price: 267900,
    cc: "124cc",
    mileage: "55-60 km/l",
    location: "Lalitpur, Bagmati",
    fuelType: "Petrol",
    condition: "new",
    images: [
      "/api/placeholder/400/300?text=Honda+Shine+SP+Red",
      "/api/placeholder/400/300?text=Honda+Shine+SP+Side",
      "/api/placeholder/400/300?text=Honda+Shine+SP+Meter"
    ],
    seller: {
      name: "Honda Showroom",
      rating: 4.9,
      responseTime: "< 30 min",
      phone: "+977-9861234567"
    },
    postedDate: "2024-11-15",
    views: 156,
    description: "Brand new Honda Shine SP 125 available at showroom. Best fuel efficiency in commuter segment.",
    engineType: "4-stroke, Air cooled"
  },
  {
    id: "4",
    name: "Bajaj Pulsar NS200",
    brand: "Bajaj",
    model: "Pulsar NS200", 
    year: 2023,
    price: 425000,
    cc: "199cc",
    mileage: "40-45 km/l",
    location: "Chitwan, Bagmati",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/400/300?text=Bajaj+Pulsar+NS200+Blue",
      "/api/placeholder/400/300?text=Bajaj+Pulsar+NS200+Action",
      "/api/placeholder/400/300?text=Bajaj+Pulsar+NS200+Detail"
    ],
    seller: {
      name: "Suresh Tamang",
      rating: 4.3,
      responseTime: "< 3 hours", 
      phone: "+977-9871234567"
    },
    postedDate: "2024-11-08",
    views: 298,
    description: "Bajaj Pulsar NS200 in blue color. Perfect for long rides and daily commuting.",
    kmDriven: "15,800 km",
    engineType: "4-stroke, Liquid cooled"
  },
  {
    id: "5",
    name: "TVS Apache RTR 160",
    brand: "TVS",
    model: "Apache RTR 160",
    year: 2024,
    price: 315000,
    cc: "159cc", 
    mileage: "45-50 km/l",
    location: "Butwal, Lumbini",
    fuelType: "Petrol",
    condition: "new",
    images: [
      "/api/placeholder/400/300?text=TVS+Apache+RTR+160+Black",
      "/api/placeholder/400/300?text=TVS+Apache+RTR+160+Racing",
      "/api/placeholder/400/300?text=TVS+Apache+RTR+160+Tank"
    ],
    seller: {
      name: "TVS Showroom Butwal",
      rating: 4.7,
      responseTime: "< 1 hour",
      phone: "+977-9881234567"
    },
    postedDate: "2024-11-14",
    views: 134,
    description: "New TVS Apache RTR 160 with racing graphics. Sporty design with great performance.",
    engineType: "4-stroke, Air cooled"
  },
  {
    id: "6",
    name: "Royal Enfield Hunter 350",
    brand: "Royal Enfield",
    model: "Hunter 350",
    year: 2023,
    price: 459000,
    cc: "349cc",
    mileage: "35-40 km/l",
    location: "Biratnagar, Province 1",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/400/300?text=Royal+Enfield+Hunter+Green",
      "/api/placeholder/400/300?text=Royal+Enfield+Hunter+Classic",
      "/api/placeholder/400/300?text=Royal+Enfield+Hunter+Engine"
    ],
    seller: {
      name: "Kiran Rai",
      rating: 4.6,
      responseTime: "< 2 hours",
      phone: "+977-9891234567"
    },
    postedDate: "2024-11-09",
    views: 267,
    description: "Royal Enfield Hunter 350 in excellent condition. Perfect for touring and city rides.",
    kmDriven: "7,200 km",
    engineType: "Single cylinder, Air-oil cooled"
  }
];

// ============ COMPONENTS ============
const BikeCard: React.FC<{
  bike: Bike;
  viewMode: "grid" | "list";
  onSave: (id: string) => void;
  onImageClick: (bike: Bike) => void;
  savedItems: Set<string>;
}> = ({ bike, viewMode, onSave, onImageClick, savedItems }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isSaved = savedItems.has(bike.id);
  
  const formatPrice = (price: number) => {
    // Nepal number format: 3,2,2,2 digits from right
    const priceStr = price.toString();
    const reversedStr = priceStr.split('').reverse().join('');
    
    let formatted = '';
    for (let i = 0; i < reversedStr.length; i++) {
      if (i > 0 && (i === 3 || (i > 3 && (i - 3) % 2 === 0))) {
        formatted += ',';
      }
      formatted += reversedStr[i];
    }
    
    const finalFormatted = formatted.split('').reverse().join('');
    
    if (price >= 1000000) {
      return `₨ ${(price / 100000).toFixed(1)}L`;
    }
    return `₨ ${finalFormatted}`;
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === bike.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? bike.images.length - 1 : prev - 1
    );
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full md:w-80 h-56 flex-shrink-0">
            <img
              src={bike.images[currentImageIndex]}
              alt={bike.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onImageClick(bike)}
              onLoad={() => setIsImageLoading(false)}
            />
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            
            {/* Image Navigation */}
            {bike.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Photo Count */}
            <div className="absolute top-3 left-3">
              <span className="bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                {bike.images.length} Photos
              </span>
            </div>

            {/* Heart Button */}
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(bike.id);
                }}
                className={`p-2 rounded-full ${
                  isSaved
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 md:p-6">
            {/* Year, Name and Price on same line */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-bold text-gray-900">{bike.year}</span>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">{bike.name}</h3>
              </div>
            </div>

            {/* Two Column Specs - Two items per row with proper spacing */}
            <div className="grid grid-cols-2 gap-8 mb-4">
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <bike className="w-3 h-3" />
                    Type:
                  </span>
                  <span className="text-sm font-medium text-gray-900 ml-1">Bike</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Cog className="w-3 h-3" />
                    Transmission:
                  </span>
                  <span className="text-sm font-medium text-gray-900 ml-1">Manual</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    Odometer:
                  </span>
                  <span className="text-sm font-medium text-gray-900 ml-1">{bike.kmDriven || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    Engine:
                  </span>
                  <span className="text-sm font-medium text-gray-900 ml-1">{bike.cc}</span>
                </div>
              </div>
            </div>

            {/* Location and Price on same line */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {bike.location}
              </div>
              <div className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>{formatPrice(bike.price)}</div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Grid View (Mobile First)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={bike.images[currentImageIndex]}
          alt={bike.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onImageClick(bike)}
          onLoad={() => setIsImageLoading(false)}
        />
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Image Navigation */}
        {bike.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Photo Count */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
            {bike.images.length} Photos
          </span>
        </div>

        {/* Heart Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(bike.id);
            }}
            className={`p-2 rounded-full ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Year, Name on same line */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{bike.year}</span>
            <h3 className="text-lg font-bold text-gray-900">{bike.name}</h3>
          </div>
        </div>

        {/* Two Column Specs - Left & Right alignment */}
<div className="flex justify-between mb-3">
  {/* Left Column */}
  <div className="space-y-1 text-left">
    <div className="flex items-center">
      <span className="text-xs text-gray-700 flex items-center gap-1">
        <Package className="w-3 h-3" />
        Type:
      </span>
      <span className="text-sm font-medium text-gray-900 ml-1">Bike</span>
    </div>
    <div className="flex items-center">
      <span className="text-xs text-gray-700 flex items-center gap-1">
        <Cog className="w-3 h-3" />
        Transmission:
      </span>
      <span className="text-sm font-medium text-gray-900 ml-1">Manual</span>
    </div>
  </div>

  {/* Right Column */}
  <div className="space-y-1 text-right">
    <div className="flex items-center justify-end">
      <span className="text-xs text-gray-700 flex items-center gap-1">
        <Gauge className="w-3 h-3" />
        Odometer:
      </span>
      <span className="text-sm font-medium text-gray-900 ml-1">{bike.kmDriven || 'N/A'}</span>
    </div>
    <div className="flex items-center justify-end">
      <span className="text-xs text-gray-700 flex items-center gap-1">
        <Settings className="w-3 h-3" />
        Engine:
      </span>
      <span className="text-sm font-medium text-gray-900 ml-1">{bike.cc}</span>
    </div>
  </div>
</div>


        {/* Location and Price on same line */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {bike.location}
          </div>
          <div className="text-xl font-bold" style={{ color: '#1e3a8a' }}>{formatPrice(bike.price)}</div>
        </div>
      </div>
    </div>
  );
};

const FilterPanel: React.FC<{
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ filters, onFiltersChange, onApply, onReset, isOpen, onClose }) => {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
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

        {/* --- Nepal Advanced Filters --- */}
<div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
  {/* Bike Type */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">Bike Type</label>
    <select
      value={filters.bikeType}
      onChange={(e) => updateFilter('bikeType', e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="">All Types</option>
      <option value="Bike">Bike</option>
      <option value="Scooter">Scooter</option>
      <option value="Electric">Electric</option>
    </select>
  </div>

  {/* Make / Brand */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">Make / Brand</label>
    <select
      value={filters.make}
      onChange={(e) => updateFilter('make', e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="">All Brands</option>
      <option value="Yamaha">Yamaha</option>
      <option value="Honda">Honda</option>
      <option value="KTM">KTM</option>
      <option value="Bajaj">Bajaj</option>
      <option value="TVS">TVS</option>
      <option value="Royal Enfield">Royal Enfield</option>
      <option value="Hero">Hero</option>
      <option value="Suzuki">Suzuki</option>
    </select>
  </div>

  {/* Province and District */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
  <div className="space-y-3">
    {/* Province Dropdown */}
    <select
      value={filters.province}
      onChange={(e) => {
        updateFilter("province", e.target.value);
        updateFilter("district", ""); // reset district when province changes
      }}
      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="">All Provinces</option>
      <option value="Province 1">Province 1</option>
      <option value="Madhesh Province">Madhesh Province</option>
      <option value="Bagmati Province">Bagmati Province</option>
      <option value="Gandaki Province">Gandaki Province</option>
      <option value="Lumbini Province">Lumbini Province</option>
      <option value="Karnali Province">Karnali Province</option>
      <option value="Sudurpashchim Province">Sudurpashchim Province</option>
    </select>

    {/* District Dropdown (dynamic) */}
    {filters.province && (
      <select
        value={filters.district}
        onChange={(e) => updateFilter("district", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select District</option>
        {(() => {
          switch (filters.province) {
            case "Province 1":
              return [
                "Biratnagar",
                "Dharan",
                "Ilam",
                "Jhapa",
                "Sunsari",
                "Morang",
                "Okhaldhunga",
                "Solukhumbu",
              ].map((district) => (
                <option key={district} value={district}>{district}</option>
              ));
            case "Madhesh Province":
              return [
                "Janakpur",
                "Birgunj",
                "Sarlahi",
                "Mahottari",
                "Parsa",
                "Siraha",
                "Dhanusha",
              ].map((district) => (
                <option key={district} value={district}>{district}</option>
              ));
            case "Bagmati Province":
              return [
                "Kathmandu",
                "Lalitpur",
                "Bhaktapur",
                "Chitwan",
                "Makwanpur",
                "Nuwakot",
                "Kavrepalanchok",
              ].map((district) => (
                <option key={district} value={district}>{district}</option>
              ));
            case "Gandaki Province":
              return [
                "Pokhara",
                "Kaski",
                "Lamjung",
                "Gorkha",
                "Tanahun",
                "Syangja",
                "Parbat",
              ].map((district) => (
                <option key={district} value={district}>{district}</option>
              ));
            case "Lumbini Province":
              return [
                "Butwal",
                "Rupandehi",
                "Dang",
                "Banke",
                "Kapilvastu",
                "Palpa",
              ].map((district) => (
                <option key={district} value={district}>{district}</option>
              ));
            case "Karnali Province":
              return [
                "Surkhet",
                "Dailekh",
                "Jumla",
                "Kalikot",
                "Mugu",
              ].map((district) => (
                <option key={district} value={district}>{district}</option>
              ));
            case "Sudurpashchim Province":
              return [
                "Dhangadhi",
                "Kanchanpur",
                "Baitadi",
                "Dadeldhura",
                "Achham",
              ].map((district) => (
                <option key={district} value={district}>{district}</option>
              ));
            default:
              return null;
          }
        })()}
      </select>
    )}
  </div>
</div>


  {/* Price Range */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (₨)</label>
    <div className="grid grid-cols-2 gap-3">
      <input
        type="number"
        placeholder="Min Price"
        value={filters.priceMin}
        onChange={(e) => updateFilter('priceMin', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Max Price"
        value={filters.priceMax}
        onChange={(e) => updateFilter('priceMax', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>

  {/* Engine CC Range */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">Engine Size (CC)</label>
    <div className="grid grid-cols-2 gap-3">
      <input
        type="number"
        placeholder="Min CC"
        value={filters.engineSizeMin}
        onChange={(e) => updateFilter('engineSizeMin', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Max CC"
        value={filters.engineSizeMax}
        onChange={(e) => updateFilter('engineSizeMax', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>

  {/* Odometer */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">Odometer (KM)</label>
    <div className="grid grid-cols-2 gap-3">
      <input
        type="number"
        placeholder="Min KM"
        value={filters.odometerMin}
        onChange={(e) => updateFilter('odometerMin', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Max KM"
        value={filters.odometerMax}
        onChange={(e) => updateFilter('odometerMax', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>

  {/* Condition */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">Condition</label>
    <div className="space-y-2">
      {["All", "New", "Used"].map((condition) => (
        <label
          key={condition}
          className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="radio"
            name="condition"
            value={condition === "All" ? "" : condition.toLowerCase()}
            checked={filters.condition === (condition === "All" ? "" : condition.toLowerCase())}
            onChange={(e) => updateFilter("condition", e.target.value)}
            className="text-blue-600"
          />
          <span>{condition}</span>
        </label>
      ))}
    </div>
  </div>
</div>


        {/* Actions */}
        <div className="p-4 md:p-6 border-t space-y-3">
          <button
            onClick={onApply}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={onReset}
            className="w-full py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
function NepalBikeListings() {
  const router = useRouter();
  
  // State
  const [bikes] = useState<Bike[]>(generateNepalBikes());
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>(bikes);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filters, setFilters] = useState<FilterState>({
  bikeType: "",
  make: "",
  province: "",
  district: "",
  priceMin: "",
  priceMax: "",
  odometerMin: "",
  odometerMax: "",
  engineSizeMin: "",
  engineSizeMax: "",
  condition: "",
});

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

    // Price range
    if (filters.priceMin) {
      filtered = filtered.filter(b => b.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(b => b.price <= parseInt(filters.priceMax));
    }

    // Other filters
    if (filters.brand) {
      filtered = filtered.filter(b => b.brand === filters.brand);
    }
    if (filters.location) {
      filtered = filtered.filter(b => b.location === filters.location);
    }
    if (filters.condition) {
      filtered = filtered.filter(b => b.condition === filters.condition);
    }
    if (filters.yearMin) {
      filtered = filtered.filter(b => b.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      filtered = filtered.filter(b => b.year <= parseInt(filters.yearMax));
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "year-new":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    setFilteredBikes(filtered);
  }, [bikes, filters, sortBy, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handlers
  const handleSave = (id: string) => {
    const newSavedItems = new Set(savedItems);
    if (newSavedItems.has(id)) {
      newSavedItems.delete(id);
    } else {
      newSavedItems.add(id);
    }
    setSavedItems(newSavedItems);
  };

  const handleImageClick = (bike: Bike) => {
    // Navigate to bike detail page
    router.push(`/bikes/${bike.id}`);
  };

  const resetFilters = () => {
    setFilters({
      priceMin: "",
      priceMax: "",
      brand: "",
      ccMin: "",
      ccMax: "",
      yearMin: "",
      yearMax: "",
      condition: "",
      location: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Spacer */}
      <div className="h-0   md:h-0"></div>
      
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-gray-900">Bikes in Nepal</h1>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
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
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Bikes in Nepal</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filteredBikes.length} Results
              </span>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredBikes.map((bike) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              viewMode={viewMode}
              onSave={handleSave}
              onImageClick={handleImageClick}
              savedItems={savedItems}
            />
          ))}
        </div>

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