'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  authorName: string;
  githubUrl?: string;
  liveUrl?: string;
}

export default function ProjectDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const { id } = params;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch project details.');
          }
          const data = await response.json();
          setProject(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, API_BASE_URL]);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <p>Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-white">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
      <main className="container mx-auto p-6 md:p-12">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-accent-blue)]">
              {project.title}
            </h1>
            {user && (
              <Link href={`/project/create?id=${project.id}`} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200">
                Edit
              </Link>
            )}
          </div>
          <p className="text-gray-400 text-lg mt-2 mb-6">
            By {project.authorName}
          </p>

          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />

          <div className="mt-8">
            <h3 className="text-2xl font-bold text-[var(--color-accent-green)] mb-4">Technologies Used:</h3>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span key={tech} className="bg-gray-700 text-gray-300 text-md font-medium px-4 py-2 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-700 flex justify-start space-x-4">
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 font-bold text-lg transition-colors duration-200">
                View on GitHub
              </Link>
            )}
            {project.liveUrl && (
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-600 font-bold text-lg transition-colors duration-200">
                View Live Demo
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}