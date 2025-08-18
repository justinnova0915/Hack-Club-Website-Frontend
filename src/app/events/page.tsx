'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';
const EventsPage: React.FC = () => {
  interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity?: number;
    rsvps: string[];
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [isMentor, setIsMentor] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const auth = useAuth();

  const fetchEvents = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events`)
      .then((response) => response.json())
      .then((data: Event[]) => setEvents(data))
      .catch((err) => setError('Failed to fetch events.'));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (auth.userRole === 'mentor' || auth.userRole === 'admin') {
      setIsMentor(true);
    }
  }, [auth.userRole]);

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleEventCreated = () => {
    fetchEvents();
    setSuccess('Event created successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDayClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <div className="min-h-screen flex flex-col custom-scrollbar">
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
      />
      <main className="flex-grow container mx-auto p-6 md:p-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-[var(--color-accent-blue)] text-center">
          Club Events
        </h1>
        {error && (
          <div className="bg-red-800 text-[var(--color-text-general)] p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-[var(--color-accent-green)] text-[var(--color-text-general)] p-4 rounded-lg mb-6 text-center">
            {success}
          </div>
        )}
        {isMentor && (
          <div className="mb-8 text-center space-x-4">
            <button
              onClick={handleAddEvent}
              className="bg-[var(--color-accent-green)] hover:bg-green-600 text-[var(--color-primary-light)] font-bold py-3 px-6 rounded-xl text-lg transition duration-200"
            >
              + Add New Event
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 bg-[var(--color-secondary-dark)] p-6 rounded-xl shadow-lg border border-[var(--color-tertiary-dark)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <button id="prev-month-btn" onClick={goToPrevMonth} className="bg-[var(--color-tertiary-dark)] hover:bg-slate-700 text-[var(--color-primary-light)] p-2 rounded-full transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h2 id="current-month-year" className="text-2xl font-bold text-[var(--color-accent-blue)]">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button id="next-month-btn" onClick={goToNextMonth} className="bg-[var(--color-tertiary-dark)] hover:bg-slate-700 text-[var(--color-primary-light)] p-2 rounded-full transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            <div id="calendar-grid" className="calendar-grid flex-grow">
              <div className="day-name">Sun</div>
              <div className="day-name">Mon</div>
              <div className="day-name">Tue</div>
              <div className="day-name">Wed</div>
              <div className="day-name">Thu</div>
              <div className="day-name">Fri</div>
              <div className="day-name">Sat</div>
              {(() => {
                const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                const daysInMonth = endOfMonth.getDate();
                const startDay = startOfMonth.getDay();
                const totalDays = Math.ceil((startDay + daysInMonth) / 7) * 7;

                const calendarDays = Array.from({ length: totalDays }, (_, index) => {
                  const day = index - startDay + 1;
                  if (day < 1) {
                    return { day: new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() + day, month: 'prev' };
                  } else if (day > daysInMonth) {
                    return { day: day - daysInMonth, month: 'next' };
                  } else {
                    return { day, month: 'current' };
                  }
                });

                return calendarDays.map((day, index) => {
                  let targetDate;
                  if (day.month === 'current') {
                    targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.day);
                  } else if (day.month === 'prev') {
                    targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day.day);
                  } else {
                    targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day.day);
                  }

                  const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
                  const eventsForDay = events.filter(event => event.date === dateStr);
                  const hasEvent = eventsForDay.length > 0;

                  return (
                    <div
                      key={index}
                      className={`calendar-day ${day.month === 'current' ? 'current-month' : ''} ${hasEvent ? 'has-event' : ''}`}
                      onClick={() => hasEvent && handleDayClick(eventsForDay[0])}
                    >
                      <div className="calendar-day-content">
                        <span className="calendar-day-number">{day.day}</span>
                        {hasEvent && (
                          <span className="calendar-event-title">
                            {eventsForDay[0].title}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;