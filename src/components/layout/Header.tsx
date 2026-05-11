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
  { label: '名片', href: '/card' },
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
      style={{
        backgroundColor: 'var(--card-background)',
        borderBottom: '1px solid var(--border-color)',
      }}
      className="shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="text-xl font-bold"
            style={{ color: 'var(--accent-gold)' }}
          >
            0xShinyui
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 text-base">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-1 transition-all duration-300 hover:scale-105 ${
                  router.pathname === item.href
                    ? 'font-medium'
                    : 'border-transparent hover:border-opacity-50'
                }`}
                style={{
                  borderBottomColor:
                    router.pathname === item.href
                      ? 'var(--accent-gold)'
                      : 'transparent',
                  color:
                    router.pathname === item.href
                      ? 'var(--accent-gold)'
                      : 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  if (router.pathname !== item.href) {
                    e.currentTarget.style.color = 'var(--accent-gold)';
                    e.currentTarget.style.borderBottomColor =
                      'var(--accent-gold)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (router.pathname !== item.href) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderBottomColor = 'transparent';
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg transition-colors duration-200"
            style={{
              color: 'var(--text-primary)',
              backgroundColor: isMobileMenuOpen
                ? 'var(--accent-gold)'
                : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isMobileMenuOpen) {
                e.currentTarget.style.backgroundColor = 'var(--border-color)';
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

        {/* Mobile Navigation Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          navItems={navItems}
        />
      </div>
    </header>
  );
}
