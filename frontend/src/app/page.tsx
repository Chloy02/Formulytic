"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    // Check if user is admin and redirect to admin dashboard
    if (isLoggedIn && user && user.role === 'admin') {
      router.push('/admin-dashboard');
      return;
    }

    // Check if a project has been selected
    const storedProject = localStorage.getItem('selectedProject');
    if (storedProject) {
      setSelectedProject(JSON.parse(storedProject));
      // Project is selected, show the main landing page
      router.push('/landing');
    } else {
      // No project selected, redirect to project selection
      router.push('/project-selection');
    }
  }, [isLoggedIn, user, router]);

  // Show loading while determining where to redirect
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%)'
    }}>
      <div>Loading...</div>
    </div>
  );
};

export default HomePage;
