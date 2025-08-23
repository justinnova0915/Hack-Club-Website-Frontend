"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user, loading, userRole, logOut } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userRole !== "admin" && userRole !== "mentor") {
        router.push("/");
      }
    }
  }, [user, loading, userRole, router]);
  const viewMessage = (messageId: string) => {
    alert(
      `Admin Action: View Message ${messageId} (functionality to be implemented)`,
    );
  };

  const replyToMessage = (messageId: string) => {
    alert(
      `Admin Action: Reply to Message ${messageId} (functionality to be implemented)`,
    );
  };

  const deleteMessage = (messageId: string) => {
    if (
      window.confirm(`Are you sure you want to delete message ${messageId}?`)
    ) {
      alert(
        `Admin Action: Delete Message ${messageId} (functionality to be implemented)`,
      );
    }
  };

  const composeMessage = () => {
    alert(
      "Admin Action: Compose New Message (functionality to be implemented)",
    );
  };

  const editAnnouncement = (announcementId: string) => {
    alert(
      `Admin Action: Edit Announcement ${announcementId} (functionality to be implemented)`,
    );
  };

  const deleteAnnouncement = (announcementId: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete announcement ${announcementId}?`,
      )
    ) {
      alert(
        `Admin Action: Delete Announcement ${announcementId} (functionality to be implemented)`,
      );
    }
  };

  const addEvent = () => {
    alert("Admin Action: Add New Event (functionality to be implemented)");
  };

  const editEvent = (eventId: string) => {
    alert(
      `Admin Action: Edit Event ${eventId} (functionality to be implemented)`,
    );
  };

  const deleteEvent = (eventId: string) => {
    if (window.confirm(`Are you sure you want to delete event ${eventId}?`)) {
      alert(
        `Admin Action: Delete Event ${eventId} (functionality to be implemented)`,
      );
    }
  };

  const reviewProject = (projectId: string) => {
    alert(
      `Mentor/Admin Action: Review Project ${projectId} (functionality to be implemented)`,
    );
  };

  const approveProject = (projectId: string) => {
    alert(
      `Mentor/Admin Action: Approve Project ${projectId} (functionality to be implemented)`,
    );
  };

  const rejectProject = (projectId: string) => {
    if (
      window.confirm(`Are you sure you want to reject project ${projectId}?`)
    ) {
      alert(
        `Mentor/Admin Action: Reject Project ${projectId} (functionality to be implemented)`,
      );
    }
  };

  const addResource = () => {
    alert(
      "Mentor/Admin Action: Add New Resource (functionality to be implemented)",
    );
  };

  const editResource = (resourceId: string) => {
    alert(
      `Mentor/Admin Action: Edit Resource ${resourceId} (functionality to be implemented)`,
    );
  };

  const deleteResource = (resourceId: string) => {
    if (
      window.confirm(`Are you sure you want to delete resource ${resourceId}?`)
    ) {
      alert(
        `Mentor/Admin Action: Delete Resource ${resourceId} (functionality to be implemented)`,
      );
    }
  };
  if (
    loading ||
    (!user && !loading) ||
    (user && userRole !== "admin" && userRole !== "mentor")
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading dashboard or redirecting...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex flex-col">
      <div className="flex flex-grow">
        <main
          id="main-content"
          className="flex-grow container mx-auto p-6 md:p-12 transition-all duration-300 ease-in-out"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-[var(--color-accent-blue)] text-center">
            Admin Dashboard
          </h1>
          <section
            id="dashboard-overview"
            className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-left flex flex-col mb-10"
          >
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-accent-blue)]">
              Recent Activity
            </h2>
            <ul className="space-y-3 flex-grow">
              <li className="border-b border-gray-700 pb-3 last:border-b-0">
                <div className="flex items-center mb-1">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                    Announcement
                  </span>
                  <h3 className="text-lg font-semibold text-gray-200">
                    New Announcement Published: Club Meeting Reminder!
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  A new announcement regarding the weekly club meeting has been
                  published.
                </p>
                <p className="text-gray-500 text-xs mt-1">July 30, 2025</p>
              </li>
              <li className="border-b border-gray-700 pb-3 last:border-b-0">
                <div className="flex items-center mb-1">
                  <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                    Message
                  </span>
                  <h3 className="text-lg font-semibold text-gray-200">
                    New message from Alice Smith
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  "Question about Unit 2: Could you clarify the React state
                  management..."
                </p>
                <p className="text-gray-500 text-xs mt-1">August 2, 2025</p>
              </li>
              <li className="border-b border-gray-700 pb-3 last:border-b-0">
                <div className="flex items-center mb-1">
                  <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                    Project Update
                  </span>
                  <h3 className="text-lg font-semibold text-gray-200">
                    New Project Submission: Smart Home Controller
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  A new project "Smart Home Controller" by Student Alice is
                  pending review.
                </p>
                <p className="text-gray-500 text-xs mt-1">August 1, 2025</p>
              </li>
            </ul>
            <div className="text-right mt-auto">
              <a
                href="#"
                className="text-blue-500 hover:text-blue-700 text-sm font-bold"
              >
                View All Activity &rarr;
              </a>
            </div>
          </section>
          {(userRole === "admin" || userRole === "mentor") && (
            <section
              id="messages-management"
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10"
            >
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-accent-blue)]">
                Messages Management
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-semibold text-gray-200">
                      Alice Smith
                    </span>
                    <span className="bg-green-500 text-white py-0.5 px-2 rounded-full text-xs ml-2">
                      Student
                    </span>
                  </p>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    Subject: Question about Unit 2
                  </h3>
                  <div className="text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => viewMessage("msg001")}
                    >
                      View
                    </button>
                    <button
                      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => replyToMessage("msg001")}
                    >
                      Reply
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteMessage("msg001")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-semibold text-gray-200">
                      Bob Johnson
                    </span>
                    <span className="bg-purple-500 text-white py-0.5 px-2 rounded-full text-xs ml-2">
                      Mentor
                    </span>
                  </p>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    Subject: Feedback on curriculum plan
                  </h3>
                  <div className="text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => viewMessage("msg002")}
                    >
                      View
                    </button>
                    <button
                      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => replyToMessage("msg002")}
                    >
                      Reply
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteMessage("msg002")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-semibold text-gray-200">
                      Charlie Brown
                    </span>
                    <span className="bg-green-500 text-white py-0.5 px-2 rounded-full text-xs ml-2">
                      Student
                    </span>
                  </p>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    Subject: Issue with project submission
                  </h3>
                  <div className="text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => viewMessage("msg003")}
                    >
                      View
                    </button>
                    <button
                      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => replyToMessage("msg003")}
                    >
                      Reply
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteMessage("msg003")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="mt-6 bg-[var(--color-accent-green)] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                onClick={composeMessage}
              >
                Compose New Message
              </button>
            </section>
          )}
          {(userRole === "admin" || userRole === "mentor") && (
            <section
              id="announcements-management"
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10"
            >
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-accent-blue)]">
                Announcements Management
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    Upcoming Hackathon!
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Get ready for our annual hackathon on Sept 10th. Prizes
                    await!
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Published: August 1, 2025
                  </p>
                  <div className="mt-3 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => editAnnouncement("hackathon")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteAnnouncement("hackathon")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    Welcome New Members!
                  </h3>
                  <p className="text-gray-400 text-sm">
                    A warm welcome to all new students joining Hack Club this
                    year.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Published: July 20, 2025
                  </p>
                  <div className="mt-3 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => editAnnouncement("welcome")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteAnnouncement("welcome")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <Link
                href="/admin/announcements/create"
                className="inline-block mt-6 bg-[var(--color-accent-green)] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
              >
                Add New Announcement
              </Link>
            </section>
          )}
          {(userRole === "admin" || userRole === "mentor") && (
            <section
              id="event-management"
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10"
            >
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-accent-blue)]">
                Event Management
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    Python Workshop
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Date: August 15, 2025 | Time: 5:00 PM | Location: Lab 101
                  </p>
                  <p className="text-gray-500 text-xs mt-1">RSVPs: 25/50</p>
                  <div className="mt-3 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => editEvent("python-workshop")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteEvent("python-workshop")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    Guest Speaker: AI in Healthcare
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Date: September 5, 2025 | Time: 6:30 PM | Location:
                    Auditorium
                  </p>
                  <p className="text-gray-500 text-xs mt-1">RSVPs: 80/100</p>
                  <div className="mt-3 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => editEvent("ai-speaker")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteEvent("ai-speaker")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="mt-6 bg-[var(--color-accent-green)] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                onClick={addEvent}
              >
                Add New Event
              </button>
            </section>
          )}
          {(userRole === "admin" || userRole === "mentor") && (
            <section
              id="project-submissions"
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10"
            >
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-accent-blue)]">
                Project Submissions Review
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    Project: Smart Home Controller
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Submitted by: Alice (Student)
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Status:{" "}
                    <span className="text-yellow-400">Pending Review</span>
                  </p>
                  <div className="mt-3 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => reviewProject("smarthome")}
                    >
                      Review
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => approveProject("smarthome")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => rejectProject("smarthome")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    Project: 2D Platformer Game
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Submitted by: Bob (Student)
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Status:{" "}
                    <span className="text-yellow-400">Pending Review</span>
                  </p>
                  <div className="mt-3 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => reviewProject("platformer")}
                    >
                      Review
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => approveProject("platformer")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => rejectProject("platformer")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
          {(userRole === "admin" || userRole === "mentor") && (
            <section
              id="resource-library"
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10"
            >
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-accent-blue)]">
                Resource Library Management
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    Resource: React Hooks Cheatsheet
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Category: Web Development | Type: Link
                  </p>
                  <div className="mt-3 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => editResource("react-hooks")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteResource("react-hooks")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    Resource: Arduino Getting Started Guide
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Category: Hardware | Type: Document
                  </p>
                  <div className="mt-3 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                      onClick={() => editResource("arduino-guide")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                      onClick={() => deleteResource("arduino-guide")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="mt-6 bg-[var(--color-accent-green)] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                onClick={addResource}
              >
                Add New Resource
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
