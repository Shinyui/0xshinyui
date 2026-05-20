import Link from 'next/link';
import { getCategoryDisplayName } from '@/utils/category';

const FOOTER_CATEGORIES = ['pm', 'dev', 'opt', 'trading', 'iGaming'];

const TOOL_LINKS = [
  { label: '工具總覽', href: '/tools' },
  { label: '2FA 驗證碼', href: '/2fa' },
  { label: 'IP 地址查詢', href: '/ip' },
  { label: '商店', href: '/shop' },
];

const EXTERNAL_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'KOL 嚴選', href: 'https://kol.0xshinyui.xyz' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: 'rgba(11, 14, 17, 0.6)',
      }}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="grid h-8 w-8 place-items-center rounded-md text-xs font-black"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-mint), var(--accent-positive))',
                  color: 'var(--background)',
                }}
              >
                0x
              </span>
              <span
                className="text-base font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                0xShinyui
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              產品決策、工程實作與運營策略的實戰拆解。
            </p>
            <p
              className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: 'var(--accent-mint)' }}
            >
              <span className="status-dot" />
              Live · Test · Iterate
            </p>
          </div>

          <FooterColumn title="Content">
            {FOOTER_CATEGORIES.map((cat) => (
              <FooterLink key={cat} href={`/category/${cat}`}>
                {getCategoryDisplayName(cat)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Tools">
            {TOOL_LINKS.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="External">
            {EXTERNAL_LINKS.map((link) => (
              <FooterLink
                key={link.href}
                href={link.href}
                external={link.href.startsWith('http')}
              >
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div
          className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <p>© {year} 0xShinyui. All rights reserved.</p>
          <p
            className="font-mono tabular-nums"
            style={{ color: 'var(--text-muted)' }}
          >
            v2.0 · UI/UX redesign · Bitget palette
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em]"
        style={{ color: 'var(--text-secondary)' }}
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    'text-sm transition-colors duration-200 inline-block';
  const style = { color: 'var(--text-muted)' };
  const onMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'var(--accent-mint)';
  };
  const onMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'var(--text-muted)';
  };

  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          style={style}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {children}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className={className}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </Link>
    </li>
  );
}
