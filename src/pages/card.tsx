import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { cardData } from '@/data/cardData';
import QRCode from 'qrcode';

export default function BusinessCard() {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(
      `${cardData.website}/card`,
      {
        width: 200,
        margin: 2,
        color: {
          dark: '#f0b90b',
          light: '#1e2329',
        },
      },
      (err, url) => {
        if (!err) setQrDataUrl(url);
      }
    );
  }, []);

  const generateVCard = useCallback(() => {
    const vcf = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'PRODID:-//0xShinyui//Card//ZH',
      `FN;CHARSET=UTF-8:${cardData.name}`,
      `TITLE;CHARSET=UTF-8:${cardData.title}`,
      `EMAIL:${cardData.email}`,
      `TEL;TYPE=CELL:${cardData.phone}`,
      `X-SOCIALPROFILE;TYPE=telegram:${cardData.telegram}`,
      `X-LINE:${cardData.line}`,
      `URL:${cardData.website}`,
      `NOTE;CHARSET=UTF-8:${cardData.bio}`,
      'END:VCARD',
    ];

    const blob = new Blob([vcf.join('\n')], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '0xshinyui.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const divider = (
    <div className="border-t my-6" style={{ borderColor: 'var(--border-color)' }} />
  );

  const contacts: { label: string; value: string; copyValue: string; field: string; href?: string }[] = [
    { label: 'Email', value: cardData.email, copyValue: cardData.email, field: 'email' },
    { label: 'Phone', value: cardData.phone, copyValue: cardData.phone, field: 'phone' },
    { label: 'Telegram', value: `@${cardData.telegram}`, copyValue: `https://t.me/${cardData.telegram}`, href: `https://t.me/${cardData.telegram}`, field: 'telegram' },
    { label: 'LINE', value: cardData.line, copyValue: cardData.line, field: 'line' },
  ];

  return (
    <Layout
      title="電子名片 - 0xShinyui"
      description="0xShinyui 的個人電子名片"
      canonical="/card"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card padding="lg">
          {/* Avatar + Identity */}
          <div className="text-center mb-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4"
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--background)',
                border: '3px solid var(--accent-gold-dark)',
              }}
            >
              0x
            </div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {cardData.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>{cardData.title}</p>
          </div>

          {divider}

          {/* Bio */}
          <div className="text-center">
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {cardData.bio}
            </p>
          </div>

          {divider}

          {/* Skills */}
          <div>
            <h2
              className="text-sm font-semibold mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              專業技能
            </h2>
            <div className="flex flex-wrap gap-2">
              {cardData.skills.map((skill) => (
                <span
                  key={skill.label}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 cursor-default"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    borderColor: 'var(--accent-gold)',
                    color: 'var(--accent-gold)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
                    e.currentTarget.style.color = 'var(--background)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--card-background)';
                    e.currentTarget.style.color = 'var(--accent-gold)';
                  }}
                >
                  {skill.emoji} {skill.label}
                </span>
              ))}
            </div>
          </div>

          {divider}

          {/* Contact */}
          <div>
            <h2
              className="text-sm font-semibold mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              聯絡方式
            </h2>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.field} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-medium w-16"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {contact.label}
                    </span>
                    {'href' in contact ? (
                      <a
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300"
                        style={{ color: 'var(--accent-gold)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--accent-gold-dark)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--accent-gold)';
                        }}
                      >
                        {contact.value}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {contact.value}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(contact.copyValue, contact.field)}
                    className="px-3 py-1 rounded text-sm border transition-colors duration-300 shrink-0"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-gold)';
                      e.currentTarget.style.color = 'var(--accent-gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {copiedField === contact.field ? '已複製' : '複製'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {divider}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={generateVCard}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--background)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-gold-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
              }}
            >
              下載 vCard
            </button>
            <button
              onClick={() => copyToClipboard(`${cardData.website}/card`, 'link')}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors duration-300"
              style={{
                borderColor: 'var(--accent-gold)',
                color: 'var(--accent-gold)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
                e.currentTarget.style.color = 'var(--background)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--accent-gold)';
              }}
            >
              {copiedField === 'link' ? '已複製' : '複製連結'}
            </button>
          </div>

          {/* QR Code */}
          {qrDataUrl && (
            <>
              {divider}
              <div className="text-center">
                <h2
                  className="text-sm font-semibold mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  掃描 QR Code
                </h2>
                <div
                  className="inline-block p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--card-background)' }}
                >
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="rounded"
                  />
                </div>
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  掃描即可開啟電子名片
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}
