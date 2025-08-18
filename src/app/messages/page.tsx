'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  participants: string[];
  otherParticipant: {
    id: string;
    name: string;
  };
  lastMessageAt: string | null;
  lastMessageContent: string | null;
  lastMessageSenderId: string | null;
  createdAt: string;
  readBy?: { [userId: string]: any };
}

interface PublicProfile {
  uid: string;
  username: string;
  email: string;
  role: string;
}
const formatTimestamp = (isoString: string | null): string => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error('Error formatting timestamp:', isoString, error);
    return 'Invalid Date';
  }
};

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onStartNewConversation: () => void;
  loading: boolean;
  currentUserUid: string | null;
  isCollapsed: boolean;
  onToggleList: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onStartNewConversation,
  loading,
  currentUserUid,
  isCollapsed,
  onToggleList,
}) => {
  return (
    <div
      className={`
        lg:w-1/3 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col min-h-0 h-full
        lg:static transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'hidden lg:flex' : 'fixed inset-y-0 left-0 w-2/3 z-40 flex flex-col transform translate-x-0'}
        ${isCollapsed ? 'lg:translate-x-0' : 'lg:w-1/3'}
        ${!isCollapsed && 'translate-x-0'}
        ${isCollapsed && 'transform -translate-x-full lg:transform-none'}
      `}
    >
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-[var(--color-accent-blue)]">Your Conversations</h2>
        <button
          onClick={onToggleList}
          className="lg:hidden p-1 rounded-full text-gray-400 hover:text-white transition duration-200"
          aria-label="Close Conversations"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <button
        onClick={onStartNewConversation}
        className="bg-[var(--color-accent-green)] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mb-4 transition duration-200 flex-shrink-0"
        disabled={!currentUserUid}
      >
        Start New Conversation
      </button>
      {loading ? (
        <p className="text-gray-400 text-center flex-grow flex items-center justify-center">Loading conversations...</p>
      ) : !currentUserUid ? (
        <p className="text-gray-400 text-center flex-grow flex items-center justify-center">Please log in to see conversations.</p>
      ) : conversations.length === 0 ? (
        <p className="text-gray-400 text-center flex-grow flex items-center justify-center">No conversations yet. Start one!</p>
      ) : (
        <ul className="space-y-3 overflow-y-auto flex-grow pr-2 custom-scrollbar min-h-0">
          {conversations.map((conv) => {
            const isUnread =
              conv.lastMessageSenderId !== currentUserUid &&
              conv.lastMessageAt &&
              (!conv.readBy?.[currentUserUid] || new Date(conv.lastMessageAt) > new Date(conv.readBy[currentUserUid]?.toDate()));
            return (
              <li
                key={conv.id}
                className={`p-4 rounded-lg cursor-pointer transition duration-150 relative ${
                  selectedConversationId === conv.id ? 'bg-[var(--color-accent-blue)] text-white' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => onSelectConversation(conv.id)}
              >
                {isUnread && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
                <h3 className="text-lg font-semibold">
                  {conv.otherParticipant.name}
                </h3>
                <p className={`text-sm ${selectedConversationId === conv.id ? 'text-blue-100' : 'text-gray-400'} mt-1 truncate`}>
                  {conv.lastMessageContent || 'No messages yet.'}
                </p>
                <p className={`text-xs ${selectedConversationId === conv.id ? 'text-blue-200' : 'text-gray-500'} mt-1`}>
                  {formatTimestamp(conv.lastMessageAt)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

interface MessageDisplayProps {
  selectedConversation: Conversation | null;
  currentUserUid: string | null;
  onSendMessage: (content: string) => Promise<void>;
  messages: Message[];
  loadingMessages: boolean;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  selectedConversation,
  currentUserUid,
  onSendMessage,
  messages,
  loadingMessages,
}) => {
  const [newMessageContent, setNewMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessageContent.trim() && currentUserUid && selectedConversation) {
      await onSendMessage(newMessageContent.trim());
      setNewMessageContent('');
    }
  };

  return (
    <div className="lg:w-2/3 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col min-h-0 h-full relative">
      <div className="flex items-center mb-4 flex-shrink-0">
        <h2 id="chat-header" className="text-2xl font-bold text-[var(--color-accent-blue)]">
          {selectedConversation ? `Chat with ${selectedConversation.otherParticipant.name}` : 'Select a conversation to chat'}
        </h2>
      </div>

      <div id="messages-display" ref={messagesEndRef} className="flex-grow overflow-y-auto space-y-4 p-2 pr-4 custom-scrollbar min-h-0">
        {!currentUserUid ? (
          <p className="text-gray-400 text-center text-lg flex-grow flex items-center justify-center">
            Please log in to view messages.
          </p>
        ) : !selectedConversation ? (
          <p className="text-gray-400 text-center text-lg flex-grow flex items-center justify-center">
            Select a conversation or start a new one to begin chatting.
          </p>
        ) : loadingMessages ? (
          <p className="text-gray-400 text-center text-lg flex-grow flex items-center justify-center">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-center text-lg flex-grow flex items-center justify-center">
            No messages in this conversation yet. Say hello!
          </p>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserUid;
            return (
              <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                    isCurrentUser ? 'bg-[var(--color-accent-blue)] text-white' : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <p className="text-xs font-semibold mb-1">
                    {isCurrentUser ? 'You' : message.senderName}
                  </p>
                  <p className="text-base">{message.content}</p>
                  <p className={`text-right text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      {selectedConversation && currentUserUid && (
        <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2 flex-shrink-0">
          <input
            type="text"
            id="new-message-content"
            placeholder="Type your message..."
            className="flex-1 min-w-0 p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-blue)]"
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            disabled={!currentUserUid}
          />
          <button
            type="submit"
            id="send-message-btn"
            className="flex-shrink-0 bg-[var(--color-accent-blue)] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessageContent.trim() || !currentUserUid}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

interface NewConversationModalProps {
  isOpen: boolean;
  mentors: PublicProfile[];
  onClose: () => void;
  onStartChat: (mentorId: string) => Promise<void>;
  errorMessage: string | null;
  loadingMentors: boolean;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  mentors,
  onClose,
  onStartChat,
  errorMessage,
  loadingMentors,
}) => {
  const [selectedMentorId, setSelectedMentorId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedMentorId('');
    }
  }, [isOpen]);

  const handleStartChatClick = async () => {
    if (selectedMentorId) {
      await onStartChat(selectedMentorId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 max-w-lg w-full text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Start New Conversation</h3>
        {errorMessage && (
          <div className="bg-red-800 text-white p-3 rounded-lg mb-4 text-sm">
            {errorMessage}
          </div>
        )}
        <div className="mb-6 text-left">
          <label htmlFor="mentor-select" className="block text-gray-300 text-lg font-bold mb-2">
            Select a Mentor:
          </label>
          <select
            id="mentor-select"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:border-[var(--color-accent-blue)]"
            value={selectedMentorId}
            onChange={(e) => setSelectedMentorId(e.target.value)}
            disabled={loadingMentors}
          >
            <option value="" disabled>
              {loadingMentors ? 'Loading mentors...' : 'Select a mentor'}
            </option>
            {!loadingMentors && mentors.length === 0 && (
              <option value="" disabled>No mentors available to chat with.</option>
            )}
            {!loadingMentors && mentors.map((mentor) => (
              <option key={mentor.uid} value={mentor.uid}>
                {mentor.username || mentor.email} ({mentor.email})
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartChatClick}
            className="bg-[var(--color-accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedMentorId || loadingMentors}
          >
            Start Chat
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
const MessagesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mentors, setMentors] = useState<PublicProfile[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const [isListCollapsed, setIsListCollapsed] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const markConversationAsRead = useCallback(async (convId: string) => {
    if (!user) return;
    try {
      const convRef = doc(db, 'conversations', convId);
      await updateDoc(convRef, {
        [`readBy.${user.uid}`]: serverTimestamp()
      });
      console.log(`Conversation ${convId} marked as read for user ${user.uid}`);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchMentors = useCallback(async () => {
    if (!user) {
        setMentors([]);
        setLoadingMentors(false);
        return;
    }
    setLoadingMentors(true);
    setErrorMessage(null);
    try {
      const q = query(
        collection(db, 'public_profiles'),
        where('role', 'in', ['mentor', 'admin'])
      );
      const querySnapshot = await getDocs(q);
      const fetchedMentors: PublicProfile[] = querySnapshot.docs
        .map(doc => ({ uid: doc.id, ...doc.data() } as PublicProfile))
        .filter(mentor => mentor.uid !== user.uid);
      setMentors(fetchedMentors);
    } catch (err: any) {
      console.error('Error fetching mentors:', err);
      setErrorMessage('Failed to load mentors.');
    } finally {
      setLoadingMentors(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setLoadingConversations(false);
      setSelectedConversationId(null);
      return;
    }
    setLoadingConversations(true);
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid), orderBy('lastMessageAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedConversations = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const otherParticipantId = data.participants.find((p: string) => p !== user.uid);
        let otherParticipantName = 'Unknown User';
        if (otherParticipantId) {
          const publicProfileDoc = await getDoc(doc(db, 'public_profiles', otherParticipantId));
          if (publicProfileDoc.exists()) {
            otherParticipantName = publicProfileDoc.data().username || otherParticipantId;
          }
        }
        return {
          id: docSnapshot.id,
          participants: data.participants,
          otherParticipant: { id: otherParticipantId, name: otherParticipantName },
          lastMessageAt: data.lastMessageAt?.toDate()?.toISOString() || null,
          lastMessageContent: data.lastMessageContent || null,
          lastMessageSenderId: data.lastMessageSenderId || null,
          createdAt: data.createdAt?.toDate()?.toISOString() || '',
          readBy: data.readBy,
        };
      }));
      setConversations(fetchedConversations);
      setLoadingConversations(false);
      if (!selectedConversationId && fetchedConversations.length > 0) {
        setSelectedConversationId(fetchedConversations[0].id);
      } else if (selectedConversationId && !fetchedConversations.some(c => c.id === selectedConversationId)) {
        setSelectedConversationId(null);
      }
    }, (err) => {
      console.error('Error fetching conversations:', err);
      setErrorMessage('Failed to load conversations.');
      setLoadingConversations(false);
    });
    return () => unsubscribe();
  }, [user, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId || !user) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    const messagesRef = collection(db, 'conversations', selectedConversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.docs.length > 0) {
        markConversationAsRead(selectedConversationId);
      }
      const fetchedMessages = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        let senderName = 'Unknown';
        if (data.senderId) {
            const publicProfileDoc = await getDoc(doc(db, 'public_profiles', data.senderId));
            senderName = publicProfileDoc.exists() ? publicProfileDoc.data().username || data.senderId : 'You';
        }
        return {
          id: docSnapshot.id,
          senderId: data.senderId,
          senderName: senderName,
          content: data.content,
          timestamp: data.timestamp?.toDate()?.toISOString() || '',
        };
      }));
      setMessages(fetchedMessages);
      setLoadingMessages(false);
    }, (err) => {
      console.error('Error fetching messages:', err);
      setErrorMessage('Failed to load messages.');
      setLoadingMessages(false);
    });
    return () => unsubscribe();
  }, [selectedConversationId, user, markConversationAsRead]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchMentors();
    }
  }, [user, authLoading, fetchMentors]);

  const handleSelectConversation = (convId: string) => {
    setSelectedConversationId(convId);
    if (window.innerWidth < 1024) {
      setIsListCollapsed(true);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedConversationId) {
      setErrorMessage('User not authenticated or no conversation selected.');
      return;
    }
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/messages/conversations/${selectedConversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to send message.');
    } catch (err: any) {
      console.error('Error sending message:', err);
      setErrorMessage(err.message);
    }
  };

  const handleStartNewConversationClick = () => {
    if (!user) {
      setErrorMessage('You must be logged in to start a new conversation.');
      return;
    }
    setIsNewConversationModalOpen(true);
  };

  const handleModalStartChat = async (mentorId: string) => {
    if (!user) {
      setErrorMessage('User not authenticated.');
      return;
    }
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ recipientId: mentorId }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to start conversation.');
      const result = await response.json();
      setSelectedConversationId(result.conversationId);
      setIsNewConversationModalOpen(false);
      if (window.innerWidth < 1024) {
        setIsListCollapsed(true);
      }
    } catch (err: any) {
      console.error('Error starting new conversation:', err);
      setErrorMessage(err.message);
    }
  };

  const currentSelectedConversation = conversations.find(conv => conv.id === selectedConversationId) || null;

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading user session...</p>
      </div>
    );
  }
  const toggleList = () => {
    setIsListCollapsed(!isListCollapsed);
  };

  return (
    <div className="h-full bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex flex-col relative overflow-hidden">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #374151; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #6b7280; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out ${isListCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={toggleList}
      ></div>

      <div className="flex-grow w-full flex flex-col overflow-hidden">
        <div className="container mx-auto p-6 md:p-12 flex flex-col flex-grow min-h-0 relative">
          <div className="flex items-center justify-between mb-8 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleList}
                className="lg:hidden p-2 text-gray-400 hover:text-white rounded-full transition duration-200"
                aria-label="Toggle Conversations"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-accent-blue)]">
                Messages
              </h1>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-800 text-white p-4 rounded-lg mb-6 text-center flex-shrink-0">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0 h-full relative">
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              onStartNewConversation={handleStartNewConversationClick}
              loading={loadingConversations}
              currentUserUid={user.uid}
              isCollapsed={isListCollapsed}
              onToggleList={toggleList}
            />
            <MessageDisplay
              selectedConversation={currentSelectedConversation}
              currentUserUid={user.uid}
              onSendMessage={handleSendMessage}
              messages={messages}
              loadingMessages={loadingMessages}
            />
          </div>
        </div>
      </div>

      <NewConversationModal
        isOpen={isNewConversationModalOpen}
        mentors={mentors}
        onClose={() => {
          setIsNewConversationModalOpen(false);
          setErrorMessage(null);
        }}
        onStartChat={handleModalStartChat}
        errorMessage={errorMessage}
        loadingMentors={loadingMentors}
      />
    </div>
  );
};

export default MessagesPage;
