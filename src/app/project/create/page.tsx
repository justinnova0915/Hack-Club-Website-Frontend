'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  author: string;
  githubUrl?: string;
  liveUrl?: string;
}

export default function CreateProjectPage() {
  const { user, loading: authLoading, userRole } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const mdeOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", "guide"] as const,
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchProjectForEdit = async () => {
      if (projectId) {
        setPageLoading(true);
        setError(null);
        try {
          const idToken = await user?.getIdToken();
          console.log(`[Frontend] Attempting to fetch project for edit: ${projectId}`);
          const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error(`[Frontend] Failed to fetch project for editing: Status: ${response.status}, Error:`, errorData);
            throw new Error(errorData.error || 'Failed to fetch project for editing.');
          }

          const data: Project = await response.json();
          console.log('[Frontend] Project data fetched for edit:', data);
          setTitle(data.title);
          setDescription(data.description);
          setTechnologies(data.technologies.join(', '));
          setGithubUrl(data.githubUrl || '');
          setLiveUrl(data.liveUrl || '');
        } catch (err: any) {
          console.error('[Frontend] Error fetching project for edit:', err);
          setError(err.message || 'Failed to load project for editing.');
        } finally {
          setPageLoading(false);
        }
      } else {
        setPageLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchProjectForEdit();
    }
  }, [projectId, user, authLoading, router, API_BASE_URL]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim()) {
      setError('Title and description cannot be empty.');
      return;
    }

    if (!user) {
      setError('You must be logged in to create/edit a project.');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      let response;
      let method;
      let url;

      const projectData = {
        title,
        description,
        technologies: technologies.split(',').map(tech => tech.trim()),
        githubUrl,
        liveUrl,
      };

      if (projectId) {
        method = 'PUT';
        url = `${API_BASE_URL}/api/projects/${projectId}`;
        console.log(`[Frontend] Sending PUT request to: ${url}`);
      } else {
        method = 'POST';
        url = `${API_BASE_URL}/api/projects`;
        console.log(`[Frontend] Sending POST request to: ${url}`);
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[Frontend] API Error: Status: ${response.status}, Error:`, errorData);
        throw new Error(errorData.error || `Failed to ${projectId ? 'update' : 'create'} project.`);
      }

      const result = await response.json();
      setSuccess(result.message || `Project ${projectId ? 'updated' : 'created'} successfully!`);
      setTitle('');
      setDescription('');
      setTechnologies('');
      setGithubUrl('');
      setLiveUrl('');
      setTimeout(() => {
        router.push('/project');
      }, 1500);

    } catch (err: any) {
      console.error('[Frontend] Caught error in handleSubmit:', err);
      setError(err.message || `An unexpected error occurred while trying to ${projectId ? 'update' : 'create'} the project.`);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading {projectId ? 'project for editing' : 'page'}...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-red-500">
        <p className="text-xl">Forbidden: You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex flex-col">
      <main className="flex-grow container mx-auto p-6 md:p-12">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[var(--color-accent-blue)]">
            {projectId ? 'Edit Project' : 'Submit a New Project'}
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Showcase your work to the club! Fill out the details below to add your project to the gallery.
          </p>

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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-1">
              <div className="mb-6">
                <label htmlFor="title" className="block text-gray-300 text-lg font-bold mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-[var(--color-accent-blue)] transition duration-200"
                  placeholder="e.g., Awesome Club Website"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="technologies" className="block text-gray-300 text-lg font-bold mb-2">
                  Technologies Used
                </label>
                <input
                  type="text"
                  id="technologies"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-[var(--color-accent-blue)] transition duration-200"
                  placeholder="e.g., Next.js, TypeScript, Firebase"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  required
                />
                <p className="text-gray-500 text-sm mt-2">Please provide a comma-separated list.</p>
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="mb-6">
                <label htmlFor="githubUrl" className="block text-gray-300 text-lg font-bold mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-[var(--color-accent-blue)] transition duration-200"
                  placeholder="https://github.com/your-username/your-repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="liveUrl" className="block text-gray-300 text-lg font-bold mb-2">
                  Live Demo URL (optional)
                </label>
                <input
                  type="url"
                  id="liveUrl"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-[var(--color-accent-blue)] transition duration-200"
                  placeholder="https://your-project-live.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-2 mb-6">
              <label htmlFor="description" className="block text-gray-300 text-lg font-bold mb-2">
                Project Description
              </label>
              <SimpleMDE
                id="description"
                value={description}
                onChange={setDescription}
                options={mdeOptions}
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end space-x-4">
              <Link
                href="/project"
                className="inline-block align-baseline font-bold text-lg text-gray-400 hover:text-gray-200 transition duration-200 px-6 py-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-[var(--color-accent-blue)] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:shadow-outline transition duration-200 text-lg"
              >
                {projectId ? 'Update Project' : 'Submit Project'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}