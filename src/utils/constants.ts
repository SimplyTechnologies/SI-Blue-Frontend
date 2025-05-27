import { NothingToShowCarIcon } from '@/assets/svgIconComponents/NothingToShowCarIcon';
import { NothingToShowFavoriteIcon } from '@/assets/svgIconComponents/NothingToShowFavoriteIcon';
import type { VehicleTab } from '@/types/Vehicle';

export const pathTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vehicles': 'Vehicles',
  '/users': 'Users',
  '/customers': 'Customers',
  '/my-profile': 'Account',
};

export const availabilityOptions = [
  { name: 'In Stock', id: 'In Stock' },
  { name: 'Sold', id: 'Sold' },
];

export const vehicleTabs: VehicleTab[] = ['vehicles', 'favorites'];

export const nothingToShowOptions = {
  vehicles: {
    title: 'There are no vehicles to display',
    subtitle: 'You can add vehicles and set up specific zones to track their locations and statuses.',
    icon: NothingToShowCarIcon,
  },
  favorites: {
    title: 'There are no favorite vehicles',
    subtitle: 'To quickly access more information about vehicles, consider adding them to your favorites.',
    icon: NothingToShowFavoriteIcon,
  },
};
