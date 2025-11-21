"use client";

import { X, ChevronDown, ArrowLeft } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";

// Beautiful animated SelectBox with blue active state
function SelectBox({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}) {
  const isSelected = value !== "";

  return (
    <div
      className={`relative rounded-xl border bg-white transition-all duration-200 shadow-sm 
        ${isSelected ? "border-blue-400" : "border-gray-300"}
        hover:border-blue-300`}
    >
      <select
        value={value}
        onChange={onChange}
        className="p-2 w-full rounded-xl bg-white text-gray-700 text-sm 
          appearance-none focus:outline-none"
      >
        {children}
      </select>

      {/* Smooth animated icon */}
      <ChevronDown
        size={18}
        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 
          ${isSelected ? "text-blue-500" : "text-gray-400"}
        `}
      />
    </div>
  );
}

import { useState, useMemo, useEffect } from "react";
import {
  FilterPanelProps,
  carData,
  nepalDistricts,
  nepalProvinces,
  priceOptions,
  yearOptions,
  odometerOptions,
  conditionOptions,
} from "./filterData";

const BLUE = "text-blue-600";

// ======================
//  Car Interface
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
// Extended Props
// ======================
interface ExtendedFilterPanelProps extends FilterPanelProps {
  carListings?: Car[];
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  isOpen,
  onClose,
  forceFullPage = false,
  carListings,
}: ExtendedFilterPanelProps) {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ====================
  // LIVE FILTER COUNT
  // ====================
  const filteredCount = useMemo(() => {
    let filtered = [...(carListings ?? [])];

    // Brand
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter((car: Car) =>
        filters.selectedBrands.includes(car.brand)
      );
    }

    // Model
    if (filters.selectedModels.length > 0) {
      filtered = filtered.filter((car: Car) =>
        filters.selectedModels.includes(car.model)
      );
    }

    // Province / District
    if (
      filters.selectedProvinces.length > 0 ||
      filters.selectedDistricts.length > 0
    ) {
      filtered = filtered.filter((car: Car) => {
        const hasProvince =
          filters.selectedProvinces.length === 0 ||
          filters.selectedProvinces.some((province: string) =>
            car.location.includes(province)
          );

        const hasDistrict =
          filters.selectedDistricts.length === 0 ||
          filters.selectedDistricts.some((district: string) =>
            car.location.includes(district)
          );

        return hasProvince || hasDistrict;
      });
    }

    // Price
    if (filters.priceMin) {
      filtered = filtered.filter(
        (car: Car) => car.price >= parseInt(filters.priceMin)
      );
    }
    if (filters.priceMax) {
      filtered = filtered.filter(
        (car: Car) => car.price <= parseInt(filters.priceMax)
      );
    }

    // Year
    if (filters.yearMin) {
      filtered = filtered.filter(
        (car: Car) => car.year >= parseInt(filters.yearMin)
      );
    }
    if (filters.yearMax) {
      filtered = filtered.filter(
        (car: Car) => car.year <= parseInt(filters.yearMax)
      );
    }

    // Odometer
    if (filters.odometerMin || filters.odometerMax) {
      filtered = filtered.filter((car: Car) => {
        if (!car.kmDriven) return false;
        const kmValue = parseInt(car.kmDriven.replace(/[^0-9]/g, ""));

        if (filters.odometerMin && kmValue < parseInt(filters.odometerMin)) {
          return false;
        }
        if (filters.odometerMax && kmValue > parseInt(filters.odometerMax)) {
          return false;
        }
        return true;
      });
    }

    // Condition
    if (filters.selectedConditions.length > 0) {
      filtered = filtered.filter((car: Car) =>
        filters.selectedConditions.some(
          (condition: string) =>
            condition.toLowerCase() === car.condition.toLowerCase()
        )
      );
    }

    return filtered.length;
  }, [carListings, filters]);

  // ====================
  // Toggle Actions
  // ====================
  const toggleBrand = (brand: string): void => {
    const newBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter((b: string) => b !== brand)
      : [...filters.selectedBrands, brand];

    const newModels = newBrands.includes(brand)
      ? filters.selectedModels
      : filters.selectedModels.filter(
          (m: string) =>
            !carData[brand as keyof typeof carData]?.includes(m)
        );

    onFiltersChange({
      ...filters,
      selectedBrands: newBrands,
      selectedModels: newModels,
    });
  };

  const toggleModel = (model: string): void => {
    const newModels = filters.selectedModels.includes(model)
      ? filters.selectedModels.filter((m: string) => m !== model)
      : [...filters.selectedModels, model];

    onFiltersChange({ ...filters, selectedModels: newModels });
  };

  const toggleProvince = (province: string): void => {
    const newProv = filters.selectedProvinces.includes(province)
      ? filters.selectedProvinces.filter((p: string) => p !== province)
      : [...filters.selectedProvinces, province];

    const newDist = newProv.includes(province)
      ? filters.selectedDistricts
      : filters.selectedDistricts.filter(
          (d: string) =>
            !nepalDistricts[province as keyof typeof nepalDistricts]?.includes(
              d
            )
        );

    onFiltersChange({
      ...filters,
      selectedProvinces: newProv,
      selectedDistricts: newDist,
    });
  };

  const toggleDistrict = (district: string): void => {
    const newDist = filters.selectedDistricts.includes(district)
      ? filters.selectedDistricts.filter((d: string) => d !== district)
      : [...filters.selectedDistricts, district];

    onFiltersChange({ ...filters, selectedDistricts: newDist });
  };

  const toggleCondition = (condition: string): void => {
    const newCond = filters.selectedConditions.includes(condition)
      ? filters.selectedConditions.filter((c: string) => c !== condition)
      : [...filters.selectedConditions, condition];

    onFiltersChange({ ...filters, selectedConditions: newCond });
  };

  // ====================
  // Dynamic Text
  // ====================
  const text = useMemo(() => {
    const counts = {
      brands: filters.selectedBrands.length,
      models: filters.selectedModels.length,
      provinces: filters.selectedProvinces.length,
      districts: filters.selectedDistricts.length,
      conditions: filters.selectedConditions.length,
    };

    return {
      brands:
        counts.brands === 0
          ? "Select Brands"
          : counts.brands === 1
          ? filters.selectedBrands[0]
          : `${counts.brands} Brands`,
      models:
        counts.models === 0
          ? "Select Models"
          : counts.models === 1
          ? filters.selectedModels[0]
          : `${counts.models} Models`,
      provinces:
        counts.provinces === 0
          ? "Select Provinces"
          : counts.provinces === 1
          ? filters.selectedProvinces[0]
          : `${counts.provinces} Provinces`,
      districts:
        counts.districts === 0
          ? "Select Districts"
          : counts.districts === 1
          ? filters.selectedDistricts[0]
          : `${counts.districts} Districts`,
      conditions:
        counts.conditions === 0
          ? "Select Conditions"
          : counts.conditions === 1
          ? filters.selectedConditions[0]
          : `${counts.conditions} Conditions`,
    };
  }, [filters]);

  // Available Models
  const availableModels = useMemo(() => {
    return filters.selectedBrands.length
      ? filters.selectedBrands.flatMap(
          (brand: string) =>
            carData[brand as keyof typeof carData] || []
        )
      : [];
  }, [filters.selectedBrands]);

  // Section Label Component
  const SectionLabel = ({
    title,
    count = 0,
  }: {
    title: string;
    count?: number;
  }): JSX.Element => (
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-800">{title}</h3>
      {count > 0 && (
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
          {count}
        </span>
      )}
    </div>
  );

  if (!mounted) return null;
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${forceFullPage ? "" : "lg:relative lg:inset-auto"}`}>
      <div
        className="absolute inset-0 bg-black bg-opacity-30 lg:hidden"
        onClick={onClose}
      />

      <div className={`
        bg-white h-full overflow-y-auto
        ${forceFullPage 
          ? "w-full" 
          : "w-96 ml-auto lg:ml-0 lg:w-full lg:relative"
        }
        ${forceFullPage ? "" : "border-l border-gray-200 lg:border-none"}
      `}>
        <div className="relative h-full flex flex-col">
          {/* HEADER */}
          <div className="px-4 py-4 border-b border-gray-300 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={onReset}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  Reset
                </button>

                {forceFullPage ? (
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 px-4 py-4 space-y-6 pb-20">
            {/* BRANDS */}
            <div className="relative">
              <SectionLabel title="Brands" count={filters.selectedBrands.length} />

              {(() => {
                const isActive =
                  filters.selectedBrands.length > 0 || openDropdown === "brands";
                return (
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "brands" ? "" : "brands"
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-xl flex justify-between items-center bg-white shadow-sm transition-all duration-200 ${
                      isActive ? "border-blue-400" : "border-gray-300"
                    } hover:border-blue-300`}
                  >
                    <span
                      className={
                        filters.selectedBrands.length
                          ? "text-gray-800"
                          : "text-gray-400"
                      }
                    >
                      {text.brands}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openDropdown === "brands"
                          ? "rotate-180 text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })()}

              {openDropdown === "brands" && (
                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl max-h-60 overflow-y-auto z-20 shadow-md">
                  {Object.keys(carData).map((brand: string) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span
                        className={
                          filters.selectedBrands.includes(brand)
                            ? "text-blue-600"
                            : "text-gray-700"
                        }
                      >
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* MODELS */}
            {filters.selectedBrands.length > 0 && (
              <div className="relative">
                <SectionLabel title="Models" count={filters.selectedModels.length} />

                {(() => {
                  const isActive =
                    filters.selectedModels.length > 0 ||
                    openDropdown === "models";
                  return (
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === "models" ? "" : "models"
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-xl flex justify-between items-center bg-white shadow-sm transition-all duration-200 ${
                        isActive ? "border-blue-400" : "border-gray-300"
                      } hover:border-blue-300`}
                    >
                      <span
                        className={
                          filters.selectedModels.length
                            ? "text-gray-800"
                            : "text-gray-400"
                        }
                      >
                        {text.models}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openDropdown === "models"
                            ? "rotate-180 text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  );
                })()}

                {openDropdown === "models" && (
                  <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl max-h-60 overflow-y-auto z-20 shadow-md">
                    {availableModels.map((model: string) => (
                      <label
                        key={model}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.selectedModels.includes(model)}
                          onChange={() => toggleModel(model)}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span
                          className={
                            filters.selectedModels.includes(model)
                              ? "text-blue-600"
                              : "text-gray-700"
                          }
                        >
                          {model}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROVINCES */}
            <div className="relative">
              <SectionLabel title="Provinces" count={filters.selectedProvinces.length} />

              {(() => {
                const isActive =
                  filters.selectedProvinces.length > 0 ||
                  openDropdown === "provinces";
                return (
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "provinces" ? "" : "provinces"
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-xl flex justify-between items-center bg-white shadow-sm transition-all duration-200 ${
                      isActive ? "border-blue-400" : "border-gray-300"
                    } hover:border-blue-300`}
                  >
                    <span
                      className={
                        filters.selectedProvinces.length
                          ? "text-gray-800"
                          : "text-gray-400"
                      }
                    >
                      {text.provinces}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openDropdown === "provinces"
                          ? "rotate-180 text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })()}

              {openDropdown === "provinces" && (
                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl max-h-60 overflow-y-auto z-20 shadow-md">
                  {nepalProvinces.map((province: string) => (
                    <label
                      key={province}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.selectedProvinces.includes(province)}
                        onChange={() => toggleProvince(province)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span
                        className={
                          filters.selectedProvinces.includes(province)
                            ? "text-blue-600"
                            : "text-gray-700"
                        }
                      >
                        {province}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* DISTRICTS */}
            {filters.selectedProvinces.length > 0 && (
              <div className="relative">
                <SectionLabel title="Districts" count={filters.selectedDistricts.length} />

                {(() => {
                  const isActive =
                    filters.selectedDistricts.length > 0 ||
                    openDropdown === "district";
                  return (
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === "district" ? "" : "district"
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-xl flex justify-between items-center bg-white shadow-sm transition-all duration-200 ${
                        isActive ? "border-blue-400" : "border-gray-300"
                      } hover:border-blue-300`}
                    >
                      <span
                        className={
                          filters.selectedDistricts.length
                            ? "text-gray-800"
                            : "text-gray-400"
                        }
                      >
                        {text.districts}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openDropdown === "district"
                            ? "rotate-180 text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  );
                })()}

                {openDropdown === "district" && (
                  <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl max-h-60 overflow-y-auto z-20 shadow-md">
                    {filters.selectedProvinces.flatMap((province: string) =>
                      nepalDistricts[
                        province as keyof typeof nepalDistricts
                      ].map((district: string) => (
                        <label
                          key={district}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={filters.selectedDistricts.includes(
                              district
                            )}
                            onChange={() => toggleDistrict(district)}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span
                            className={
                              filters.selectedDistricts.includes(district)
                                ? "text-blue-600"
                                : "text-gray-700"
                            }
                          >
                            {district}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PRICE RANGE */}
            <div>
              <SectionLabel title="Price Range" />

              <div className="grid grid-cols-2 gap-3">
                <SelectBox
                  value={filters.priceMin}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, priceMin: e.target.value })
                  }
                >
                  <option value="">Min</option>
                  {priceOptions.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </SelectBox>

                <SelectBox
                  value={filters.priceMax}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, priceMax: e.target.value })
                  }
                >
                  <option value="">Max</option>
                  {priceOptions.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </SelectBox>
              </div>
            </div>

            {/* YEAR RANGE */}
            <div>
              <SectionLabel title="Year Range" />

              <div className="grid grid-cols-2 gap-3">
                <SelectBox
                  value={filters.yearMin}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, yearMin: e.target.value })
                  }
                >
                  <option value="">Min</option>
                  {yearOptions.map((year: number) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </SelectBox>

                <SelectBox
                  value={filters.yearMax}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, yearMax: e.target.value })
                  }
                >
                  <option value="">Max</option>
                  {yearOptions.map((year: number) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </SelectBox>
              </div>
            </div>

            {/* ODOMETER */}
            <div>
              <SectionLabel title="Odometer Range" />

              <div className="grid grid-cols-2 gap-3">
                <SelectBox
                  value={filters.odometerMin}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, odometerMin: e.target.value })
                  }
                >
                  <option value="">Min</option>
                  {odometerOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </SelectBox>

                <SelectBox
                  value={filters.odometerMax}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, odometerMax: e.target.value })
                  }
                >
                  <option value="">Max</option>
                  {odometerOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </SelectBox>
              </div>
            </div>

            {/* CONDITION */}
            <div className="relative">
              <SectionLabel title="Condition" />

              {(() => {
                const isActive =
                  filters.selectedConditions.length > 0 ||
                  openDropdown === "condition";
                return (
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "condition" ? "" : "condition"
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-xl flex justify-between items-center bg-white shadow-sm transition-all duration-200 ${
                      isActive ? "border-blue-400" : "border-gray-300"
                    } hover:border-blue-300`}
                  >
                    <span
                      className={
                        filters.selectedConditions.length
                          ? "text-gray-800"
                          : "text-gray-400"
                      }
                    >
                      {filters.selectedConditions.length
                        ? text.conditions
                        : "Select Condition"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openDropdown === "condition"
                          ? "rotate-180 text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })()}

              {openDropdown === "condition" && (
                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl z-20 shadow-md">
                  {conditionOptions.map((condition: string) => (
                    <label
                      key={condition}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.selectedConditions.includes(condition)}
                        onChange={() => toggleCondition(condition)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span
                        className={
                          filters.selectedConditions.includes(condition)
                            ? "text-blue-600"
                            : "text-gray-700"
                        }
                      >
                        {condition}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM ACTION BUTTON */}
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-300 bg-white shadow-lg" style={{
            width: forceFullPage ? '100%' : undefined,
            maxWidth: forceFullPage ? undefined : '24rem' // 384px = 24rem = w-96
          }}>
            {filteredCount === 0 ? (
              <div className="space-y-3">
                <p className="text-center text-gray-600 text-sm">
                  There is no listed listing for your filter
                </p>
                <button
                  onClick={() => {
                    setOpenDropdown("");
                    onReset();
                  }}
                  className="w-full py-2 bg-gray-600 text-white rounded-xl text-lg font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setOpenDropdown("");
                  onApply();
                }}
                className="w-full py-2 bg-blue-600 text-white rounded-xl text-lg font-bold"
              >
                Show {filteredCount} Car{filteredCount !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}