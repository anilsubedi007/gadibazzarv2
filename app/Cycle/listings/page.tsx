"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Heart, Bike, Gauge, Settings, Cog } from "lucide-react";
import dynamic from "next/dynamic";

// ✅ Cycle interface
interface Cycle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  location: string;
  condition: "new" | "used";
  images: string[];
  seller: { name: string; rating: number; responseTime: string; phone: string };
  description: string;
  cycleType: string;
  frameSize: string;
  wheelSize: string;
  gears: string;
}

const generateNepalCycles = (): Cycle[] => [
  {
    id: "1",
    name: "Hero Ranger 26T",
    brand: "Hero",
    model: "Ranger",
    year: 2024,
    price: 18500,
    location: "Kathmandu",
    cycleType: "Mountain",
    condition: "new",
    images: ["/api/placeholder/400/300?text=Hero+Ranger"],
    seller: { name: "Hero Cycles Nepal", rating: 4.6, responseTime: "< 1 hour", phone: "+977-9841234567" },
    description: "Hero Ranger mountain bike with 18-speed gear system.",
    frameSize: "18 inch",
    wheelSize: "26 inch",
    gears: "18 Speed",
  },
  // ...other cycles
];

// ✅ CycleCard component
const CycleCard = ({ cycle, onSave, savedItems, onImageClick }: any) => {
  const isSaved = savedItems.has(cycle.id);
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="relative h-48">
        <img
          src={cycle.images[0]}
          alt={cycle.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onImageClick(cycle)}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(cycle.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full ${isSaved ? "bg-red-500 text-white" : "bg-white/80 text-gray-600"}`}
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{cycle.name}</h3>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {cycle.location}
        </p>
        <p className="text-blue-700 font-semibold mt-2">₨{cycle.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

// ✅ Main Page
function NepalCycleListings() {
  const router = useRouter();
  const [cycles] = useState<Cycle[]>(generateNepalCycles());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const handleSave = (id: string) => {
    const newSet = new Set(savedItems);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSavedItems(newSet);
  };

  const handleImageClick = (cycle: Cycle) => {
    router.push(`/Cycle/${cycle.id}`); // ✅ match folder casing
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Bicycles in Nepal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cycles.map((cycle) => (
          <CycleCard
            key={cycle.id}
            cycle={cycle}
            onSave={handleSave}
            savedItems={savedItems}
            onImageClick={handleImageClick}
          />
        ))}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(NepalCycleListings), { ssr: false });
