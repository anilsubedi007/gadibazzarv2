"use client";
export const dynamic = "force-dynamic";

import React, { useState, useCallback } from "react";
import { ChevronRight, MapPin, Calendar, DollarSign, Gauge, Settings, Car } from "lucide-react";
import { useRouter } from "next/navigation";

const AutoSearchFilters = () => {
  const router = useRouter();

  const [filters, setFilters] = useState({
    brand: "",
    province: "",
    year: { min: "", max: "" },
    price: { min: "", max: "" },
    odometer: { min: "", max: "" },
    condition: "",
    fuelType: "",
  });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    brand: true, province: true, year: true, price: true, odometer: true, condition: true, fuelType: true,
  });

  const brands = ["Bajaj", "Piaggio", "Mahindra", "Tata", "Force"];
  const provinces = [
    "Province 1", "Madhesh Province", "Bagmati Province", "Gandaki Province",
    "Lumbini Province", "Karnali Province", "Sudurpashchim Province",
  ];
  const years = Array.from({ length: 71 }, (_, i) => (2026 - i).toString());
  const prices = Array.from({ length: 30 }, (_, i) => (500000 + i * 100000).toString());
  const odometers = Array.from({ length: 21 }, (_, i) => (i * 10000).toString());
  const conditions = ["New", "Used"];
  const fuels = ["Petrol", "Diesel", "Electric"];

  const toggle = (s: string) => setExpanded(p => ({ ...p, [s]: !p[s] }));
  const setF = (k: string, v: any) => setFilters(p => ({ ...p, [k]: v }));
  const setR = (k: string, r: string, v: string) => setFilters(p => ({ ...p, [k]: { ...p[k], [r]: v } }));

  const clear = () => setFilters({ brand: "", province: "", year: { min: "", max: "" }, price: { min: "", max: "" }, odometer: { min: "", max: "" }, condition: "", fuelType: "" });

  const search = () => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (typeof v === "object") { if (v.min) p.set(`${k}Min`, v.min); if (v.max) p.set(`${k}Max`, v.max); }
      else if (v) p.set(k, v);
    });
    router.push(`/auto/results?${p.toString()}`);
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="border-b border-gray-200">
      <button onClick={() => toggle(title)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
        <div className="flex items-center space-x-3"><Icon className="w-5 h-5 text-gray-600" /><span className="font-medium text-gray-900">{title}</span></div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded[title] ? "rotate-90" : ""}`} />
      </button>
      {expanded[title] && <div className="p-4 bg-gray-50">{children}</div>}
    </div>
  );

  const Select = ({ label, value, onChange, options }: any) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border px-3 py-2 rounded-md text-gray-800 bg-white">
      <option value="">{label}</option>{options.map((o: string) => <option key={o}>{o}</option>)}
    </select>
  );

  const Range = ({ label, min, max, list, onMin, onMax }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <div className="flex space-x-2">
        <select value={min} onChange={(e) => onMin(e.target.value)} className="w-full border px-3 py-2 rounded-md text-gray-800"><option value="">Min</option>{list.map((n: string) => <option key={n}>{n}</option>)}</select>
        <select value={max} onChange={(e) => onMax(e.target.value)} className="w-full border px-3 py-2 rounded-md text-gray-800"><option value="">Max</option>{list.map((n: string) => <option key={n}>{n}</option>)}</select>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-20">
        <button onClick={clear} className="text-blue-600 font-medium">Clear All</button>
        <h1 className="text-lg font-semibold text-gray-900">Auto Filters</h1>
        <button className="text-gray-500">Close</button>
      </div>
      <div className="divide-y divide-gray-200 flex-1 overflow-y-auto">
        <Section title="Brand" icon={Car}><Select label="Select Brand" value={filters.brand} onChange={(v: string) => setF("brand", v)} options={brands} /></Section>
        <Section title="Province" icon={MapPin}><Select label="Select Province" value={filters.province} onChange={(v: string) => setF("province", v)} options={provinces} /></Section>
        <Section title="Year" icon={Calendar}><Range label="Select Year Range" min={filters.year.min} max={filters.year.max} list={years} onMin={(v: string) => setR("year", "min", v)} onMax={(v: string) => setR("year", "max", v)} /></Section>
        <Section title="Price (NPR)" icon={DollarSign}><Range label="Select Price Range" min={filters.price.min} max={filters.price.max} list={prices} onMin={(v: string) => setR("price", "min", v)} onMax={(v: string) => setR("price", "max", v)} /></Section>
        <Section title="Odometer (km)" icon={Gauge}><Range label="Odometer Range" min={filters.odometer.min} max={filters.odometer.max} list={odometers} onMin={(v: string) => setR("odometer", "min", v)} onMax={(v: string) => setR("odometer", "max", v)} /></Section>
        <Section title="Condition" icon={Settings}><Select label="Select Condition" value={filters.condition} onChange={(v: string) => setF("condition", v)} options={conditions} /></Section>
        <Section title="Fuel Type" icon={Settings}><Select label="Select Fuel Type" value={filters.fuelType} onChange={(v: string) => setF("fuelType", v)} options={fuels} /></Section>
      </div>
      <div className="p-4 border-t bg-white">
        <button onClick={search} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Search Auto</button>
      </div>
    </div>
  );
};

export default AutoSearchFilters;
