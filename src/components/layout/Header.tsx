import { Search } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { SearchField } from '@/components/ui/SearchField';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';
import { NAV_ITEMS } from './navigation';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onExplore = pathname.startsWith('/explore');

  return (
    <header className="border-line bg-paper/85 supports-[backdrop-filter]:bg-paper/75 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                  isActive ? 'bg-surface-sunken text-ink' : 'text-ink-muted hover:text-ink',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {/* The explore page has its own large search field. */}
          {!onExplore && (
            <SearchField
              value=""
              onSubmit={(q) => navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore')}
              className="mr-2 hidden w-64 lg:block xl:w-80"
            />
          )}
          {!onExplore && (
            <Link
              to="/explore"
              aria-label="Search"
              title="Search"
              className="text-ink-muted hover:bg-surface-sunken hover:text-ink inline-flex size-11 items-center justify-center rounded-full transition-colors lg:hidden"
            >
              <Search aria-hidden className="size-5" />
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
