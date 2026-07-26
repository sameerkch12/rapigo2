export const HOME_SERVICES = [
  { id: 'bike', label: 'Bike', icon: 'two-wheeler' },
  { id: 'parcel', label: 'Parcel', icon: 'inventory-2' },
  { id: 'pass', label: 'Pass', icon: 'confirmation-number' },
] as const;

export type HomeServiceId = (typeof HOME_SERVICES)[number]['id'];
