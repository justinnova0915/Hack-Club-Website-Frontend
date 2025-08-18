'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import curriculumData from '@/lib/curriculumData';
interface Activity {
  id: string;
  title: string;
  summary: string;
  type: string;
  instructor: string;
}

interface Lesson {
  id: string;
  week: string;
  software?: Activity;
  hardware?: Activity;
  unified?: Activity;
}

interface Unit {
  id: string;
  title: string;
  duration: string;
  goal: string;
  lessons: Lesson[];
}


export default function CurriculumPage() {
  const { user, loading, userRole } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Map<string, Set<string>>>(new Map());
  const [selectedSidebarItemId, setSelectedSidebarItemId] = useState<string | null>(null);
  const [highlightedSectionId, setHighlightedSectionId] = useState<string | null>(null);
  const isProgrammaticScroll = useRef(false);
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const sidebarRef = useRef<HTMLElement | null>(null);
  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };
  const toggleLesson = (unitId: string, lessonId: string) => {
    setExpandedLessons(prev => {
      const newMap = new Map(prev);
      const lessonsInUnit = new Set(newMap.get(unitId) || []);
      if (lessonsInUnit.has(lessonId)) {
        lessonsInUnit.delete(lessonId);
      } else {
        lessonsInUnit.add(lessonId);
      }
      newMap.set(unitId, lessonsInUnit);
      return newMap;
    });
  };
  const scrollToSection = (id: string) => {
    const element = sectionRefs.current.get(id);

    if (element) {
      const elementRect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollY = elementRect.top + window.scrollY - (viewportHeight / 2) + (elementRect.height / 2);
      isProgrammaticScroll.current = true;

      window.scrollTo({
        top: scrollY,
        behavior: 'smooth'
      });
      setHighlightedSectionId(id);
      setSelectedSidebarItemId(id);
      setIsSidebarOpen(false);
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 700);
    } else {
      console.error(`Error: Element with ID "${id}" not found in sectionRefs.`);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (highlightedSectionId && !isProgrammaticScroll.current) {
        setHighlightedSectionId(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
        if (highlightedSectionId) {
          setHighlightedSectionId(null);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [highlightedSectionId, isSidebarOpen]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex">
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-28 left-4 z-50 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
          title="Expand Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}
      {isSidebarOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 top-21 bg-black opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <aside
        ref={sidebarRef}
        className={`fixed top-21 bottom-0 z-50 w-64 bg-gray-900 border-r border-gray-700 p-4 flex flex-col transition-transform duration-300 transform
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--color-accent-blue)]">Curriculum</h2>
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
              title="Collapse Sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex-grow flex flex-col">
          <nav className="flex-grow overflow-y-auto pr-2">
          {curriculumData.map(unit => (
            <div key={unit.id} className="mb-4">
              <button
                onClick={() => toggleUnit(unit.id)}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-700 transition duration-150 flex items-center justify-between"
              >
                <span className={`font-semibold text-lg text-gray-100`}>
                  {unit.title}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${expandedUnits.has(unit.id) ? 'rotate-90' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {expandedUnits.has(unit.id) && (
                <ul className="pl-4 mt-2 space-y-1">
                  {unit.lessons.map(lesson => (
                    <li key={lesson.id} className="mb-1">
                      <button
                        onClick={() => toggleLesson(unit.id, lesson.id)}
                        className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-700 transition duration-150 flex items-center justify-between"
                      >
                        <span className="text-gray-300">
                          Week {lesson.week}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${expandedLessons.get(unit.id)?.has(lesson.id) ? 'rotate-90' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {expandedLessons.get(unit.id)?.has(lesson.id) && (
                        <ul className="pl-4 mt-1 space-y-1">
                          {lesson.software && (
                            <li>
                              <button
                                onClick={() => scrollToSection(lesson.software!.id)}
                                className={`w-full text-left p-2 rounded-lg transition duration-150 text-gray-400 text-sm
                                           ${selectedSidebarItemId === lesson.software!.id ? 'bg-[var(--color-accent-green)] text-white' : 'hover:bg-gray-700'}`}
                              >
                                {lesson.software.title}
                              </button>
                            </li>
                          )}
                          {lesson.hardware && (
                            <li>
                              <button
                                onClick={() => scrollToSection(lesson.hardware!.id)}
                                className={`w-full text-left p-2 rounded-lg transition duration-150 text-gray-400 text-sm
                                           ${selectedSidebarItemId === lesson.hardware!.id ? 'bg-[var(--color-accent-green)] text-white' : 'hover:bg-gray-700'}`}
                              >
                                {lesson.hardware.title}
                              </button>
                            </li>
                          )}
                          {lesson.unified && (
                            <li>
                              <button
                                onClick={() => scrollToSection(lesson.unified!.id)}
                                className={`w-full text-left p-2 rounded-lg transition duration-150 text-gray-400 text-sm
                                           ${selectedSidebarItemId === lesson.unified!.id ? 'bg-[var(--color-accent-green)] text-white' : 'hover:bg-gray-700'}`}
                              >
                                {lesson.unified.title}
                              </button>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          </nav>
        </div>
      </aside>
      <main
        id="main-content-area"
        className={`flex-grow p-6 md:p-12 overflow-y-auto transition-all duration-300 ease-in-out flex justify-center`}
      >
        <div className="w-full max-w-7xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-[var(--color-accent-blue)] text-center">
          Hack Club Curriculum Plan
        </h1>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <p className="text-lg text-gray-300 mb-6">
            Our comprehensive curriculum is designed to guide you through various aspects of technology, from full-stack web development to AI and robotics.
          </p>

          {curriculumData.map(unit => (
            <section
              key={unit.id}
              id={unit.id}
              ref={el => { sectionRefs.current.set(unit.id, el); }}
              className={`mb-10 pt-4 transition-all duration-300
                         ${highlightedSectionId === unit.id ? 'outline-2 outline-[var(--color-accent-green)] outline-offset-4 rounded-lg' : ''}`}
            >
              <h2 className="text-4xl font-bold mb-4 text-[var(--color-accent-blue)] border-b-2 border-gray-700 pb-4">
                {unit.title}
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                <span className="font-bold">Duration:</span> {unit.duration}
              </p>
              <p className="text-lg text-gray-300 mb-6">
                <span className="font-bold">Goal:</span> {unit.goal}
              </p>

              {unit.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  id={lesson.id}
                  ref={el => { sectionRefs.current.set(lesson.id, el); }}
                  className={`mb-8 pl-4 border-l-2 border-gray-700 transition-all duration-300
                             ${highlightedSectionId === lesson.id ? 'outline-2 outline-[var(--color-accent-green)] outline-offset-4 rounded-lg' : ''}`}
                >
                  <h3 className="text-3xl font-semibold mb-4 text-gray-200">
                    Week {lesson.week}
                  </h3>
                  <div className="space-y-6">
                    {lesson.software && (
                      <div
                        id={lesson.software.id}
                        ref={el => { sectionRefs.current.set(lesson.software!.id, el); }}
                        className={`bg-gray-700 p-4 rounded-lg shadow-inner transition-all duration-300
                                   ${highlightedSectionId === lesson.software.id ? 'outline-2 outline-[var(--color-accent-green)] outline-offset-4' : ''}`}
                      >
                        <h4 className="text-xl font-medium text-[var(--color-accent-green)] mb-2">{lesson.software.title}</h4>
                        <p className="text-gray-300 text-base mb-2">{lesson.software.summary}</p>
                        <p className="text-gray-400 text-sm">
                          <span className="font-bold">Type:</span> {lesson.software.type} | <span className="font-bold">Instructor:</span> {lesson.software.instructor}
                        </p>
                      </div>
                    )}
                    {lesson.hardware && (
                      <div
                        id={lesson.hardware.id}
                        ref={el => { sectionRefs.current.set(lesson.hardware!.id, el); }}
                        className={`bg-gray-700 p-4 rounded-lg shadow-inner transition-all duration-300
                                   ${highlightedSectionId === lesson.hardware.id ? 'outline-2 outline-[var(--color-accent-green)] outline-offset-4' : ''}`}
                      >
                        <h4 className="text-xl font-medium text-[var(--color-accent-green)] mb-2">{lesson.hardware.title}</h4>
                        <p className="text-gray-300 text-base mb-2">{lesson.hardware.summary}</p>
                        <p className="text-gray-400 text-sm">
                          <span className="font-bold">Type:</span> {lesson.hardware.type} | <span className="font-bold">Instructor:</span> {lesson.hardware.instructor}
                        </p>
                      </div>
                    )}
                    {lesson.unified && (
                      <div
                        id={lesson.unified.id}
                        ref={el => { sectionRefs.current.set(lesson.unified!.id, el); }}
                        className={`bg-gray-700 p-4 rounded-lg shadow-inner transition-all duration-300
                                   ${highlightedSectionId === lesson.unified.id ? 'outline-2 outline-[var(--color-accent-green)] outline-offset-4' : ''}`}
                      >
                        <h4 className="text-xl font-medium text-[var(--color-accent-green)] mb-2">{lesson.unified.title}</h4>
                        <p className="text-gray-300 text-base mb-2">{lesson.unified.summary}</p>
                        <p className="text-gray-400 text-sm">
                          <span className="font-bold">Type:</span> {lesson.unified.type} | <span className="font-bold">Instructor:</span> {lesson.unified.instructor}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          ))}
          <section
            id="competition"
            ref={el => { sectionRefs.current.set('competition', el); }}
            className={`mb-10 pt-4 transition-all duration-300
                       ${highlightedSectionId === 'competition' ? 'outline-2 outline-[var(--color-accent-green)] outline-offset-4 rounded-lg' : ''}`}
          >
            <h2 className="text-4xl font-bold mb-4 text-[var(--color-accent-blue)] border-b-2 border-gray-700 pb-4">
              Competition (Late May / Early June)
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-300 space-y-2">
              <li><span className="font-bold">Date:</span> TBD</li>
              <li><span className="font-bold">Each team presents their project</span></li>
              <li><span className="font-bold">Judging:</span> Based on criteria</li>
            </ul>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
