"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: string | { seconds: number; nanoseconds: number };
  reactionsCount: { [emoji: string]: number };
}

export default function CreateAnnouncementPage() {
  const { user, loading: authLoading, userRole } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const announcementId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (
      !authLoading &&
      (!user || (userRole !== "admin" && userRole !== "mentor"))
    ) {
      router.push("/login");
      return;
    }

    const fetchAnnouncementForEdit = async () => {
      if (announcementId) {
        setPageLoading(true);
        setError(null);
        try {
          const idToken = await user?.getIdToken();
          console.log(
            `[Frontend] Attempting to fetch announcement for edit: ${announcementId}`,
          );
          const response = await fetch(
            `${API_BASE_URL}/api/announcements/${announcementId}`,
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error(
              `[Frontend] Failed to fetch announcement for editing: Status: ${response.status}, Error:`,
              errorData,
            );
            throw new Error(
              errorData.error || "Failed to fetch announcement for editing.",
            );
          }

          const data: Announcement = await response.json();
          console.log("[Frontend] Announcement data fetched for edit:", data);
          setTitle(data.title);
          setContent(data.content);
        } catch (err: any) {
          console.error(
            "[Frontend] Error fetching announcement for edit:",
            err,
          );
          setError(err.message || "Failed to load announcement for editing.");
        } finally {
          setPageLoading(false);
        }
      } else {
        setPageLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchAnnouncementForEdit();
    }
  }, [announcementId, user, authLoading, userRole, router, API_BASE_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    if (!user) {
      setError("You must be logged in to create/edit an announcement.");
      return;
    }

    try {
      const idToken = await user.getIdToken();
      let response;
      let method;
      let url;

      if (announcementId) {
        method = "PUT";
        url = `${API_BASE_URL}/api/announcements/${announcementId}`;
        console.log(`[Frontend] Sending PUT request to: ${url}`);
      } else {
        method = "POST";
        url = `${API_BASE_URL}/api/announcements`;
        console.log(`[Frontend] Sending POST request to: ${url}`);
      }

      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `[Frontend] API Error: Status: ${response.status}, Error:`,
          errorData,
        );
        throw new Error(
          errorData.error ||
            `Failed to ${announcementId ? "update" : "create"} announcement.`,
        );
      }

      const result = await response.json();
      setSuccess(
        result.message ||
          `Announcement ${announcementId ? "updated" : "created"} successfully!`,
      );
      setTitle("");
      setContent("");
      setTimeout(() => {
        router.push("/announcements");
      }, 1500);
    } catch (err: any) {
      console.error("[Frontend] Caught error in handleSubmit:", err);
      setError(
        err.message ||
          `An unexpected error occurred while trying to ${announcementId ? "update" : "create"} the announcement.`,
      );
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading {announcementId ? "announcement for editing" : "page"}...</p>
      </div>
    );
  }
  if (!user || (userRole !== "admin" && userRole !== "mentor")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-red-500">
        <p className="text-xl">
          Forbidden: You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex flex-col">
      <main className="flex-grow container mx-auto p-6 md:p-12 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-[var(--color-accent-blue)] text-center">
          {announcementId ? "Edit Announcement" : "Create New Announcement"}
        </h1>

        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-2xl">
          {error && (
            <div className="bg-red-800 text-white p-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-[var(--color-accent-green)] text-white p-4 rounded-lg mb-6 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-gray-300 text-lg font-bold mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-[var(--color-accent-blue)] transition duration-200"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-gray-300 text-lg font-bold mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                rows={10}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-[var(--color-accent-blue)] transition duration-200 resize-y"
                placeholder="Write your announcement here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-[var(--color-accent-blue)] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:shadow-outline transition duration-200 text-lg"
              >
                {announcementId ? "Update Announcement" : "Create Announcement"}
              </button>
              <Link
                href="/announcements"
                className="inline-block align-baseline font-bold text-lg text-gray-400 hover:text-gray-200 transition duration-200"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
