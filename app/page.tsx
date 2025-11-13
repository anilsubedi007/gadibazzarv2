"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

function CleanVehicleMarketplace() {
  const router = useRouter();

  // ============ DATA ============
  const vehicleTypes = [
    { type: "Cycle", img: "/images/bike/cycle.png", trending: false },
    { type: "Bikes", img: "/images/bike/bike.png", trending: true },
    { type: "Cars", img: "/images/cars/suv.png", trending: true },
    { type: "Auto", img: "/images/cars/auto.png", trending: false },
    { type: "Pickup", img: "/images/cars/pickup.png", trending: false },
    { type: "Micro", img: "/images/cars/hiace.png", trending: false },
    { type: "Bus", img: "/images/cars/bus.png", trending: false },
    { type: "Truck", img: "/images/cars/truck.png", trending: false },
    { type: "Tractor", img: "/images/cars/tractor.png", trending: false },
  ];

  const brands: Record<string, string[]> = {
    Cycle: ["Hero", "Atlas", "Giant", "Trek", "Merida"],
    Bikes: ["Yamaha", "Honda", "Suzuki", "Bajaj", "TVS", "KTM"],
    Cars: ["Toyota", "Suzuki", "Hyundai", "Honda", "Nissan", "Kia", "Tata", "Mahindra"],
    Auto: ["Bajaj", "Piaggio"],
    Pickup: ["Tata", "Mahindra", "Isuzu"],
    Micro: ["Suzuki", "Toyota", "Kia"],
    Bus: ["Ashok Leyland", "Tata", "Eicher"],
    Truck: ["Tata", "Ashok Leyland", "Volvo"],
    Tractor: ["Mahindra", "Swaraj", "Sonalika"],
  };

  const provinces = [
    "Province 1",
    "Madhesh Province", 
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ];

  // ============ STATE ============
  const [vehicleType, setVehicleType] = useState("Cycle");
  const [brand, setBrand] = useState("");
  const [province, setProvince] = useState("");

  // ============ HANDLERS ============
  const handleVehicleTypeChange = useCallback((type: string) => {
    setVehicleType(type);
    setBrand("");
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (vehicleType) params.set("type", vehicleType);
    if (brand) params.set("brand", brand);
    if (province) params.set("province", province);
    router.push(`/cars/results?${params.toString()}`);
  }, [vehicleType, brand, province, router]);

  // ✅ Mapping each category to its folder path
  const categoryRoutes: Record<string, string> = {
    Cars: "/cars/listings",
    Bikes: "/bikes/listings",
    Cycle: "/Cycle/listings",
    Auto: "/auto/listings",
    Pickup: "/pickup/listings",
    Micro: "/micro/listings",
    Bus: "/bus/listings",
    Truck: "/truck/listings",
    Tractor: "/tractor/listings",
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/landingpage/bg.jpg')" }}
    >
      <main className="pt-16 md:pt-24 px-4 md:px-8 pb-8">

        {/* Browse Categories Section */}
        <section className="max-w-6xl mx-auto mt-2 md:mt-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Browse by Category
              </h2>
            </div>

            {/* Vehicle Categories Grid */}
            <div className="grid grid-cols-3 md:grid-cols-9 gap-6 md:gap-6">
              {vehicleTypes.map((item) => {
                const href = categoryRoutes[item.type] || `/cars/results?type=${item.type}`;
                return (
                  <Link
                    key={item.type}
                    href={href}
                    className="group cursor-pointer text-center relative hover:transform hover:scale-105 transition-all duration-300"
                  >
                    {/* Trending Badge */}
                    {item.trending && (
                      <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                        <TrendingUp className="w-2 h-2 md:w-3 md:h-3" />
                        <span className="hidden md:inline">Hot</span>
                        <span className="md:hidden">•</span>
                      </div>
                    )}

                    {/* Vehicle Image */}
                    <div className="mb-3 md:mb-4 flex justify-center">
                      <div className="w-20 h-20 md:w-20 md:h-20 flex items-center justify-center">
                        <img
                          src={item.img}
                          alt={item.type}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg"
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      </div>
                    </div>

                    {/* Vehicle Type Name */}
                    <h3 className="font-bold text-gray-800 text-sm md:text-base group-hover:text-blue-600 transition-colors leading-tight px-1">
                      {item.type}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Search Section */}
        <section className="max-w-6xl mx-auto mt-6 md:mt-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
                Find Your Perfect Vehicle
              </h1>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                {/* Vehicle Type */}
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm font-medium text-gray-900 md:text-gray-700">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => handleVehicleTypeChange(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-500 md:text-gray-700 appearance-none"
                  >
                    {vehicleTypes.map((v) => (
                      <option key={v.type} value={v.type}>
                        {v.type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm font-medium text-gray-900 md:text-gray-700">
                    Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-500 md:text-gray-700 appearance-none"
                  >
                    <option value="">All Brands</option>
                    {brands[vehicleType]?.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Province */}
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm font-medium text-gray-900 md:text-gray-700">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-500 md:text-gray-700 appearance-none"
                  >
                    <option value="">All Provinces</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm font-medium text-transparent">Search</label>
                  <button
                    onClick={handleSearch}
                    className="w-full h-[56px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Search className="w-5 h-5" />
                    Search Vehicles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-6 md:mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Want to Sell Your Vehicle?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/cars/filters")}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
              >
                <Search className="w-5 h-5" />
                One Click Away
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ✅ Export dynamically to prevent hydration issues
export default dynamic(() => Promise.resolve(CleanVehicleMarketplace), { ssr: false });
