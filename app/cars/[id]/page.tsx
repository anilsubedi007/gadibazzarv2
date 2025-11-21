"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Gauge, Cog, MapPin, Car } from "lucide-react";

// ⭐ Correct import (matches your bike structure)
import { carListings } from "@/listings/page";

import { Car as CarType } from "@/components/car/filterData";

export default function CarDetails({ params }: { params: { id: string } }) {
  const router = useRouter();

  const car: CarType | undefined = carListings.find(
    (item) => item.id === params.id
  );

  const [saved, setSaved] = useState<boolean>(false);
  const [mainImg, setMainImg] = useState<string>(
    car?.images?.[0] || "/fallback.jpg"
  );

  if (!car) {
    return (
      <div className="p-8 text-center text-gray-600">
        Car not found.
        <button
          onClick={() => router.back()}
          className="block mx-auto mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl"
        >
          Back
        </button>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    const reversed = price.toString().split("").reverse().join("");
    let result = "";

    for (let i = 0; i < reversed.length; i++) {
      if (i > 0 && (i === 3 || (i > 3 && (i - 3) % 2 === 0))) {
        result += ",";
      }
      result += reversed[i];
    }

    return "₨ " + result.split("").reverse().join("");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* TOP BAR */}
      <div className="p-4 flex items-center justify-between bg-white border-b sticky top-0 z-30">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        <span className="font-semibold text-gray-800 text-lg">Car Details</span>

        <button
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-full ${
            saved ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          <Heart className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* MAIN IMAGE */}
      <div className="relative w-full h-80 bg-black">
        <img
          src={mainImg}
          className="w-full h-full object-cover"
          alt={car.name}
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto p-3 bg-white border-b">
        {car.images.map((img, index) => (
          <img
            key={index}
            src={img}
            onClick={() => setMainImg(img)}
            className={`h-20 w-32 object-cover rounded-lg cursor-pointer border ${
              mainImg === img ? "border-blue-600" : "border-gray-300"
            }`}
          />
        ))}
      </div>

      {/* CAR HEADER */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">{car.year}</span>
          <span className="text-xl font-bold text-gray-900">{car.name}</span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {car.location}
          </div>

          <div className="text-xl font-bold text-blue-700">
            {formatPrice(car.price)}
          </div>
        </div>
      </div>

      {/* SPECS SECTION */}
      <div className="p-4 bg-white border-b">
        <h2 className="font-semibold text-gray-800 mb-3">Specifications</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cog className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Engine:</span>
              <span className="font-medium text-gray-900">{car.engineCC}</span>
            </div>

            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Body Type:</span>
              <span className="font-medium text-gray-900">{car.bodyType}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cog className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Transmission:</span>
              <span className="font-medium text-gray-900">
                {car.transmission}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">KM Driven:</span>
              <span className="font-medium text-gray-900">{car.kmDriven}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="p-4 bg-white border-b">
        <h2 className="font-semibold text-gray-800 mb-3">Description</h2>
        <p className="text-gray-700 leading-relaxed">{car.description}</p>
      </div>

      {/* SELLER INFO */}
      <div className="p-4 bg-white border-b">
        <h2 className="font-semibold text-gray-800 mb-3">Seller Information</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{car.seller.name}</p>
            <p className="text-sm text-gray-600">
              Rating: ⭐ {car.seller.rating}
            </p>
            <p className="text-sm text-gray-600">
              Response: {car.seller.responseTime}
            </p>
          </div>

          <a
            href={`tel:${car.seller.phone}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Call
          </a>
        </div>
      </div>

      {/* CONTACT BUTTONS */}
      <div className="p-4 flex gap-4">
        <button className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl">
          Call Seller
        </button>
        <button className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl">
          Chat
        </button>
      </div>
    </div>
  );
}
