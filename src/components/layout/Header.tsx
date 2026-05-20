import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MobileMenu from './MobileMenu';

export interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: '首頁', href: '/' },
  { label: '工具總覽', href: '/tools' },
  { label: '商店', href: '/shop' },
  { label: '關於我', href: '/about' },
];

export default function Header({ navItems = defaultNavItems }: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        backgroundColor: 'rgba(11, 14, 17, 0.86)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.42)',
      }}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            style={{ color: 'var(--text-primary)' }}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-md text-sm font-black"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-mint), var(--accent-positive))',
                color: 'var(--background)',
                boxShadow: '0 0 24px var(--glow-mint)',
              }}
            >
              0x
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold">0xShinyui</span>
              <span
                className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em]"
                style={{ color: 'var(--text-muted)' }}
              >
                Product / Dev / Ops
              </span>
            </span>
          </Link>

          <div
            className="hidden xl:flex items-center gap-4 rounded-lg border px-4 py-2 font-mono text-[11px] tabular-nums"
            style={{
              backgroundColor: 'rgba(20, 24, 29, 0.72)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            aria-hidden
          >
            <div className="flex items-center gap-1.5">
              <span
                className="text-[9px] uppercase tracking-[0.22em]"
                style={{ color: 'var(--text-muted)' }}
              >
                IDX
              </span>
              <span style={{ color: 'var(--text-primary)' }}>0x.SHIN</span>
              <span className="ticker-up">+2.18%</span>
            </div>
            <div
              className="h-3 w-px"
              style={{ backgroundColor: 'var(--border-strong)' }}
            />
            <div className="flex items-center gap-1.5">
              <span
                className="text-[9px] uppercase tracking-[0.22em]"
                style={{ color: 'var(--text-muted)' }}
              >
                VOL
              </span>
              <span style={{ color: 'var(--text-primary)' }}>24h</span>
              <span className="ticker-up">▲</span>
            </div>
          </div>

          <nav
            className="hidden md:flex items-center gap-1 rounded-lg border p-1 text-sm"
            style={{
              backgroundColor: 'rgba(20, 24, 29, 0.72)',
              borderColor: 'var(--border-color)',
            }}
          >
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-4 py-2 font-medium transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-mint)' : 'transparent',
                    color: isActive ? 'var(--background)' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 0 22px var(--glow-mint)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--hover-background)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md border transition-colors duration-200"
            style={{
              borderColor: 'var(--border-color)',
              color: isMobileMenuOpen ? 'var(--background)' : 'var(--text-primary)',
              backgroundColor: isMobileMenuOpen
                ? 'var(--accent-mint)'
                : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isMobileMenuOpen) {
                e.currentTarget.style.backgroundColor = 'var(--hover-background)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobileMenuOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          navItems={navItems}
        />
      </div>
    </header>
  );
}
