import { useColorScheme } from 'react-native';

export const lightColors = {
  bg: '#FAF6EE',
  surface: '#F5EDD8',
  surface2: '#EDE0C4',
  border: '#D9C9A8',
  border2: '#C9B896',
  text: '#2C1A0E',
  textSecondary: '#6B4C2A',
  textMuted: '#A08060',
  gold: '#C9A84C',
  goldDark: '#9A7A2E',
  brick: '#B5451B',
  brickDark: '#7A2E0F',
  white: '#FFFFFF',
  tabBar: '#FAF6EE',
  tabBorder: '#D9C9A8',
};

export const darkColors: typeof lightColors = {
  bg: '#1A1008',
  surface: '#2A1A0C',
  surface2: '#3A2518',
  border: '#4A3020',
  border2: '#5A3F2A',
  text: '#F5EDD8',
  textSecondary: '#D9C9A8',
  textMuted: '#A08060',
  gold: '#C9A84C',
  goldDark: '#E8D5A3',
  brick: '#D4613A',
  brickDark: '#B5451B',
  white: '#2A1A0C',
  tabBar: '#1A1008',
  tabBorder: '#4A3020',
};

export type AppColors = typeof lightColors;

export function useTheme(): { colors: AppColors; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { colors: isDark ? darkColors : lightColors, isDark };
}
