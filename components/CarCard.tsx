
import React from 'react';
import { CarSpecs } from '../types';

interface CarCardProps {
  car: CarSpecs;
  onRemove: () => void;
}

const EngineIcon = () => (
  <svg 
    width="34" 
    height="34" 
    viewBox="0 0 512 512" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bottom Fins / Exhaust Pipes */}
    <g fill="#94a3b8" stroke="#000" strokeWidth="14" strokeLinecap="round">
      <rect x="180" y="410" width="18" height="50" rx="9" />
      <rect x="218" y="425" width="18" height="50" rx="9" />
      <rect x="256" y="430" width="18" height="50" rx="9" transform="translate(-9,0)" />
      <rect x="276" y="425" width="18" height="50" rx="9" />
      <rect x="314" y="410" width="18" height="50" rx="9" />
    </g>

    {/* Side Curved Connector Pipes */}
    <path d="M110 280 Q70 340 110 410" fill="none" stroke="#000" strokeWidth="18" strokeLinecap="round" />
    <path d="M402 280 Q442 340 402 410" fill="none" stroke="#000" strokeWidth="18" strokeLinecap="round" />
    <path d="M110 280 Q70 340 110 410" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
    <path d="M402 280 Q442 340 402 410" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />

    {/* Main Engine Block (Light Grey) */}
    <path 
      d="M256 180 L430 360 L370 430 L142 430 L82 360 Z" 
      fill="#d1d5db" 
      stroke="#000" 
      strokeWidth="16" 
      strokeLinejoin="round" 
    />
    
    {/* Red Cylinder Heads */}
    <g stroke="#000" strokeWidth="16" strokeLinejoin="round">
      {/* Left Head */}
      <path d="M40 140 L190 50 L270 180 L120 270 Z" fill="#dc2626" />
      {/* Right Head */}
      <path d="M472 140 L322 50 L242 180 L392 270 Z" fill="#dc2626" />
    </g>

    {/* Detail Stripes on Heads (U-shapes) */}
    <g fill="none" stroke="#000" strokeWidth="12" strokeLinecap="round" opacity="0.3">
      <path d="M100 130 L130 180" />
      <path d="M150 100 L180 150" />
      <path d="M412 130 L382 180" />
      <path d="M362 100 L332 150" />
    </g>

    {/* Pulleys / Gears (Mid Grey) */}
    <circle cx="256" cy="285" r="45" fill="#6b7280" stroke="#000" strokeWidth="16" />
    <circle cx="180" cy="385" r="42" fill="#6b7280" stroke="#000" strokeWidth="16" />
    <circle cx="332" cy="385" r="42" fill="#6b7280" stroke="#000" strokeWidth="16" />
    
    {/* Inner Circles for Pulleys */}
    <circle cx="256" cy="285" r="12" fill="#1f2937" />
    <circle cx="180" cy="385" r="12" fill="#1f2937" />
    <circle cx="332" cy="385" r="12" fill="#1f2937" />
  </svg>
);

export const CarCard: React.FC<CarCardProps> = ({ car, onRemove }) => {
  return (
    <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl transition-all hover:border-blue-500/50 group overflow-hidden flex flex-col">
      {/* Car Image Header */}
      <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
        {car.imageUrl ? (
          <img 
            src={car.imageUrl} 
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700">
            <i className="fa-solid fa-car text-5xl opacity-20"></i>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={onRemove}
            className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
          >
            <i className="fa-solid fa-trash-can text-sm"></i>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-1">{car.brand}</div>
          <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1">{car.model}</h3>
          <span className="bg-slate-700 px-3 py-1 rounded-full text-xs font-medium text-slate-300">Ano {car.year}</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-600 shadow-inner">
              <EngineIcon />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs text-slate-400">Motor</div>
              <div className="text-sm font-medium truncate">{car.engine}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-600 shadow-inner">
              <i className="fa-solid fa-bolt text-yellow-400 text-xl"></i>
            </div>
            <div className="overflow-hidden">
              <div className="text-xs text-slate-400">Potência</div>
              <div className="text-sm font-medium truncate">{car.power}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-600 shadow-inner">
              <i className="fa-solid fa-sack-dollar text-green-400 text-xl"></i>
            </div>
            <div className="overflow-hidden">
              <div className="text-xs text-slate-400">Preço Est.</div>
              <div className="text-sm font-semibold text-green-400 truncate">{car.price}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute -bottom-10 -right-10 text-slate-700/5 text-9xl font-black pointer-events-none italic">
        {car.brand.charAt(0)}
      </div>
    </div>
  );
};
