import { ReactNode } from 'react';

type CodeBlockProps = {
  children: ReactNode;
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="rounded p-4 overflow-x-auto my-6 bg-[#000000] text-[var(--text-primary)]">
      {children}
    </pre>
  );
}
