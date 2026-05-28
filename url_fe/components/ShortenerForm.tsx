'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShortenerFormProps {
  onShorten: (url: string) => Promise<void>;
  isLoading: boolean;
}

export default function ShortenerForm({ onShorten, isLoading }: ShortenerFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    await onShorten(url);
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="space-y-2">
        <div className="relative group">
          <Input
            type="url"
            placeholder="Paste your long link here..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            disabled={isLoading}
            className="w-full px-6 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 focus:border-black dark:focus:border-white focus:ring-0 rounded-sm text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-[500]"
          />
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-black font-semibold py-2 px-6 rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              'Shorten'
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-500 font-medium">{error}</p>}
      </div>
    </form>
  );
}
