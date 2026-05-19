import React, { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  requiredCount?: number;
  filledCount?: number;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string;
  allowMultiple?: boolean;
}

export default function Accordion({
  items,
  defaultOpen,
  allowMultiple = false,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    defaultOpen ? new Set([defaultOpen]) : new Set()
  );

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (allowMultiple) {
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      } else {
        // Single open mode - close all, open clicked
        newSet.clear();
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border transition-all duration-300"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: isOpen ? 'var(--accent-cyan)' : 'var(--border-color)',
            }}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-200 hover:bg-opacity-50"
              style={{
                backgroundColor: isOpen ? 'var(--hover-background)' : 'transparent',
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: isOpen ? 'var(--accent-cyan)' : 'var(--text-primary)' }}
                  >
                    {item.title}
                  </h3>
                  {(item.requiredCount !== undefined || item.filledCount !== undefined) && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {item.filledCount !== undefined && `已填寫: ${item.filledCount} 項`}
                      {item.requiredCount !== undefined && ` • 必填: ${item.requiredCount} 項`}
                    </p>
                  )}
                </div>
              </div>
              <svg
                className={`transition-transform duration-300`}
                style={{
                  color: 'var(--accent-cyan)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-2">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
