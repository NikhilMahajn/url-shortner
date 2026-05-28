'use client';

import { useState, useEffect } from 'react';
import { Copy, Github, QrCode, Loader2 } from 'lucide-react';
import { urlService, userService } from '@/lib/api-service';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ShortenerForm from '@/components/ShortenerForm';
import ResultDisplay from '@/components/ResultDisplay';
import RecentLinks from '@/components/RecentLinks';
import Footer from '@/components/Footer';


interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode?: string;
  createdAt: Date;
}

export default function Page() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shortResult, setShortResult] = useState<Link | null>(null);
  const [copied, setCopied] = useState(false);


  const getDeviceId = () => {
    let deviceId = localStorage.getItem("device_id");

    if (!deviceId) {
      deviceId = Math.floor(
        1000000 + Math.random() * 9000000
      ).toString();

      localStorage.setItem("device_id", deviceId);
    }

    return Number(deviceId);
  };

  useEffect(() => {
    const loadUserUrls = async () => {
      try {
        const response = await urlService.getUrlById(getDeviceId());
        
        const mappedLinks: Link[] = response.data.map((url) => ({
          id: url.id.toString(),
          originalUrl: url.original_url,
          shortUrl: url.short_url,
          shortCode: url.short_url,
          createdAt: new Date(url.created_at),
        }));
        
        setLinks(mappedLinks);
      } catch (error) {
        console.error('Error loading user URLs:', error);
      }
    };

    loadUserUrls();
  }, []);

  
  const handleShorten = async (longUrl: string) => {
    setIsLoading(true);
    
    try {
      const response = await urlService.createUrl({
        url: longUrl,
        user_id: getDeviceId()
      });
      
      const newLink: Link = {
        id: response.data.id,
        originalUrl: response.data.original_url,
        shortUrl: response.data.short_url,
        shortCode: response.data.short_url,
        createdAt: response.data.created_at,
      };
      
      setShortResult(newLink);
      setLinks([newLink, ...links]);
      setCopied(false);
    } catch (error) {
      console.error('Error shortening URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    if (shortResult?.id === id) {
      setShortResult(null);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
        <HeroSection />
        
        <div className="w-full max-w-2xl space-y-10">
          {/* Shortener Card */}
          <ShortenerForm 
            onShorten={handleShorten}
            isLoading={isLoading}
          />
          
          {/* Result Display */}
          {shortResult && (
            <ResultDisplay 
              link={shortResult}
              isCopied={copied}
              onCopy={() => copyToClipboard(`${process.env.NEXT_PUBLIC_FE_URL}/${shortResult.shortUrl}`)}
              shortCode={shortResult.shortUrl}
            />
          )}
        </div>
      </div>

      {/* Recent Links Section */}
      {links.length > 0 && (
        <div className="bg-zinc-50 border-t border-zinc-200 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <RecentLinks 
              links={links}
              onCopy={copyToClipboard}
              onDelete={deleteLink}
            />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
