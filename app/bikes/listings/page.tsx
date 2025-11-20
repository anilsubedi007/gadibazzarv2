"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

// Components
import BikeCard from "@/components/bike/BikeCard";
import FilterPanel from "@/components/bike/FilterPanel";

// Types
import { FilterPanelProps } from "@/components/bike/filterData";

// ======================
//  Bike Type
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
//  Your REAL 20 BIKE LISTINGS
// ======================
const bikesList: Bike[] = [
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
  
  // ... CONTINUES WITH ALL 20 ENTRIES ...
];

// ======================
//  PAGE COMPONENT
// ======================
function BikeListingsPage() {
  const router = useRouter();

  const [bikes] = useState<Bike[]>(bikesList);
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>(bikesList);

  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterPanelProps["filters"]>({
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
// Pagination states
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10); // default (mobile)

// Detect screen size and adjust itemsPerPage
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setItemsPerPage(15);   // Desktop
    } else {
      setItemsPerPage(10);   // Mobile
    }
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  // ======================
  //  APPLY FILTERS
  // ======================
  const applyFilters = useCallback(() => {
    let list = [...bikes];

    // Search
    if (searchQuery.trim()) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand
    if (filters.selectedBrands.length > 0) {
      list = list.filter((b) => filters.selectedBrands.includes(b.brand));
    }

    // Model
    if (filters.selectedModels.length > 0) {
      list = list.filter((b) => filters.selectedModels.includes(b.model));
    }

    setFilteredBikes(list);
  }, [bikes, filters, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
// Pagination calculations
const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentBikes = filteredBikes.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(filteredBikes.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white p-4 border-b sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Search bikes..."
              className="pl-10 pr-4 py-2 w-full border-2  border-gray-400 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>
      </div>

      {/* GRID */}
      
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentBikes.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            onSave={(id: string) => setSavedItems(new Set(savedItems).add(id))}
            onImageClick={() => router.push(`/bikes/${bike.id}`)}
            savedItems={savedItems}
          />
        ))}
      </div>
{/* Pagination */}
<div className="flex justify-center items-center gap-4 py-6">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
    className="px-4 py-2 border rounded-lg disabled:opacity-40"
  >
    Prev
  </button>

  <span className="font-medium text-gray-700">
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
    className="px-4 py-2 border rounded-lg disabled:opacity-40"
  >
    Next
  </button>

</div>

      {/* FILTER PANEL */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onApply={() => setIsFilterOpen(false)}
        onReset={() =>
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
          })
        }
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        forceFullPage={false}
        bikeListings={bikesList}
      />
    </div>
  );
}

export default BikeListingsPage;