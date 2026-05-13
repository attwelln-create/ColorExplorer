export type ColorInfo = {
  id: string;
  name: string;
  spanishName: string;
  hex: string;
  isDark: boolean;
};

export type NumberInfo = {
  id: string;
  name: string;
  spanishName: string;
  value: number;
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

export const NUMBERS: NumberInfo[] = [
  { id: '1', name: 'One', spanishName: 'Uno', value: 1 },
  { id: '2', name: 'Two', spanishName: 'Dos', value: 2 },
  { id: '3', name: 'Three', spanishName: 'Tres', value: 3 },
  { id: '4', name: 'Four', spanishName: 'Cuatro', value: 4 },
  { id: '5', name: 'Five', spanishName: 'Cinco', value: 5 },
  { id: '6', name: 'Six', spanishName: 'Seis', value: 6 },
  { id: '7', name: 'Seven', spanishName: 'Siete', value: 7 },
  { id: '8', name: 'Eight', spanishName: 'Ocho', value: 8 },
  { id: '9', name: 'Nine', spanishName: 'Nueve', value: 9 },
  { id: '10', name: 'Ten', spanishName: 'Diez', value: 10 },
];

export const calculateStars = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 3;
  if (percentage >= 50) return 2;
  return 1;
};

export function getRandomOptions<T extends { id: string }>(correctItem: T, allItems: T[], count: number = 4) {
  const others = allItems.filter(c => c.id !== correctItem.id);
  const shuffled = [...others].sort(() => 0.5 - Math.random());
  const options = [correctItem, ...shuffled.slice(0, count - 1)];
  return options.sort(() => 0.5 - Math.random());
}
