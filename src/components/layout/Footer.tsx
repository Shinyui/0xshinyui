export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t px-4 py-8 text-sm"
      style={{
        color: 'var(--text-muted)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>©{year} 0xShinyui. All rights reserved.</p>
        <p>
          Product notes, dev logs, and operations playbooks.
          <span className="ml-2" style={{ color: 'var(--accent-cyan)' }}>
            Live, test, iterate.
          </span>
        </p>
      </div>
    </footer>
  );
}
