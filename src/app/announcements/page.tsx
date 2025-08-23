"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: string | { seconds: number; nanoseconds: number };
}
const formatFirestoreTimestamp = (
  dateInput:
    | string
    | { seconds: number; nanoseconds: number }
    | null
    | undefined,
): string => {
  if (!dateInput) {
    return "N/A Date";
  }

  let date: Date;
  if (
    typeof dateInput === "object" &&
    dateInput !== null &&
    "seconds" in dateInput &&
    typeof dateInput.seconds === "number"
  ) {
    date = new Date(dateInput.seconds * 1000);
  } else if (typeof dateInput === "string") {
    date = new Date(dateInput);
  } else {
    return "Invalid Date Format";
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 max-w-sm w-full text-center">
        <p className="text-lg text-white mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition duration-200"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AnnouncementsPage() {
  const { user, loading: authLoading, userRole } = useAuth();
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [userReactions, setUserReactions] = useState<Record<string, string>>(
    {},
  );

  const [newCommentText, setNewCommentText] = useState<Record<string, string>>(
    {},
  );
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    string | null
  >(null);

  const availableEmojis = ["👍", "❤️", "🎉", "💡", "🚀"];

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const fetchAnnouncements = useCallback(async () => {
    if (authLoading) {
      console.log("Auth still loading, deferring announcement fetch.");
      return;
    }

    setPageLoading(true);
    setError(null);
    try {
      console.log(
        `[Frontend] Attempting to fetch announcements from: ${API_BASE_URL}/api/announcements`,
      );
      const response = await fetch(`${API_BASE_URL}/api/announcements`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[Frontend] HTTP error fetching announcements! Status: ${response.status}, Text: ${errorText}`,
        );
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText.substring(0, 100)}...`,
        );
      }
      const data: Announcement[] = await response.json();
      console.log("[Frontend] Announcements fetched successfully:", data);
      console.log(
        "[Frontend Announcements] Raw timestamp from fetched data (after JSON parse):",
        data[0]?.timestamp,
      );
      setAnnouncements(data);
      const initialCommentText: Record<string, string> = {};
      const commentsDataMap: Record<string, Comment[]> = {};

      const commentsPromises = data.map(async (ann) => {
        initialCommentText[ann.id] = "";
        try {
          console.log(
            `[Frontend] Attempting to fetch comments for ${ann.id} from: ${API_BASE_URL}/api/announcements/${ann.id}/comments`,
          );
          const commentsResponse = await fetch(
            `${API_BASE_URL}/api/announcements/${ann.id}/comments`,
          );
          if (!commentsResponse.ok) {
            const commentsErrorText = await commentsResponse.text();
            console.error(
              `[Frontend] Failed to fetch comments for ${ann.id}: Status: ${commentsResponse.status}, Text: ${commentsErrorText}`,
            );
            return { annId: ann.id, comments: [] };
          }
          const commentsData: Comment[] = await commentsResponse.json();
          console.log(
            `[Frontend] Comments fetched for ${ann.id}:`,
            commentsData,
          );
          return { annId: ann.id, comments: commentsData };
        } catch (commentErr: any) {
          console.error(
            `[Frontend] Error fetching comments for ${ann.id}:`,
            commentErr,
          );
          return { annId: ann.id, comments: [] };
        }
      });

      const fetchedComments = await Promise.all(commentsPromises);
      fetchedComments.forEach(({ annId, comments }) => {
        commentsDataMap[annId] = comments;
      });
      setComments(commentsDataMap);
      setNewCommentText(initialCommentText);

      setUserReactions({});
    } catch (err: any) {
      console.error("[Frontend] Caught error in fetchAnnouncements:", err);
      setError(
        err.message ||
          "Failed to load announcements and comments. Please try again later.",
      );
    } finally {
      setPageLoading(false);
    }
  }, [API_BASE_URL, authLoading]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleAddComment = async (announcementId: string) => {
    if (!user) {
      setError("You must be logged in to post a comment.");
      console.warn(
        "[Frontend] Attempted to add comment without user logged in.",
      );
      return;
    }

    const text = newCommentText[announcementId]?.trim();
    if (!text) {
      setError("Comment text cannot be empty.");
      console.warn("[Frontend] Attempted to add empty comment.");
      return;
    }

    setError(null);
    try {
      const idToken = await user.getIdToken();
      console.log(
        `[Frontend] Posting comment for announcement ${announcementId} with text: "${text}"`,
      );
      const response = await fetch(
        `${API_BASE_URL}/api/announcements/${announcementId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ text }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `[Frontend] Failed to add comment: Status: ${response.status}, Error:`,
          errorData,
        );
        throw new Error(
          errorData.error || `Failed to add comment: ${response.statusText}`,
        );
      }

      const newCommentData: Comment = await response.json();
      console.log("[Frontend] New comment added successfully:", newCommentData);
      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        const currentComments = updatedComments[announcementId] || [];
        updatedComments[announcementId] = [...currentComments, newCommentData];
        return updatedComments;
      });

      setNewCommentText((prev) => {
        const updated = { ...prev };
        updated[announcementId] = "";
        return updated;
      });
    } catch (err: any) {
      console.error("[Frontend] Error adding comment:", err);
      setError(err.message || "Failed to add comment.");
    }
  };

  const handleToggleReaction = async (
    announcementId: string,
    emoji: string,
  ) => {
    if (!user) {
      setError("You must be logged in to react.");
      console.warn(
        "[Frontend] Attempted to toggle reaction without user logged in.",
      );
      return;
    }

    setError(null);
    try {
      const idToken = await user.getIdToken();
      console.log(
        `[Frontend] Toggling reaction "${emoji}" for announcement ${announcementId}`,
      );
      const response = await fetch(
        `${API_BASE_URL}/api/announcements/${announcementId}/reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ emoji }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `[Frontend] Failed to toggle reaction: Status: ${response.status}, Error:`,
          errorData,
        );
        throw new Error(
          errorData.error ||
            `Failed to toggle reaction: ${response.statusText}`,
        );
      }

      const result = await response.json();
      const action = result.action;
      const currentCounts = result.currentCounts;
      console.log(
        `[Frontend] Reaction toggled. Action: ${action}, New Counts:`,
        currentCounts,
      );
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((ann) =>
          ann.id === announcementId
            ? { ...ann, reactionsCount: currentCounts }
            : ann,
        ),
      );
      setUserReactions((prevUserReactions) => {
        const newUserReactions = { ...prevUserReactions };
        if (action === "added") {
          newUserReactions[announcementId] = emoji;
        } else {
          delete newUserReactions[announcementId];
        }
        return newUserReactions;
      });
    } catch (err: any) {
      console.error("[Frontend] Error toggling reaction:", err);
      setError(err.message || "Failed to toggle reaction.");
    }
  };
  const canManageAnnouncements =
    user && (userRole === "admin" || userRole === "mentor");

  const handleEditAnnouncement = (announcementId: string) => {
    router.push(`/admin/announcements/create?id=${announcementId}`);
  };

  const handleDeleteClick = (announcementId: string) => {
    setAnnouncementToDelete(announcementId);
    setShowConfirmModal(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (!announcementToDelete || !user) {
      setError(
        "Error: No announcement selected for deletion or user not logged in.",
      );
      setShowConfirmModal(false);
      setAnnouncementToDelete(null);
      return;
    }

    setError(null);
    try {
      const idToken = await user.getIdToken();
      console.log(`[Frontend] Deleting announcement: ${announcementToDelete}`);
      const response = await fetch(
        `${API_BASE_URL}/api/announcements/${announcementToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `[Frontend] Failed to delete announcement: Status: ${response.status}, Error:`,
          errorData,
        );
        throw new Error(
          errorData.error ||
            `Failed to delete announcement: ${response.statusText}`,
        );
      }

      console.log(
        `[Frontend] Announcement ${announcementToDelete} deleted successfully.`,
      );
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.filter((ann) => ann.id !== announcementToDelete),
      );
      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        delete updatedComments[announcementToDelete];
        return updatedComments;
      });
      setUserReactions((prevReactions) => {
        const updatedReactions = { ...prevReactions };
        delete updatedReactions[announcementToDelete];
        return updatedReactions;
      });

      setAnnouncementToDelete(null);
      setShowConfirmModal(false);
    } catch (err: any) {
      console.error("[Frontend] Error deleting announcement:", err);
      setError(err.message || "Failed to delete announcement.");
      setShowConfirmModal(false);
      setAnnouncementToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setAnnouncementToDelete(null);
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex flex-col">
      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this announcement? This action cannot be undone."
          onConfirm={confirmDeleteAnnouncement}
          onCancel={cancelDelete}
        />
      )}
      <main className="flex-grow container mx-auto p-6 md:p-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-[var(--color-accent-blue)] text-center">
          Club Announcements
        </h1>

        {error && (
          <div className="bg-red-800 text-white p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        {canManageAnnouncements && (
          <div className="mb-8 text-center">
            <Link
              href="/admin/announcements/create"
              className="inline-block bg-gray-600 hover:bg-[var(--color-accent-green)] text-white font-bold py-3 px-6 rounded-xl text-lg transition duration-200"
            >
              + Create New Announcement
            </Link>
          </div>
        )}

        {announcements.length === 0 && !pageLoading ? (
          <p className="text-gray-400 text-center text-lg">
            No announcements found. Check back later!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col"
              >
                <h2 className="text-2xl font-bold mb-2 text-[var(--color-accent-blue)]">
                  {announcement.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  By {announcement.authorName} on{" "}
                  {formatFirestoreTimestamp(announcement.timestamp)}
                </p>
                <p className="text-gray-300 leading-relaxed mb-4 flex-grow">
                  {announcement.content}
                </p>
                <div className="flex items-center space-x-2 mb-4 pt-4 border-t border-gray-700">
                  {availableEmojis.map((emoji) => {
                    const hasUserReacted =
                      userReactions[announcement.id] === emoji;
                    const emojiCount =
                      announcement.reactionsCount?.[emoji] || 0;
                    return (
                      <button
                        key={emoji}
                        onClick={() =>
                          handleToggleReaction(announcement.id, emoji)
                        }
                        className={`p-2 rounded-full transition duration-150 flex items-center space-x-1 text-lg
                                  ${hasUserReacted ? "bg-[var(--color-accent-blue)] hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}
                                  ${!user ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                        disabled={!user}
                      >
                        <span>{emoji}</span>
                        {emojiCount > 0 && (
                          <span className="text-xs text-gray-300">
                            {emojiCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-lg font-semibold mb-3 text-gray-200">
                    Comments
                  </h3>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                    {(comments[announcement.id] || []).length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        No comments yet. Be the first!
                      </p>
                    ) : (
                      (comments[announcement.id] || []).map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-700 p-3 rounded-lg"
                        >
                          <p className="text-gray-300 text-sm font-semibold">
                            {comment.authorName}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            {comment.text}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {formatFirestoreTimestamp(comment.timestamp)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder={
                        user ? "Add a comment..." : "Login to comment..."
                      }
                      value={newCommentText[announcement.id] || ""}
                      onChange={(e) =>
                        setNewCommentText((prev) => {
                          const updated = { ...prev };
                          updated[announcement.id] = e.target.value;
                          return updated;
                        })
                      }
                      className={`flex-grow p-2 rounded-lg border focus:outline-none
                      ${
                        user
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:border-[var(--color-accent-blue)]"
                          : "bg-gray-900 border-gray-800 text-gray-500 placeholder-gray-700 cursor-not-allowed"
                      }`}
                      disabled={!user}
                    />
                    <button
                      onClick={() => handleAddComment(announcement.id)}
                      className={`font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        user && newCommentText[announcement.id]?.trim()
                          ? "bg-[var(--color-accent-blue)] hover:bg-blue-700 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                      disabled={
                        !user || !newCommentText[announcement.id]?.trim()
                      }
                    >
                      Post
                    </button>
                  </div>
                </div>
                {canManageAnnouncements &&
                  (userRole === "admin" ||
                    userRole === "mentor" ||
                    user?.uid === announcement.authorId) && (
                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditAnnouncement(announcement.id)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-1 px-3 rounded-lg transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(announcement.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
