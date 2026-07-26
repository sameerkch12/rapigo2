// Design System — RideApp Premium Theme
export const Colors = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#DBEAFE',
  primaryMid: '#93C5FD',

  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2FF',

  text: {
    primary: '#111827',
    secondary: '#475569',
    light: '#94A3B8',
    white: '#FFFFFF',
    cyan: '#2563EB',
  },

  success: '#22C55E',
  successLight: '#DCFCE7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  shadow: 'rgba(37, 99, 235, 0.14)',
  shadowDark: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(17, 24, 39, 0.5)',

  gradient: {
    primary: ['#4F46E5', '#2563EB'],
    soft: ['#EEF2FF', '#F8FAFC'],
    dark: ['#111827', '#312E81'],
    gold: ['#F59E0B', '#EF4444'],
    green: ['#22C55E', '#16A34A'],
  },

  tabBar: {
    bg: '#FFFFFF',
    active: '#2563EB',
    inactive: '#94A3B8',
    border: '#F0F4F8',
  },

  card: {
    bg: '#FFFFFF',
    shadow: 'rgba(37, 99, 235, 0.12)',
    border: '#F0F4F8',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  hero: 34,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
};
