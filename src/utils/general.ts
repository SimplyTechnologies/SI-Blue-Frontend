const avatarColors: string[] = [
    "#EAEAFB",
    "#D8D7F3",
    "#C5C3EC",
    "#B3B0E4",
    "#A09CDC",
    "#8C88D5",
  ];

export const generateStringToColor = (str: string): string => {
    const hash = Array.from(str).reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
};

