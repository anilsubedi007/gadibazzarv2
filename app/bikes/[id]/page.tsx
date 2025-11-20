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
// BIKE INTERFACE
// ======================
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

// ======================
// ALL YOUR BIKES DATA
// ======================
const ALL_BIKES: Bike[] = [
  {
    id: "1",
    name: "Bajaj Platina 100",
    brand: "Bajaj",
    model: "Platina 100",
    year: 2018,
    price: 1081504,
    cc: "102cc",
    mileage: "57 km/l",
    location: "Biratnagar, Province 1",
    fuelType: "Electric",
    condition: "new",
    images: [
      "/api/placeholder/800/600?text=Bajaj+Platina+Front",
      "/api/placeholder/800/600?text=Bajaj+Platina+Side",
      "/api/placeholder/800/600?text=Bajaj+Platina+Back",
      "/api/placeholder/800/600?text=Bajaj+Platina+Interior",
      "/api/placeholder/800/600?text=Bajaj+Platina+Engine",
    ],
    seller: {
      name: "Hero Motors Janakpur",
      rating: 4.7,
      responseTime: "< 2 hours",
      phone: "+977-9899671425",
    },
    postedDate: "2025-09-30",
    views: 179,
    description: "Well maintained Bajaj Platina 100 in excellent condition. Smooth engine and great performance. This bike has been regularly serviced and is ready for a new owner.",
    kmDriven: "16,340 km",
    engineType: "4-stroke, Liquid cooled",
  },
  {
    id: "2",
    name: "Crossfire Tracker 250",
    brand: "Crossfire",
    model: "Tracker 250",
    year: 2025,
    price: 536803,
    cc: "249cc",
    mileage: "53-69 km/l",
    location: "Pokhara, Gandaki",
    fuelType: "Petrol",
    condition: "used",
    images: [
      "/api/placeholder/800/600?text=Crossfire+Front",
      "/api/placeholder/800/600?text=Crossfire+Side",
      "/api/placeholder/800/600?text=Crossfire+Back",
    ],
    seller: {
      name: "Rajesh Maharjan",
      rating: 4.4,
      responseTime: "< 3 hours",
      phone: "+977-9821044394",
    },
    postedDate: "2025-06-20",
    views: 222,
    description: "Well maintained Crossfire Tracker 250 in excellent condition.",
    kmDriven: "29,385 km",
    engineType: "4-stroke, Air cooled",
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
  // ADD YOUR REMAINING 18 BIKES HERE
];

// ======================
// PAGE COMPONENT
// ======================
export default function Page() {
  const router = useRouter();
  const params = useParams();
  const bikeId = params.id as string;

  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showSellerDetails, setShowSellerDetails] = useState(false);

  useEffect(() => {
    const foundBike = ALL_BIKES.find((b) => b.id === bikeId);
    setBike(foundBike || null);
    setLoading(false);
  }, [bikeId]);

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
    if (!bike) return;
    setCurrentImageIndex((prev) =>
      prev === bike.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!bike) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? bike.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bike details...</p>
        </div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bike Not Found</h1>
          <p className="text-gray-600 mb-6">The bike you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/bikes/listings")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Listings
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg ${
                isSaved ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* IMAGE GALLERY */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={bike.images[currentImageIndex]}
                  alt={bike.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                />

                {bike.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white rounded-lg text-sm font-medium">
                  {currentImageIndex + 1} / {bike.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {bike.images.map((img, idx) => (
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

            {/* TITLE & PRICE */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {bike.year} {bike.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {bike.location}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {bike.views} views
                </div>
              </div>

              <div className="text-4xl font-bold text-blue-600 mb-6">
                {formatPrice(bike.price)}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Year</div>
                    <div className="font-semibold text-gray-900">{bike.year}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Odometer</div>
                    <div className="font-semibold text-gray-900">{bike.kmDriven}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Engine</div>
                    <div className="font-semibold text-gray-900">{bike.cc}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Fuel className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Fuel</div>
                    <div className="font-semibold text-gray-900">{bike.fuelType}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{bike.description}</p>
            </div>

            {/* SPECIFICATIONS */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Brand", bike.brand],
                  ["Model", bike.model],
                  ["Year", bike.year],
                  ["Condition", bike.condition],
                  ["Odometer", bike.kmDriven],
                  ["Engine Size", bike.cc],
                  ["Mileage", bike.mileage],
                  ["Fuel Type", bike.fuelType],
                  ["Engine Type", bike.engineType],
                  ["Location", bike.location],
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
                      {bike.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{bike.seller.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{bike.seller.rating}</span>
                      <span>• {bike.seller.responseTime}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    {showPhone ? bike.seller.phone : "Show Phone Number"}
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
                          Usually responds within {bike.seller.responseTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Location</div>
                        <div className="text-sm text-gray-600">{bike.location}</div>
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
                      <li>• Check the bike carefully</li>
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
            src={bike.images[currentImageIndex]}
            alt={bike.name}
            className="max-w-full max-h-full object-contain"
          />

          {bike.images.length > 1 && (
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
            {currentImageIndex + 1} / {bike.images.length}
          </div>
        </div>
      )}
    </div>
  );
}