'use client';

import { useRef } from 'react';
import { Copy, Check, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
}

interface ResultDisplayProps {
  link: Link;
  isCopied: boolean;
  onCopy: () => void;
  shortCode?: string;
}

export default function ResultDisplay({ link, isCopied, onCopy, shortCode }: ResultDisplayProps) {
  const feUrl = process.env.NEXT_PUBLIC_FE_URL;
  const fullShortUrl = `${feUrl}/${link.shortUrl}`;
  const qrRef = useRef<HTMLDivElement>(null);

  const handleRedirect = () => {
    if (shortCode) {
      window.open(`/${link.shortUrl}`, '_blank');
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `qr-code-${link.shortUrl}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* URL Section */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Your shortened URL</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center justify-between gap-3 p-4 bg-zinc-50 dark:bg-black rounded-sm border border-zinc-200 dark:border-zinc-800">
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-black dark:text-white truncate font-mono">{fullShortUrl}</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-500 truncate mt-1">{link.originalUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 h-full">
            <Button
              onClick={onCopy}
              className={`px-4 rounded-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isCopied
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-black'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="size-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy
                </>
              )}
            </Button>
            {link.shortUrl && (
              <Button
                onClick={handleRedirect}
                variant="outline"
                className="px-4 rounded-sm font-semibold transition-all duration-200 flex items-center gap-2 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                <ExternalLink className="size-4" />
                Visit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            ref={qrRef}
            className="flex-shrink-0 w-28 h-28 bg-white rounded-sm border border-zinc-200 flex items-center justify-center p-2"
          >
            <QRCodeCanvas value={fullShortUrl} size={100} level="H" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">QR Code</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Scan to share</p>
          </div>
        </div>
        <Button
          onClick={downloadQRCode}
          variant="ghost"
          className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-sm flex items-center gap-2"
        >
          <Download className="size-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
