'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * A responsive Navbar component that correctly collapses navigation links
 * before they collide with the logo and user action buttons.
 *
 * This version uses conditional rendering combined with Tailwind's responsive
 * classes to handle the collapsing behavior without using a separate useEffect hook.
 */
export default function Navbar() {
  const { user, userRole, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLandingPage = pathname === '/';

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-6 shadow-md relative h-24">
      <div className="flex items-center justify-between px-4 sm:px-8 w-full">
        <div className="flex items-center flex-shrink-0">
          {isLandingPage ? (
            <Link href="/dashboard" className="text-xl sm:text-3xl font-bold text-[var(--color-accent-blue)]">
              Hack Club
            </Link>
          ) : (
            <Link href="/" className="text-xl sm:text-3xl font-bold text-[var(--color-accent-blue)]">
              Hack Club
            </Link>
          )}
        </div>
        {isLandingPage ? (
          <div className="hidden lg:flex flex-1 justify-center items-center px-4">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Link href="#about" className="text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-sm lg:text-xl xl:text-2xl font-bold transition duration-200">About Us</Link>
              <Link href="#learn" className="text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-sm lg:text-xl xl:text-2xl font-bold transition duration-200">What You'll Learn</Link>
              <Link href="#faq" className="text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-sm lg:text-xl xl:text-2xl font-bold transition duration-200">FAQ</Link>
              <Link href="#mentors" className="text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-sm lg:text-xl xl:text-2xl font-bold transition duration-200">Mentors</Link>
            </div>
          </div>
        ) : (
          user && (
            <div className="hidden 2xl:flex flex-1 justify-center items-center px-4">
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link href="/events" className="text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-sm lg:text-xl xl:text-2xl font-bold transition duration-200">
                  Events
                </Link>
                <Link href="/curriculum" className="text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-sm lg:text-xl xl:text-2xl font-bold transition duration-200">
                  Curriculum
                </Link>
                <Link href="/announcements" className="text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-sm lg:text-xl xl:text-2xl font-bold transition duration-200">
                  Announcements
                </Link>
                <Link href="/messages" className="text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-sm lg:text-xl xl:text-2xl font-bold transition duration-200">
                  Messages
                </Link>
              </div>
            </div>
          )
        )}
        {isLandingPage ? (
          <div className="hidden lg:flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {user ? (
              <>
                <span className="text-gray-300 truncate">Welcome, {user.username}</span>
                {userRole && (
                  <span className="bg-[var(--color-accent-green)] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                )}
                <Link href={(userRole === 'admin' || userRole === 'mentor') ? '/admin' : '/dashboard'} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
                  Login
                </Link>
                <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="hidden 2xl:flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {user ? (
              <>
                <span className="text-gray-300 truncate">Welcome, {user.username}</span>
                {userRole && (
                  <span className="bg-[var(--color-accent-green)] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                )}
                <Link href={(userRole === 'admin' || userRole === 'mentor') ? '/admin' : '/dashboard'} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
                  Login
                </Link>
                <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
        {isLandingPage ? (
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
              Menu
            </button>
          </div>
        ) : (
          <div className="2xl:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-sm">
              Menu
            </button>
          </div>
        )}
        {isMenuOpen && (
          <div className="absolute top-24 right-4 mt-2 w-56 rounded-md shadow-lg bg-gray-800 z-20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isLandingPage ? (
                <>
                  <Link href="#about" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-base font-medium">About Us</Link>
                  <Link href="#learn" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-base font-medium">What You'll Learn</Link>
                  <Link href="#faq" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-base font-medium">FAQ</Link>
                  <Link href="#mentors" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-base font-medium">Mentors</Link>
                  {user ? (
                    <>
                      <Link href={(userRole === 'admin' || userRole === 'mentor') ? '/admin' : '/dashboard'} onClick={() => setIsMenuOpen(false)} className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-base transition duration-200 mt-4 text-center">
                        Dashboard
                      </Link>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md text-base transition duration-200 mt-2">
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-base transition duration-200 mt-4 text-center">
                        Login
                      </Link>
                      <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-md text-base transition duration-200 mt-2 text-center">
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              ) : (
                user ? (
                  <>
                    <Link href="/events" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-base font-medium">
                      Events
                    </Link>
                    <Link href="/curriculum" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-base font-medium">
                      Curriculum
                    </Link>
                    <Link href="/announcements" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-base font-medium">
                      Announcements
                    </Link>
                    <Link href="/messages" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-[var(--color-accent-blue)] px-3 py-2 rounded-md text-base font-medium">
                      Messages
                    </Link>
                    <Link href={(userRole === 'admin' || userRole === 'mentor') ? '/admin' : '/dashboard'} onClick={() => setIsMenuOpen(false)} className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-base transition duration-200 mt-4 text-center">
                      Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md text-base transition duration-200 mt-2">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-base transition duration-200 mt-4 text-center">
                      Login
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-md text-base transition duration-200 mt-2 text-center">
                      Sign Up
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
