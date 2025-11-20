"use client";

import React from "react";
import { Heart, Package, Settings, Gauge, Cog, MapPin } from "lucide-react";

// If your types are NOT in a separate file, add this instead:
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

interface BikeCardProps {
  bike: Bike;
  onSave: (id: string) => void;
  onImageClick: (bike: Bike) => void;
  savedItems: Set<string>;
}


const BikeCard: React.FC<BikeCardProps> = ({ bike, onSave, onImageClick, savedItems }) => {
  const isSaved = savedItems.has(bike.id);

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

    return `₨ ${formatted.split('').reverse().join('')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={bike.images[0]}
          alt={bike.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onImageClick(bike)}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(bike.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isSaved ? "bg-red-500 text-white" : "bg-white/80 text-gray-600"
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{bike.year}</span>
          <h3 className="text-lg font-bold text-gray-900">{bike.name}</h3>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-700 gap-2">
              <Package className="w-4 h-4" />
              <span>Type:</span>
              <span className="font-medium text-gray-900">Bike</span>
            </div>
            <div className="flex items-center text-xs text-gray-700 gap-2">
              <Settings className="w-4 h-4" />
              <span>Engine:</span>
              <span className="font-medium text-gray-900">{bike.cc}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-700 gap-2">
              <Gauge className="w-4 h-4" />
              <span>Odometer:</span>
              <span className="font-medium text-gray-900">{bike.kmDriven || "N/A"}</span>
            </div>
            <div className="flex items-center text-xs text-gray-700 gap-2">
              <Cog className="w-4 h-4" />
              <span>Transmission:</span>
              <span className="font-medium text-gray-900">Manual</span>
            </div>
          </div>
        </div>

        {/* Location + Price */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {bike.location}
          </div>
          <div className="text-lg font-bold" style={{ color: "#121d3cff" }}>
            {formatPrice(bike.price)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
