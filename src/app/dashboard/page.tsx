"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import EventDetailsModal from "../events/EventDetailsModal";
import { formatTimestamp } from "@/utils/dateformatter";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string | { seconds: number; nanoseconds: number };
}

interface Conversation {
  id: string;
  otherParticipantName: string;
  lastMessageContent: string;
  lastMessageAt: string | { seconds: number; nanoseconds: number };
  lastMessageSenderId: string;
  isUnread: boolean;
}
export default function DashboardPage() {
  const { user, loading, userRole, logOut } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [recentAnnouncements, setRecentAnnouncements] = useState<
    Announcement[]
  >([]);
  const [recentConversations, setRecentConversations] = useState<
    Conversation[]
  >([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [dailyInsight, setDailyInsight] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [isDailyInsightLoading, setIsDailyInsightLoading] = useState(true);
  const fetchEvents = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events`)
      .then((response) => response.json())
      .then((data: Event[]) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events.", err));
  };

  const fetchDailyFact = useCallback(async () => {
    setIsDailyInsightLoading(true);
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/today?language=en",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch daily fact from Useless Facts API");
      }

      const data = await response.json();
      setDailyInsight({
        title: "",
        content: data.text,
      });
    } catch (error) {
      console.error("Error fetching daily fact:", error);
      setDailyInsight({
        title: "Fun Fact:",
        content: "A group of pugs is called a 'grumble'.",
      });
    } finally {
      setIsDailyInsightLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchEvents();
    fetchDailyFact();
  }, [fetchDailyFact]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements`)
      .then((response) => response.json())
      .then((data) =>
        setRecentAnnouncements(
          data.map((announcement: any) => ({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content || "Snippet not available.",
            timestamp: announcement.timestamp,
          })),
        ),
      )
      .catch((err) => console.error("Failed to fetch announcements.", err));
  }, []);
  useEffect(() => {
    if (!user) {
      setRecentConversations([]);
      setLoadingConversations(false);
      return;
    }

    setLoadingConversations(true);
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const fetchedConversations = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            const otherParticipantId = data.participants.find(
              (p: string) => p !== user.uid,
            );
            let otherParticipantName = "Unknown User";
            if (otherParticipantId) {
              const publicProfileDoc = await getDoc(
                doc(db, "public_profiles", otherParticipantId),
              );
              if (publicProfileDoc.exists()) {
                otherParticipantName =
                  publicProfileDoc.data().username || otherParticipantId;
              }
            }

            const lastReadTimestamp =
              data.readBy && data.readBy[user.uid]
                ? data.readBy[user.uid]?.toDate()
                : null;
            const lastMessageTimestamp = data.lastMessageAt?.toDate() || null;
            const isUnread =
              lastMessageTimestamp &&
              data.lastMessageSenderId !== user.uid &&
              (!lastReadTimestamp || lastMessageTimestamp > lastReadTimestamp);

            return {
              id: docSnapshot.id,
              otherParticipantName: otherParticipantName,
              lastMessageContent: data.lastMessageContent || "No messages yet.",
              lastMessageAt: data.lastMessageAt,
              lastMessageSenderId: data.lastMessageSenderId,
              isUnread: isUnread,
            };
          }),
        );

        const sortedConversations = fetchedConversations.sort((a, b) => {
          if (a.isUnread && !b.isUnread) return -1;
          if (!a.isUnread && b.isUnread) return 1;
          const dateA =
            a.lastMessageAt && "seconds" in a.lastMessageAt
              ? a.lastMessageAt.seconds
              : 0;
          const dateB =
            b.lastMessageAt && "seconds" in b.lastMessageAt
              ? b.lastMessageAt.seconds
              : 0;
          return dateB - dateA;
        });

        setRecentConversations(sortedConversations.slice(0, 5));
        setLoadingConversations(false);
      },
      (err) => {
        console.error("Error fetching conversations:", err);
        setLoadingConversations(false);
      },
    );

    return () => unsubscribe();
  }, [user]);
  const handleDayClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex flex-col">
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
      />
      <main className="flex-grow container mx-auto p-6 md:p-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[var(--color-accent-blue)]">
          Your Dashboard
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
          Hello, {user.username}! You are logged in as a {userRole}. This is
          your personalized hub.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-left flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-accent-yellow)]">
              Daily Insight 💡
            </h2>
            {isDailyInsightLoading ? (
              <p className="text-gray-400 text-lg">
                Loading today's insight...
              </p>
            ) : (
              dailyInsight && (
                <p className="text-gray-300 text-lg mb-4">
                  <span className="font-bold">{dailyInsight.title}</span>{" "}
                  {dailyInsight.content}
                </p>
              )
            )}
          </div>
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-left flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-accent-blue)]">
              Recent Announcements
            </h2>
            <ul className="space-y-3 flex-grow">
              {recentAnnouncements.map((announcement: Announcement) => (
                <li
                  key={announcement.id}
                  className="border-b border-gray-700 pb-3 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-gray-200">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {announcement.content}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatTimestamp(announcement.timestamp)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="text-right mt-auto">
              <Link
                href="/announcements"
                className="text-blue-500 hover:text-blue-700 text-sm font-bold"
              >
                View All Announcements &rarr;
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-left flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-accent-blue)]">
              Recent Messages
            </h2>
            {loadingConversations ? (
              <p className="text-center text-gray-400">Loading messages...</p>
            ) : recentConversations.length > 0 ? (
              <ul className="space-y-3 flex-grow">
                {recentConversations.map((conv) => (
                  <li
                    key={conv.id}
                    className={`p-3 rounded-lg flex items-center space-x-3 transition duration-150 border-b border-gray-700 last:border-b-0`}
                  >
                    {conv.isUnread && (
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0 animate-pulse"></span>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-200">
                        {conv.otherParticipantName}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {conv.lastMessageContent}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(conv.lastMessageAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400 flex-grow flex items-center justify-center">
                No recent conversations.
              </p>
            )}
            <div className="text-right mt-auto">
              <Link
                href="/messages"
                className="text-blue-500 hover:text-blue-700 text-sm font-bold"
              >
                View All Messages &rarr;
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-left flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <button
                id="prev-month-btn"
                onClick={goToPrevMonth}
                className="bg-[var(--color-tertiary-dark)] hover:bg-slate-700 text-[var(--color-primary-light)] p-2 rounded-full transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <h2
                id="current-month-year"
                className="text-2xl font-bold text-[var(--color-accent-blue)]"
              >
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                id="next-month-btn"
                onClick={goToNextMonth}
                className="bg-[var(--color-tertiary-dark)] hover:bg-slate-700 text-[var(--color-primary-light)] p-2 rounded-full transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
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
                const startOfMonth = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                );
                const endOfMonth = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  0,
                );
                const daysInMonth = endOfMonth.getDate();
                const startDay = startOfMonth.getDay();
                const totalDays = Math.ceil((startDay + daysInMonth) / 7) * 7;

                const calendarDays = Array.from(
                  { length: totalDays },
                  (_, index) => {
                    const day = index - startDay + 1;
                    if (day < 1) {
                      return {
                        day:
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            0,
                          ).getDate() + day,
                        month: "prev",
                      };
                    } else if (day > daysInMonth) {
                      return { day: day - daysInMonth, month: "next" };
                    } else {
                      return { day, month: "current" };
                    }
                  },
                );

                return calendarDays.map((day, index) => {
                  let targetDate;
                  if (day.month === "current") {
                    targetDate = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day.day,
                    );
                  } else if (day.month === "prev") {
                    targetDate = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      day.day,
                    );
                  } else {
                    targetDate = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      day.day,
                    );
                  }

                  const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
                  const eventsForDay = events.filter(
                    (event) => event.date === dateStr,
                  );
                  const hasEvent = eventsForDay.length > 0;

                  return (
                    <div
                      key={index}
                      className={`calendar-day ${day.month === "current" ? "current-month" : ""} ${hasEvent ? "has-event" : ""}`}
                      onClick={() =>
                        hasEvent && handleDayClick(eventsForDay[0])
                      }
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
            <div className="text-right mt-auto">
              <Link
                href="/events"
                className="text-blue-500 hover:text-blue-700 text-sm font-bold"
              >
                View Full Calendar &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
