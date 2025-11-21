"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Star,
  Eye,
  Shield,
  CheckCircle2,
} from "lucide-react";

// ======================
// CAR INTERFACE
// ======================
interface Car {
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

// ======================
// ALL YOUR CARS DATA (20 CARS TO MATCH BIKES)
// ======================
const ALL_CARS: Car[] = [
  {
    id: "1",
    name: "Toyota Corolla",
    brand: "Toyota",
    model: "Corolla",
    year: 2018,
    price: 1081504,
    cc: "1800cc",
    mileage: "15 km/l",
    location: "Biratnagar, Province 1",
    fuelType: "Petrol",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Toyota+Corolla+Front",
      "/api/placeholder/800/600?text=Toyota+Corolla+Side",
      "/api/placeholder/800/600?text=Toyota+Corolla+Back",
      "/api/placeholder/800/600?text=Toyota+Corolla+Interior",
      "/api/placeholder/800/600?text=Toyota+Corolla+Engine",
    ],
    seller: {
      name: "Toyota Motors Janakpur",
      rating: 4.7,
      responseTime: "< 2 hours",
      phone: "+977-9899671425",
    },
    postedDate: "2025-09-30",
    views: 179,
    description: "Well maintained Toyota Corolla in excellent condition. Smooth engine and great performance. This car has been regularly serviced and is ready for a new owner.",
    kmDriven: "16,340 km",
    engineType: "4-cylinder, Liquid cooled",
  },
  {
    id: "2",
    name: "Honda Civic",
    brand: "Honda",
    model: "Civic",
    year: 2025,
    price: 536803,
    cc: "1500cc",
    mileage: "16-18 km/l",
    location: "Pokhara, Gandaki",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Honda+Civic+Front",
      "/api/placeholder/800/600?text=Honda+Civic+Side",
      "/api/placeholder/800/600?text=Honda+Civic+Back",
    ],
    seller: {
      name: "Honda Dealer Nepal",
      rating: 4.4,
      responseTime: "< 3 hours",
      phone: "+977-9821044394",
    },
    postedDate: "2025-06-20",
    views: 222,
    description: "Well maintained Honda Civic in excellent condition.",
    kmDriven: "29,385 km",
    engineType: "4-cylinder, Air cooled",
  },
  {
    id: "3",
    name: "Hyundai Elantra",
    brand: "Hyundai",
    model: "Elantra",
    year: 2023,
    price: 1171780,
    cc: "2000cc",
    mileage: "14-17 km/l",
    location: "Nepalgunj, Lumbini",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Hyundai+Elantra",
    ],
    seller: {
      name: "Hyundai Showroom",
      rating: 4.5,
      responseTime: "< 1 hours",
      phone: "+977-9878252098",
    },
    postedDate: "2025-01-24",
    views: 503,
    description: "Well maintained Hyundai Elantra in excellent condition. Smooth engine and great performance.",
    kmDriven: "16,348 km",
    engineType: "4-cylinder, Oil cooled",
  },
  {
    id: "4",
    name: "Nissan Altima",
    brand: "Nissan",
    model: "Altima",
    year: 2019,
    price: 834377,
    cc: "2500cc",
    mileage: "12-15 km/l",
    location: "Chitwan, Bagmati",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Nissan+Altima",
    ],
    seller: {
      name: "Nissan Showroom",
      rating: 4.1,
      responseTime: "< 3 hours",
      phone: "+977-9886604200",
    },
    postedDate: "2025-10-28",
    views: 195,
    description: "Well maintained Nissan Altima in excellent condition. Smooth engine and great performance.",
    kmDriven: "10,178 km",
    engineType: "V6, Oil cooled",
  },
  {
    id: "5",
    name: "Kia Optima",
    brand: "Kia",
    model: "Optima",
    year: 2023,
    price: 364558,
    cc: "1600cc",
    mileage: "16-19 km/l",
    location: "Chitwan, Bagmati",
    fuelType: "Hybrid",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Kia+Optima",
    ],
    seller: {
      name: "Kia Motors Nepal",
      rating: 4.7,
      responseTime: "< 1 hours",
      phone: "+977-9859648771",
    },
    postedDate: "2025-06-09",
    views: 336,
    description: "Well maintained Kia Optima in excellent condition. Smooth engine and great performance.",
    kmDriven: "10,622 km",
    engineType: "4-cylinder, Turbo",
  },
  {
    id: "6",
    name: "Honda Accord",
    brand: "Honda",
    model: "Accord",
    year: 2020,
    price: 193951,
    cc: "2400cc",
    mileage: "13-16 km/l",
    location: "Pokhara, Gandaki",
    fuelType: "Hybrid",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Honda+Accord",
    ],
    seller: {
      name: "Honda Dealer Nepal",
      rating: 4.5,
      responseTime: "< 1 hours",
      phone: "+977-9859719204",
    },
    postedDate: "2025-01-18",
    views: 311,
    description: "Well maintained Honda Accord in excellent condition. Smooth engine and great performance.",
    kmDriven: "9,613 km",
    engineType: "4-cylinder, Hybrid",
  },
  {
    id: "7",
    name: "Toyota Camry",
    brand: "Toyota",
    model: "Camry",
    year: 2020,
    price: 556533,
    cc: "2500cc",
    mileage: "12-15 km/l",
    location: "Bhaktapur, Bagmati",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Toyota+Camry",
    ],
    seller: {
      name: "Toyota Motors Nepal",
      rating: 4.7,
      responseTime: "< 3 hours",
      phone: "+977-9854726730",
    },
    postedDate: "2025-03-17",
    views: 522,
    description: "Well maintained Toyota Camry in excellent condition. Smooth engine and great performance.",
    kmDriven: "14,337 km",
    engineType: "V6, Liquid cooled",
  },
  {
    id: "8",
    name: "Nissan Sentra",
    brand: "Nissan",
    model: "Sentra",
    year: 2022,
    price: 139481,
    cc: "1600cc",
    mileage: "15-18 km/l",
    location: "Bhaktapur, Bagmati",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Nissan+Sentra",
    ],
    seller: {
      name: "Nissan Dealer Nepal",
      rating: 4.9,
      responseTime: "< 3 hours",
      phone: "+977-9890910649",
    },
    postedDate: "2025-08-24",
    views: 462,
    description: "Well maintained Nissan Sentra in excellent condition. Smooth engine and great performance.",
    kmDriven: "6,626 km",
    engineType: "4-cylinder, Oil cooled",
  },
  {
    id: "9",
    name: "Kia Forte",
    brand: "Kia",
    model: "Forte",
    year: 2022,
    price: 849646,
    cc: "2000cc",
    mileage: "14-17 km/l",
    location: "Bhaktapur, Bagmati",
    fuelType: "Petrol",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Kia+Forte",
    ],
    seller: {
      name: "Kia Motors Nepal",
      rating: 4.3,
      responseTime: "< 3 hours",
      phone: "+977-9874043906",
    },
    postedDate: "2025-02-14",
    views: 331,
    description: "Well maintained Kia Forte in excellent condition. Smooth engine and great performance.",
    kmDriven: "9,492 km",
    engineType: "4-cylinder, Turbo",
  },
  {
    id: "10",
    name: "Hyundai Sonata",
    brand: "Hyundai",
    model: "Sonata",
    year: 2020,
    price: 708030,
    cc: "2400cc",
    mileage: "13-16 km/l",
    location: "Dhangadhi, Sudurpashchim",
    fuelType: "Hybrid",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Hyundai+Sonata",
    ],
    seller: {
      name: "Hyundai Showroom",
      rating: 4.1,
      responseTime: "< 2 hours",
      phone: "+977-9825055270",
    },
    postedDate: "2025-04-21",
    views: 322,
    description: "Well maintained Hyundai Sonata in excellent condition. Smooth engine and great performance.",
    kmDriven: "16,093 km",
    engineType: "4-cylinder, Hybrid",
  },
  // Additional cars 11-20 to match bike count
  {
    id: "11",
    name: "Toyota Prius",
    brand: "Toyota",
    model: "Prius",
    year: 2018,
    price: 251780,
    cc: "1800cc",
    mileage: "20-25 km/l",
    location: "Lalitpur, Bagmati",
    fuelType: "Hybrid",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Toyota+Prius",
    ],
    seller: {
      name: "Toyota Motors Nepal",
      rating: 4.8,
      responseTime: "< 3 hours",
      phone: "+977-9851850798",
    },
    postedDate: "2025-09-12",
    views: 188,
    description: "Well maintained Toyota Prius in excellent condition. Smooth engine and great performance.",
    kmDriven: "20,061 km",
    engineType: "Hybrid, Electric",
  },
  {
    id: "12",
    name: "Nissan Rogue",
    brand: "Nissan",
    model: "Rogue",
    year: 2024,
    price: 550468,
    cc: "2500cc",
    mileage: "12-15 km/l",
    location: "Bhaktapur, Bagmati",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Nissan+Rogue",
    ],
    seller: {
      name: "Nissan Dealer Nepal",
      rating: 4.9,
      responseTime: "< 1 hours",
      phone: "+977-9828723867",
    },
    postedDate: "2025-05-13",
    views: 130,
    description: "Well maintained Nissan Rogue in excellent condition. Smooth engine and great performance.",
    kmDriven: "16,586 km",
    engineType: "4-cylinder, Turbo",
  },
  {
    id: "13",
    name: "Honda CR-V",
    brand: "Honda",
    model: "CR-V",
    year: 2025,
    price: 1063555,
    cc: "2400cc",
    mileage: "11-14 km/l",
    location: "Butwal, Lumbini",
    fuelType: "Petrol",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Honda+CR-V",
    ],
    seller: {
      name: "Honda Dealer Nepal",
      rating: 4.8,
      responseTime: "< 2 hours",
      phone: "+977-9862544559",
    },
    postedDate: "2025-08-18",
    views: 587,
    description: "Well maintained Honda CR-V in excellent condition. Smooth engine and great performance.",
    kmDriven: "3,188 km",
    engineType: "4-cylinder, Turbo",
  },
  {
    id: "14",
    name: "Hyundai Tucson",
    brand: "Hyundai",
    model: "Tucson",
    year: 2024,
    price: 624271,
    cc: "2000cc",
    mileage: "13-16 km/l",
    location: "Biratnagar, Province 1",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Hyundai+Tucson",
    ],
    seller: {
      name: "Hyundai Showroom",
      rating: 4.7,
      responseTime: "< 3 hours",
      phone: "+977-9828388439",
    },
    postedDate: "2025-09-30",
    views: 249,
    description: "Well maintained Hyundai Tucson in excellent condition. Smooth engine and great performance.",
    kmDriven: "26,808 km",
    engineType: "4-cylinder, Turbo",
  },
  {
    id: "15",
    name: "Kia Sportage",
    brand: "Kia",
    model: "Sportage",
    year: 2018,
    price: 791701,
    cc: "2400cc",
    mileage: "11-14 km/l",
    location: "Chitwan, Bagmati",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Kia+Sportage",
    ],
    seller: {
      name: "Kia Motors Nepal",
      rating: 4.8,
      responseTime: "< 2 hours",
      phone: "+977-9830141583",
    },
    postedDate: "2025-06-29",
    views: 532,
    description: "Well maintained Kia Sportage in excellent condition. Smooth engine and great performance.",
    kmDriven: "21,141 km",
    engineType: "4-cylinder, Turbo",
  },
  {
    id: "16",
    name: "Tata Nexon",
    brand: "Tata Motors",
    model: "Nexon",
    year: 2023,
    price: 894167,
    cc: "1200cc",
    mileage: "17-20 km/l",
    location: "Biratnagar, Province 1",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Tata+Nexon",
    ],
    seller: {
      name: "Tata Motors Nepal",
      rating: 4.9,
      responseTime: "< 2 hours",
      phone: "+977-9876645041",
    },
    postedDate: "2025-03-05",
    views: 194,
    description: "Well maintained Tata Nexon in excellent condition. Smooth engine and great performance.",
    kmDriven: "14,926 km",
    engineType: "Turbo, Oil cooled",
  },
  {
    id: "17",
    name: "Mahindra Scorpio",
    brand: "Mahindra",
    model: "Scorpio",
    year: 2023,
    price: 1077461,
    cc: "2200cc",
    mileage: "12-15 km/l",
    location: "Dhangadhi, Sudurpashchim",
    fuelType: "Diesel",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Mahindra+Scorpio",
    ],
    seller: {
      name: "Mahindra Dealer Nepal",
      rating: 4.1,
      responseTime: "< 3 hours",
      phone: "+977-9891824124",
    },
    postedDate: "2025-04-04",
    views: 73,
    description: "Well maintained Mahindra Scorpio in excellent condition. Smooth engine and great performance.",
    kmDriven: "4,198 km",
    engineType: "Turbo Diesel",
  },
  {
    id: "18",
    name: "Maruti Swift",
    brand: "Maruti",
    model: "Swift",
    year: 2024,
    price: 695668,
    cc: "1200cc",
    mileage: "22-25 km/l",
    location: "Biratnagar, Province 1",
    fuelType: "Petrol",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Maruti+Swift",
    ],
    seller: {
      name: "Maruti Dealer Nepal",
      rating: 4.7,
      responseTime: "< 1 hours",
      phone: "+977-9849537927",
    },
    postedDate: "2025-05-23",
    views: 97,
    description: "Well maintained Maruti Swift in excellent condition. Smooth engine and great performance.",
    kmDriven: "29,675 km",
    engineType: "4-cylinder, Oil cooled",
  },
  {
    id: "19",
    name: "Toyota RAV4",
    brand: "Toyota",
    model: "RAV4",
    year: 2019,
    price: 785133,
    cc: "2500cc",
    mileage: "11-14 km/l",
    location: "Nepalgunj, Lumbini",
    fuelType: "Petrol",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Toyota+RAV4",
    ],
    seller: {
      name: "Toyota Motors Nepal",
      rating: 4.6,
      responseTime: "< 1 hours",
      phone: "+977-9893086264",
    },
    postedDate: "2025-07-15",
    views: 424,
    description: "Well maintained Toyota RAV4 in excellent condition. Smooth engine and great performance.",
    kmDriven: "1,700 km",
    engineType: "4-cylinder, AWD",
  },
  {
    id: "20",
    name: "Honda Pilot",
    brand: "Honda",
    model: "Pilot",
    year: 2023,
    price: 795283,
    cc: "3500cc",
    mileage: "9-12 km/l",
    location: "Chitwan, Bagmati",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Honda+Pilot",
    ],
    seller: {
      name: "Honda Dealer Nepal",
      rating: 4.3,
      responseTime: "< 2 hours",
      phone: "+977-9822887977",
    },
    postedDate: "2025-03-24",
    views: 293,
    description: "Well maintained Honda Pilot in excellent condition. Smooth engine and great performance.",
    kmDriven: "29,875 km",
    engineType: "V6, AWD",
  },
];

export default function CarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showSellerDetails, setShowSellerDetails] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const foundCar = ALL_CARS.find((c) => c.id === params.id);
      setCar(foundCar || null);
    }
  }, [params]);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900 mb-2">Car not found</div>
          <button
            onClick={() => router.push("/cars/listings")}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    const priceStr = price.toString();
    const reversedStr = priceStr.split("").reverse().join("");

    let formatted = "";
    for (let i = 0; i < reversedStr.length; i++) {
      if (i > 0 && (i === 3 || (i > 3 && (i - 3) % 2 === 0))) {
        formatted += ",";
      }
      formatted += reversedStr[i];
    }

    return `₨ ${formatted.split("").reverse().join("")}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-xl border ${
                  isSaved
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </button>

              <button className="p-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - IMAGES & DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            {/* IMAGE GALLERY */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-100">
                <img
                  src={car.images[currentImageIndex]}
                  alt={car.name}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setIsImageModalOpen(true)}
                />

                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-lg">
                  {currentImageIndex + 1} / {car.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {car.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        idx === currentImageIndex ? "border-blue-600" : "border-gray-200"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TITLE & PRICE */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {car.year} {car.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {car.location}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {car.views} views
                </div>
              </div>

              <div className="text-4xl font-bold text-blue-600 mb-6">
                {formatPrice(car.price)}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Year</div>
                    <div className="font-semibold text-gray-900">{car.year}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Odometer</div>
                    <div className="font-semibold text-gray-900">{car.kmDriven}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Engine</div>
                    <div className="font-semibold text-gray-900">{car.cc}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Fuel className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Fuel</div>
                    <div className="font-semibold text-gray-900">{car.fuelType}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            {/* SPECIFICATIONS */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Brand", car.brand],
                  ["Model", car.model],
                  ["Year", car.year],
                  ["Condition", car.condition],
                  ["Odometer", car.kmDriven],
                  ["Engine Size", car.cc],
                  ["Mileage", car.mileage],
                  ["Fuel Type", car.fuelType],
                  ["Engine Type", car.engineType],
                  ["Location", car.location],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SELLER */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {car.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{car.seller.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{car.seller.rating}</span>
                      <span>• {car.seller.responseTime}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    {showPhone ? car.seller.phone : "Show Phone Number"}
                  </button>

                  <button className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 font-semibold flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Send Message
                  </button>
                </div>

                <button
                  onClick={() => setShowSellerDetails(!showSellerDetails)}
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  {showSellerDetails ? "Hide" : "Show"} Seller Details
                </button>

                {showSellerDetails && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Verified Seller</div>
                        <div className="text-sm text-gray-600">Identity confirmed</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Response Rate</div>
                        <div className="text-sm text-gray-600">
                          Usually responds within {car.seller.responseTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Location</div>
                        <div className="text-sm text-gray-600">{car.location}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SAFETY TIPS */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Safety Tips</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Meet in a public place</li>
                      <li>• Check the car carefully</li>
                      <li>• Verify documents</li>
                      <li>• Don't pay in advance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <img
            src={car.images[currentImageIndex]}
            alt={car.name}
            className="max-w-full max-h-full object-contain"
          />

          {car.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-lg">
            {currentImageIndex + 1} / {car.images.length}
          </div>
        </div>
      )}
    </div>
  );
}