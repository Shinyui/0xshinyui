import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavItem } from './Header';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  navItems,
}: MobileMenuProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <nav
      className="md:hidden mt-4 rounded-lg border p-2"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`px-3 py-2.5 rounded-md transition-all duration-200 ${
              router.pathname === item.href ? 'font-medium' : ''
            }`}
            style={{
              backgroundColor:
                router.pathname === item.href
                  ? 'var(--accent-cyan)'
                  : 'transparent',
              color:
                router.pathname === item.href
                  ? 'var(--background)'
                  : 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              if (router.pathname !== item.href) {
                e.currentTarget.style.backgroundColor = 'var(--hover-background)';
              }
            }}
            onMouseLeave={(e) => {
              if (router.pathname !== item.href) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
