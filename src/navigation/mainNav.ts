import type { ComponentProps } from 'react';
import type MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { Strings } from '@/localization/strings';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface MainNavItem {
  key: keyof Strings['nav'];
  href: '/' | '/channels' | '/search' | '/favorites' | '/settings';
  icon: IconName;
  iconActive: IconName;
}

/** Same five destinations on the TV side rail and the phone bottom bar (Stitch). */
export const MAIN_NAV: readonly MainNavItem[] = [
  { key: 'home', href: '/', icon: 'home', iconActive: 'home' },
  { key: 'channels', href: '/channels', icon: 'live-tv', iconActive: 'live-tv' },
  { key: 'search', href: '/search', icon: 'search', iconActive: 'search' },
  { key: 'favorites', href: '/favorites', icon: 'favorite-border', iconActive: 'favorite' },
  { key: 'settings', href: '/settings', icon: 'settings', iconActive: 'settings' },
];

export function isActive(pathname: string, href: MainNavItem['href']) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}
