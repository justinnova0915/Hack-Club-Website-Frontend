'use client';

import { useState, useEffect, } from 'react';
import { Lightbulb, Code, Gamepad } from 'lucide-react';
import Image from 'next/image';

/**
 * This is a basic page template for a Next.js website, now with some
 * sample content to get you started.
 *
 * You can rename the component and file to match the page you are creating.
 * For example, if you are making an "About" page, you would name this component
 * 'AboutPage' and save the file as 'about.tsx' in your app/ directory.
 *
 * It uses Tailwind CSS classes for a responsive and clean layout.
 */
export default function AboutPageTemplate() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-300">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-20 px-8 flex flex-col">
      <header className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-blue-500 fade-in-down">
          How did we get here?
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 fade-in-down delay-200">
          you found the secret page, here is a gif of miku ¯\_(ツ)_/¯
        </p>
      </header>
      <main className="flex-grow max-w-6xl mx-auto w-full">
        <Image src={"/images/tenor.gif"} alt="Animated GIF" width={600} height={400} className="mx-auto mb-8 rounded-lg shadow-lg" />
      </main>
    </div>
  );
}
