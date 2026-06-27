import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Lazy load route pages for performance & bundle splitting
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Landing = lazy(() => import('./pages/Landing'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Focus = lazy(() => import('./pages/Focus'));
const History = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));

const PageLoader = () => (
  <div className="flex h-screen bg-[#02040a] overflow-hidden">
    {/* Skeleton Sidebar */}
    <div className="w-64 border-r border-white/[0.04] bg-[#02040a]/60 p-6 hidden md:flex flex-col gap-6">
      <div className="h-8 w-32 bg-white/5 rounded animate-pulse"></div>
      <div className="space-y-4 mt-8">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-6 w-full bg-white/5 rounded animate-pulse"></div>)}
      </div>
    </div>
    {/* Skeleton Main Content */}
    <div className="flex-1 p-8">
      <div className="h-10 w-48 bg-white/5 rounded animate-pulse mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>)}
      </div>
      <div className="h-64 bg-white/5 rounded-2xl animate-pulse w-full max-w-4xl"></div>
    </div>
  </div>
);

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#161b22',
            color: '#e6edf3',
            border: '1px solid #30363d',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#3fb950',
              secondary: '#161b22',
            },
          },
          error: {
            iconTheme: {
              primary: '#f85149',
              secondary: '#161b22',
            },
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
