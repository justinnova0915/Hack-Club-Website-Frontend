'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onEventCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
    };
    let isValid = true;
    if (!title) {
      newErrors.title = 'Title is required.';
      isValid = false;
    }
    if (!date) {
      newErrors.date = 'Date is required.';
      isValid = false;
    }
    if (!time) {
      newErrors.time = 'Time is required.';
      isValid = false;
    }
    if (!location) {
      newErrors.location = 'Location is required.';
      isValid = false;
    }
    if (!description) {
      newErrors.description = 'Description is required.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    if (!user) {
      setSubmitError('You must be logged in to create an event.');
      return;
    }
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, date, time, location, description }),
      });
      if (response.status === 201) {
        onEventCreated();
        onClose();
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || 'Failed to create event.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[var(--color-primary-dark)] p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-accent-blue)]">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-general)]">Event Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[var(--color-secondary-dark)] border border-[var(--color-tertiary-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent-blue)] focus:border-[var(--color-accent-blue)] sm:text-sm"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-[var(--color-text-general)]">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[var(--color-secondary-dark)] border border-[var(--color-tertiary-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent-blue)] focus:border-[var(--color-accent-blue)] sm:text-sm"
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-[var(--color-text-general)]">Start Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[var(--color-secondary-dark)] border border-[var(--color-tertiary-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent-blue)] focus:border-[var(--color-accent-blue)] sm:text-sm"
            />
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-[var(--color-text-general)]">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[var(--color-secondary-dark)] border border-[var(--color-tertiary-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent-blue)] focus:border-[var(--color-accent-blue)] sm:text-sm"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text-general)]">Description</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[var(--color-secondary-dark)] border border-[var(--color-tertiary-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent-blue)] focus:border-[var(--color-accent-blue)] sm:text-sm"
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          {submitError && <p className="text-red-500 text-sm mb-4">{submitError}</p>}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="bg-[var(--color-accent-green)] hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;