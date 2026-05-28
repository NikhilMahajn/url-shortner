'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { urlService } from '@/lib/api-service';
import { Loader2 } from 'lucide-react';

export default function RedirectPage() {
  const params = useParams();
  const code = params?.code as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
	if (!code) return;

	const handleRedirect = async () => {
	  try {
		setLoading(true);
		const response = await urlService.getByShortcode(code);
		const { original_url } = response.data;

		if (original_url) {
		  
		  window.location.href = original_url;
		} else {
		  setError('URL not found');
		}
	  } catch (err) {
		console.error('Redirect error:', err);
		setError('Failed to redirect. URL might not exist.');
		setLoading(false);
	  }
	};

	handleRedirect();
  }, [code]);

  if (loading) {
	return (
	  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-950">
		<div className="flex flex-col items-center gap-4">
		  <Loader2 className="w-8 h-8 animate-spin text-black dark:text-white" />
		  <p className="text-zinc-600 dark:text-zinc-400">Redirecting...</p>
		</div>
	  </div>
	);
  }

  if (error) {
	return (
	  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-950">
		<div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
		  <h1 className="text-2xl font-bold text-black dark:text-white">Oops!</h1>
		  <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
		  <a
			href="/"
			className="mt-4 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
		  >
			Go Home
		  </a>
		</div>
	  </div>
	);
  }

  return null;
}
