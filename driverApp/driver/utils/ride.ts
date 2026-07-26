export function getRideAddress(value: any, fallback: string) {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (value?.address && typeof value.address === 'string') {
    return value.address;
  }

  return fallback;
}

export function getRideDistanceKm(value: any) {
  if (typeof value === 'number') {
    return Math.round((value / 1000) * 10) / 10;
  }

  return 0;
}
