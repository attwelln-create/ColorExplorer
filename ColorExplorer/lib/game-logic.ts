export type ColorInfo = {
  id: string;
  name: string;
  spanishName: string;
  hex: string;
  isDark: boolean;
};

export const COLORS: ColorInfo[] = [
  { id: 'red', name: 'Red', spanishName: 'Rojo', hex: '#FF0000', isDark: true },
  { id: 'blue', name: 'Blue', spanishName: 'Azul', hex: '#1565C0', isDark: true },
  { id: 'purple', name: 'Purple', spanishName: 'Púrpura', hex: '#7B1FA2', isDark: true },
  { id: 'yellow', name: 'Yellow', spanishName: 'Amarillo', hex: '#FFD700', isDark: false },
  { id: 'orange', name: 'Orange', spanishName: 'Naranja', hex: '#FF8C00', isDark: false },
  { id: 'brown', name: 'Brown', spanishName: 'Marrón', hex: '#8B4513', isDark: true },
  { id: 'pink', name: 'Pink', spanishName: 'Rosa', hex: '#FF80AB', isDark: false },
  { id: 'black', name: 'Black', spanishName: 'Negro', hex: '#000000', isDark: true },
  { id: 'white', name: 'White', spanishName: 'Blanco', hex: '#FFFFFF', isDark: false },
  { id: 'green', name: 'Green', spanishName: 'Verde', hex: '#2E7D32', isDark: true },
];

export const calculateStars = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 3;
  if (percentage >= 50) return 2;
  return 1;
};

export const getRandomOptions = (correctColor: ColorInfo, allColors: ColorInfo[], count: number = 4) => {
  const others = allColors.filter(c => c.id !== correctColor.id);
  const shuffled = [...others].sort(() => 0.5 - Math.random());
  const options = [correctColor, ...shuffled.slice(0, count - 1)];
  return options.sort(() => 0.5 - Math.random());
};
