import { NothingToShowCarIcon } from '@/assets/svgIconComponents/NothingToShowCarIcon';
import { NothingToShowCustomersIcon } from '@/assets/svgIconComponents/NothingToShowCustomers';
import { NothingToShowFavoriteIcon } from '@/assets/svgIconComponents/NothingToShowFavoriteIcon';
import { NothingToShowUsersIcon } from '@/assets/svgIconComponents/NothingToShowUsers';
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
  users: {
    title: 'There are no users to display',
    subtitle: 'At the moment, there are no users listed. However, you have the option to manually add new users.',
    icon: NothingToShowUsersIcon,
  },
  customers: {
    title: 'There are no customers to display',
    subtitle: 'All customers will be displayed here.',
    icon: NothingToShowCustomersIcon,
  },
};

export const avatarColors: Array<{ bg: string, color: string }> = [
  {
    bg: '#FFE7D5',
    color: '#FF852D',
  },
  {
    bg: '#EDF1FE',
    color: '#23A1E9',
  },
  {
    bg: '#EBDFFA',
    color: '#9B5DE5',
  },
  {
    bg: '#E7FAF3',
    color: '#0DCF89',
  },
];

