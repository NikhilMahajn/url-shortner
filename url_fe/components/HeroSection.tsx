'use client';

export default function HeroSection() {
  return (
    <div className="text-center space-y-6 mb-16 pt-4">
      <div className="space-y-4">
        <h2 className="text-balance text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white">
          Shorten Your Links.
          <br />
          <span className="text-black dark:text-white">Expand Your Reach.</span>
        </h2>
        <p className="text-pretty text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Transform long URLs into memorable short links in seconds. Perfect for sharing, tracking, and making your content more accessible.
        </p>
      </div>
    </div>
  );
}
