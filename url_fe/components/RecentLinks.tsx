'use client';

import { Copy, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
}

interface RecentLinksProps {
  links: Link[];
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
}

export default function RecentLinks({ links, onCopy, onDelete }: RecentLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    onCopy(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Recent Links</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Your {links.length} most recent shortened URLs</p>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-300 dark:border-zinc-700">
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">Original URL</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">Short URL</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">Created</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors duration-150">
                <td className="px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300 truncate max-w-xs" title={link.originalUrl}>
                  {truncateUrl(link.originalUrl)}
                </td>
                <td className="px-4 py-4 text-sm font-mono font-semibold text-black dark:text-white">{link.shortUrl}</td>
                <td className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-500">{formatDate(link.createdAt)}</td>
                <td className="px-4 py-4 text-right flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCopy(link.shortUrl, link.id)}
                    className={`transition-all duration-200 rounded-sm ${
                      copiedId === link.id
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {copiedId === link.id ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(link.id)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-sm"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm space-y-3"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Original URL</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 break-words">{truncateUrl(link.originalUrl, 60)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Short URL</p>
              <p className="text-sm font-mono font-semibold text-black dark:text-white">{link.shortUrl}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-600 dark:text-zinc-500">{formatDate(link.createdAt)}</p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleCopy(link.shortUrl, link.id)}
                  className={`transition-all duration-200 rounded-sm ${
                    copiedId === link.id
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {copiedId === link.id ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(link.id)}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-sm"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
