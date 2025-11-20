"use client";


import { useRouter } from "next/navigation";
import { useState } from "react";

import  FilterPanel  from "@/components/bike/FilterPanel";

export default function Page() {
  const router = useRouter();

  const [filters, setFilters] = useState({
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

  const applyAndBack = () => router.push("/bikes/listings");
  const resetFilters = () =>
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

  return (
    <div className="bg-white min-h-screen">
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onApply={applyAndBack}
        onReset={resetFilters}
        isOpen={true}
        onClose={applyAndBack}
        forceFullPage={true}
      />
    </div>
  );
}
