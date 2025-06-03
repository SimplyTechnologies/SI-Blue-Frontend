export function usePaginationRange(current: number, total: number, siblingCount = 1): (number | 'dots')[] {
  const DOTS = 'dots' as const;
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= total) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(current - siblingCount, 1);
  const rightSiblingIndex = Math.min(current + siblingCount, total);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < total - 2;

  const firstPageIndex = 1;
  const lastPageIndex = total;

  const range: (number | 'dots')[] = [];

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
    return [...leftRange, DOTS, total];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => total - (3 + 2 * siblingCount) + i + 1);
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from({ length: 2 * siblingCount + 1 }, (_, i) => leftSiblingIndex + i);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return range;
}
