
import React from 'react';
import { CarSpecs } from '../types';

interface ComparisonGridProps {
  cars: CarSpecs[];
}

export const ComparisonGrid: React.FC<ComparisonGridProps> = ({ cars }) => {
  const rows = [
    { label: 'Câmbio', key: 'transmission' },
    { label: 'Combustível', key: 'fuelType' },
    { label: 'Torque', key: 'torque' },
    { label: '0 a 100 km/h', key: 'acceleration0to100' },
    { label: 'Velocidade Máx.', key: 'topSpeed' },
    { label: 'Porta-malas', key: 'bootSpace' },
    { label: 'Consumo Urbano', key: 'consumptionCity' },
    { label: 'Consumo Estrada', key: 'consumptionHighway' },
    { label: 'Ar Cond. Traseiro', key: 'rearAirCon' },
    { label: 'Tela Multimídia', key: 'multimediaSize' },
    { label: 'Acabamento Portas', key: 'doorQuality' },
    { label: 'Ajuste Motorista', key: 'driverSeatAdjustments' },
    { label: 'Ajuste Passageiro', key: 'passengerSeatAdjustments' },
    { label: 'Dimensões', key: 'dimensions' },
    { label: 'Peso', key: 'weight' },
  ];

  if (cars.length === 0) return null;

  return (
    <div className="mt-12 bg-slate-800/30 rounded-3xl border border-slate-700/50 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700">
              <th className="p-6 text-slate-400 font-medium text-sm min-w-[150px]">Atributo</th>
              {cars.map((car, idx) => (
                <th key={idx} className="p-6 text-white font-bold min-w-[200px]">
                  {car.brand} {car.model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-700/20 transition-colors">
                <td className="p-6 text-slate-400 text-sm font-medium">{row.label}</td>
                {cars.map((car, cIdx) => (
                  <td key={cIdx} className="p-6 text-slate-200 text-sm">
                    {car[row.key as keyof CarSpecs] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};