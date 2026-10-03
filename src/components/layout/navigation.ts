import type { LucideIcon } from 'lucide-react';
import { Compass, Newspaper, SlidersHorizontal } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** Single source of truth for the desktop header nav and the mobile tab bar. */
export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'For you', icon: Newspaper },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/preferences', label: 'Preferences', icon: SlidersHorizontal },
];
