import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Walkthrough } from '../onboarding/Walkthrough';

const WALKTHROUGH_KEY = 'nexus_walkthrough_seen';

const walkthroughSteps = [
  {
    title: 'Welcome to Business Nexus',
    description: 'This quick tour highlights the new collaboration features added to the platform.',
  },
  {
    title: 'Meeting Scheduler',
    description:
      'Use the Calendar section to set your availability and request meetings with investors or entrepreneurs.',
  },
  {
    title: 'Video Calls',
    description: 'Jump into a mock video call with any connection directly from the Video Call section.',
  },
  {
    title: 'Document Chamber',
    description: 'Upload deal documents, track their status, and e-sign them without leaving the platform.',
  },
  {
    title: 'Payments',
    description: 'Track your wallet balance, transaction history, and simulate funding deals.',
  },
];

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showWalkthrough, setShowWalkthrough] = useState(
    () => isAuthenticated && !localStorage.getItem(WALKTHROUGH_KEY)
  );

  const finishWalkthrough = () => {
    localStorage.setItem(WALKTHROUGH_KEY, 'true');
    setShowWalkthrough(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {showWalkthrough && user && <Walkthrough steps={walkthroughSteps} onFinish={finishWalkthrough} />}
    </div>
  );
};
