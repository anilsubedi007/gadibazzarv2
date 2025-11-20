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
  bikeData,
  nepalDistricts,
  nepalProvinces,
  priceOptions,
  yearOptions,
  odometerOptions,
  conditionOptions,
} from "./filterData";

const BLUE = "text-blue-600";

// ======================
//  Bike Interface
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
// Extended Props
// ======================
interface ExtendedFilterPanelProps extends FilterPanelProps {
  bikeListings?: Bike[];
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  isOpen,
  onClose,
  forceFullPage = false,
  bikeListings,
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
    let filtered = [...(bikeListings ?? [])];

    // Brand
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter((bike: Bike) =>
        filters.selectedBrands.includes(bike.brand)
      );
    }

    // Model
    if (filters.selectedModels.length > 0) {
      filtered = filtered.filter((bike: Bike) =>
        filters.selectedModels.includes(bike.model)
      );
    }

    // Province / District
    if (
      filters.selectedProvinces.length > 0 ||
      filters.selectedDistricts.length > 0
    ) {
      filtered = filtered.filter((bike: Bike) => {
        const hasProvince =
          filters.selectedProvinces.length === 0 ||
          filters.selectedProvinces.some((province: string) =>
            bike.location.includes(province)
          );

        const hasDistrict =
          filters.selectedDistricts.length === 0 ||
          filters.selectedDistricts.some((district: string) =>
            bike.location.includes(district)
          );

        return hasProvince || hasDistrict;
      });
    }

    // Price
    if (filters.priceMin) {
      filtered = filtered.filter(
        (bike: Bike) => bike.price >= parseInt(filters.priceMin)
      );
    }
    if (filters.priceMax) {
      filtered = filtered.filter(
        (bike: Bike) => bike.price <= parseInt(filters.priceMax)
      );
    }

    // Year
    if (filters.yearMin) {
      filtered = filtered.filter(
        (bike: Bike) => bike.year >= parseInt(filters.yearMin)
      );
    }
    if (filters.yearMax) {
      filtered = filtered.filter(
        (bike: Bike) => bike.year <= parseInt(filters.yearMax)
      );
    }

    // Odometer
    if (filters.odometerMin || filters.odometerMax) {
      filtered = filtered.filter((bike: Bike) => {
        if (!bike.kmDriven) return false;
        const kmValue = parseInt(bike.kmDriven.replace(/[^0-9]/g, ""));

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
      filtered = filtered.filter((bike: Bike) =>
        filters.selectedConditions.some(
          (condition: string) =>
            condition.toLowerCase() === bike.condition.toLowerCase()
        )
      );
    }

    return filtered.length;
  }, [bikeListings, filters]);

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
            !bikeData[brand as keyof typeof bikeData]?.includes(m)
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
    const newConditions = filters.selectedConditions.includes(condition)
      ? filters.selectedConditions.filter((c: string) => c !== condition)
      : [...filters.selectedConditions, condition];

    onFiltersChange({ ...filters, selectedConditions: newConditions });
  };

  // ====================
  // Selected Labels (removed since we're not showing them)
  // ====================
  const text = {
    brands:
      filters.selectedBrands.length === 0
        ? ""
        : filters.selectedBrands.join(", "),

    models:
      filters.selectedModels.length === 0
        ? ""
        : filters.selectedModels.join(", "),

    provinces:
      filters.selectedProvinces.length === 0
        ? ""
        : filters.selectedProvinces.join(", "),

    districts:
      filters.selectedDistricts.length === 0
        ? ""
        : filters.selectedDistricts.join(", "),

    conditions:
      filters.selectedConditions.length === 0
        ? ""
        : filters.selectedConditions.join(", "),
  };

  // ======================
  // Section Label Component
  // ======================
  function SectionLabel({ title }: { title: string }) {
    return (
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {title}
      </label>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" suppressHydrationWarning>
      {/* Background */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed ${
          forceFullPage
            ? "inset-0"
            : "inset-y-0 right-0 w-96 max-w-[100vw]"
        } bg-white shadow-xl`}
        style={{
          width: forceFullPage ? "100%" : undefined,
          maxWidth: forceFullPage ? undefined : "24rem",
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {forceFullPage ? (
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              ) : (
                <X className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <h2 className="text-xl font-bold text-gray-800">Filter Bikes</h2>
          </div>

          <button
            onClick={() => {
              setOpenDropdown("");
              onReset();
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Reset
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="overflow-y-auto bg-white"
          style={{
            height: forceFullPage ? "calc(100vh - 80px - 80px)" : "calc(100vh - 80px - 80px)",
            paddingBottom: "1rem",
          }}
        >
          <div className="p-4 space-y-6">
            {/* BRAND */}
            <div className="relative">
              <SectionLabel title="Brand" />

              {(() => {
                const isActive =
                  filters.selectedBrands.length > 0 || openDropdown === "brand";
                return (
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === "brand" ? "" : "brand")
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
                      {filters.selectedBrands.length
                        ? text.brands
                        : "Select Brands"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openDropdown === "brand"
                          ? "rotate-180 text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })()}

              {openDropdown === "brand" && (
                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl max-h-60 overflow-y-auto z-20 shadow-md">
                  {Object.keys(bikeData).map((brand: string) => (
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

            {/* MODEL */}
            {filters.selectedBrands.length > 0 && (
              <div className="relative">
                <SectionLabel title="Model" />

                {(() => {
                  const isActive =
                    filters.selectedModels.length > 0 ||
                    openDropdown === "model";
                  return (
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === "model" ? "" : "model"
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
                        {filters.selectedModels.length
                          ? text.models
                          : "Select Models"}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openDropdown === "model"
                            ? "rotate-180 text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  );
                })()}

                {openDropdown === "model" && (
                  <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl max-h-60 overflow-y-auto z-20 shadow-md">
                    {filters.selectedBrands.flatMap((brand: string) =>
                      bikeData[brand as keyof typeof bikeData].map(
                        (model: string) => (
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
                              {model} ({brand})
                            </span>
                          </label>
                        )
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PROVINCE */}
            <div className="relative">
              <SectionLabel title="Province" />

              {(() => {
                const isActive =
                  filters.selectedProvinces.length > 0 ||
                  openDropdown === "province";
                return (
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "province" ? "" : "province"
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
                      {filters.selectedProvinces.length
                        ? text.provinces
                        : "Select Provinces"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openDropdown === "province"
                          ? "rotate-180 text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })()}

              {openDropdown === "province" && (
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

            {/* DISTRICT */}
            {filters.selectedProvinces.length > 0 && (
              <div className="relative">
                <SectionLabel title="District" />

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
                        {filters.selectedDistricts.length
                          ? text.districts
                          : "Select Districts"}
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
                Show {filteredCount} Bike{filteredCount !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}