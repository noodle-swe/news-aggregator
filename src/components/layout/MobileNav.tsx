import { NavLink } from 'react-router';
import { cn } from '@/utils/cn';
import { NAV_ITEMS } from './navigation';

/** Thumb-friendly bottom tab bar for small screens. */
export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className="pb-safe border-line bg-paper/90 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-ink' : 'text-ink-subtle hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-200',
                      isActive && 'bg-surface-sunken',
                    )}
                  >
                    <Icon aria-hidden className="size-5" strokeWidth={isActive ? 2.25 : 1.75} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
