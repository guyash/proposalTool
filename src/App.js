import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut } from '@aws-amplify/auth';
import awsconfig from './aws-exports'; // Ensure this path is correct
import Landing from './pages/Landing/Landing';
import Tool from './pages/Tool/Tool';
import SignIn from './pages/SignIn/SignIn';
import DarkBlankLoadingPage from './pages/DarkBlankLoadingPage/DarkBlankLoadingPage';

// ✅ Configure Amplify with NO session persistence
Amplify.configure({
  ...awsconfig,
  Auth: {
    ...awsconfig.Auth,
    storage: null, // ✅ Disable persistent authentication
  },
});

// ✅ Force sign-out every time the app loads
const forceSignOut = async () => {
  try {
    console.log("🔄 [DEBUG] Signing out user to prevent session persistence...");
    await signOut({ global: true });
  } catch (error) {
    console.error("⚠️ [ERROR] Sign-out failed:", error);
  }
};

// Run sign-out on app load
forceSignOut();

// ProtectedRoute Component (Ensures only signed-in users can access)
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        console.log("🔍 [DEBUG] Session Object:", session);
        const validAuth = !!session?.tokens?.accessToken;
        setIsAuthenticated(validAuth);
      })
      .catch((error) => {
        console.error("⚠️ [ERROR] fetchAuthSession failed:", error);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DarkBlankLoadingPage />;
  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

// UnauthenticatedRoute Component (Ensures only non-signed-in users can access)
const UnauthenticatedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        console.log("🔍 [DEBUG] Session Object:", session);
        const validAuth = !!session?.tokens?.accessToken;
        setIsAuthenticated(validAuth);
      })
      .catch((error) => {
        console.error("⚠️ [ERROR] fetchAuthSession failed:", error);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DarkBlankLoadingPage />;
  return isAuthenticated ? <Navigate to="/tool" /> : children;
};

// HomeRedirect Component (Decides where to send users)
const HomeRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        console.log("🔍 [DEBUG] Session Object:", session);
        const validAuth = !!session?.tokens?.accessToken;
        setIsAuthenticated(validAuth);
      })
      .catch((error) => {
        console.error("⚠️ [ERROR] fetchAuthSession failed:", error);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DarkBlankLoadingPage />;
  return isAuthenticated ? <Navigate to="/tool" /> : <Navigate to="/sign-in" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/sign-in" element={
          <UnauthenticatedRoute>
            <SignIn />
          </UnauthenticatedRoute>
        }/>
        <Route path="/tool" element={
          <ProtectedRoute>
            <Tool />
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
