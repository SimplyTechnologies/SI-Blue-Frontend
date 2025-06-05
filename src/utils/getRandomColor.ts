import { avatarColors } from "./constants";

export const getColorFromName = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % avatarColors.length;
  return avatarColors[index];
};