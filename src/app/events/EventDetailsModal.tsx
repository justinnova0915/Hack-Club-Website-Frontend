'use client';
import React from 'react';

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

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[var(--color-secondary-dark)] p-8 rounded-xl shadow-2xl max-w-xl w-full text-left">
        <h3 className="text-3xl font-bold text-[var(--color-accent-blue)] mb-4">{event.title}</h3>
        <p className="text-[var(--color-text-general)] mb-2"><strong>Date:</strong> {event.date}</p>
        <p className="text-[var(--color-text-general)] mb-2"><strong>Time:</strong> {event.time}</p>
        <p className="text-[var(--color-text-general)] mb-2"><strong>Location:</strong> {event.location}</p>
        <p className="text-[var(--color-text-general)] mb-4"><strong>Description:</strong> {event.description}</p>
        <p className="text-[var(--color-text-general)] mb-4"><strong>Capacity:</strong> {event.capacity || 'N/A'}</p>
        <p className="text-[var(--color-text-general)] mb-4"><strong>RSVPs:</strong> {event.rsvps.length}</p>
        <button onClick={onClose} className="mt-6 bg-slate-700 hover:bg-slate-800 text-[var(--color-primary-light)] font-bold py-2 px-5 rounded-lg transition duration-200 w-full">
          Close
        </button>
      </div>
    </div>
  );
};

export default EventDetailsModal;