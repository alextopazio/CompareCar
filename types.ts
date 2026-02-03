
export interface CarSpecs {
  brand: string;
  model: string;
  year: number;
  price: string;
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelType: string;
  consumptionCity: string;
  consumptionHighway: string;
  acceleration0to100: string;
  topSpeed: string;
  bootSpace: string;
  dimensions: string;
  weight: string;
  imageUrl?: string;
  // New fields
  rearAirCon: string;
  multimediaSize: string;
  doorQuality: string;
  driverSeatAdjustments: string;
  passengerSeatAdjustments: string;
}

export interface ComparisonInsight {
  pros: string[];
  cons: string[];
  verdict: string;
  targetAudience: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING_CAR = 'LOADING_CAR',
  LOADING_INSIGHTS = 'LOADING_INSIGHTS',
  ERROR = 'ERROR'
}