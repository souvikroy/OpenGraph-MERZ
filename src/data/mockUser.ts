import type { User } from '../types';

export const mockCurrentUser: User = {
  id: 'rep-001',
  name: 'James Mitchell',
  email: 'james.mitchell@merz.ae',
  role: 'rep',
  territory: 'Dubai',
  market: 'UAE',
};

export const mockUsers: User[] = [
  {
    id: 'rep-001',
    name: 'James Mitchell',
    email: 'james.mitchell@merz.ae',
    role: 'rep',
    territory: 'Dubai',
    market: 'UAE',
  },
  {
    id: 'rep-002',
    name: 'Sarah Al-Khoury',
    email: 'sarah.al-khoury@merz.ae',
    role: 'rep',
    territory: 'Riyadh',
    market: 'KSA',
  },
  {
    id: 'rep-003',
    name: 'Omar Hassan',
    email: 'omar.hassan@merz.ae',
    role: 'rep',
    territory: 'Abu Dhabi',
    market: 'UAE',
  },
  {
    id: 'mgr-001',
    name: 'Bahaa (Sales Director)',
    email: 'bahaa@merz.ae',
    role: 'manager',
    territory: 'Dubai',
    market: 'UAE',
  },
];
