'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  authorName: string;
  githubUrl?: string;
  liveUrl?: string;
}

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pageEnabled = process.env.NEXT_PUBLIC_FEATURE_PAGE_ENABLED === 'true';

  useEffect(() => {
    if (!pageEnabled) {
      router.replace('/');
    }
  }, [pageEnabled, router]);

  if (!pageEnabled) {
    return null;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex flex-col">
      <main className="flex-grow container mx-auto p-6 md:p-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-[var(--color-accent-blue)] text-center">
          Club Projects
        </h1>

        {user && (
          <div className="text-center mb-8">
            <Link href="/project/create" className="bg-[var(--color-accent-green)] text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Create a Project
            </Link>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col hover:border-[var(--color-accent-blue)] transition-colors duration-200 cursor-pointer"
              onClick={() => router.push(`/project/${project.id}`)}
            >
              <h2 className="text-2xl font-bold mb-2 text-[var(--color-accent-green)]">{project.title}</h2>
              <p className="text-gray-400 text-sm mb-4">By {project.authorName}</p>
              <div className="text-gray-300 leading-relaxed mb-4 flex-grow line-clamp-3" dangerouslySetInnerHTML={{ __html: project.description }} />
              
              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-200 mb-2">Technologies Used:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-700 flex justify-start space-x-4">
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 font-bold transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on GitHub
                  </Link>
                )}
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-600 font-bold transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Live
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}