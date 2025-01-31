// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from '@aws-amplify/auth';
// import awsconfig from './aws-exports'; // Ensure this path is correct
import Landing from './pages/Landing/Landing';
import Tool from './pages/Tool/Tool';
import SignIn from './pages/SignIn/SignIn';
import DarkBlankLoadingPage from './pages/DarkBlankLoadingPage/DarkBlankLoadingPage';

import awsConfig from './aws-config';

if (process.env.REACT_APP_NODE_ENV !== 'production') {
  import('./aws-exports').then((awsconfig) => {
    Amplify.configure({
      ...awsconfig.default,
      Auth: {
        ...awsconfig.default.Auth,
        storage: window.localStorage, // ✅ Ensure session persists in localStorage
        cookieStorage: {
          domain: window.location.hostname, // ✅ Ensure correct domain
          secure: true, // ✅ Only use HTTPS in production
          path: "/",
          expires: 365, // ✅ Store session for 1 year
        },
      },
    });
  }).catch((error) => {
    console.error("Error loading aws-exports:", error);
  });
} else {
  Amplify.configure({
    "aws_project_region": 'us-east-1',
    "aws_appsync_graphqlEndpoint": process.env.REACT_APP_AWS_APPSYNC_GRAPHQL_ENDPOINT || '',
    "aws_appsync_region": 'us-east-1',
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": process.env.REACT_APP_AWS_APPSYNC_API_KEY || '',
    "aws_cognito_identity_pool_id": process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID || '',
    "aws_cognito_region": 'us-east-1',
    "aws_user_pools_id": process.env.REACT_APP_AWS_USER_POOLS_ID || '',
    "aws_user_pools_web_client_id": process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID || '',
    "oauth": {},
    "aws_cognito_username_attributes": ["EMAIL"],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": ["SMS"],
    "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": [
        "REQUIRES_LOWERCASE",
        "REQUIRES_NUMBERS",
        "REQUIRES_SYMBOLS",
        "REQUIRES_UPPERCASE"
      ]
    },
    "aws_cognito_verification_mechanisms": ["EMAIL"],
    Auth: {
      storage: window.localStorage, // ✅ Store session in localStorage
      cookieStorage: {
        domain: window.location.hostname, // ✅ Ensure correct domain
        secure: true, // ✅ Enable HTTPS in production
        path: "/",
        expires: 365, // ✅ Persist session for 1 year
      },
    }
  });
}

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const debugSession = async () => {
      try {
        const session = await fetchAuthSession();
        console.log("🔍 [DEBUG] Session Object:", session);

        const accessToken = session?.tokens?.accessToken?.toString() || "No Access Token";
        console.log("🔍 [DEBUG] Access Token:", accessToken);

        const idToken = session?.tokens?.idToken?.toString() || "No ID Token";
        console.log("🔍 [DEBUG] ID Token:", idToken);

        const validAuth = !!session?.tokens?.accessToken;
        setIsAuthenticated(validAuth);
      } catch (error) {
        console.error("⚠️ [ERROR] fetchAuthSession failed:", error);
      }
      setLoading(false);
    };

    debugSession();
  }, []);

  if (loading) {
    return <DarkBlankLoadingPage />;
  }

  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

// UnauthenticatedRoute Component
const UnauthenticatedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const debugSession = async () => {
      try {
        const session = await fetchAuthSession();
        console.log("🔍 [DEBUG] Session Object:", session);

        const accessToken = session?.tokens?.accessToken?.toString() || "No Access Token";
        console.log("🔍 [DEBUG] Access Token:", accessToken);

        const idToken = session?.tokens?.idToken?.toString() || "No ID Token";
        console.log("🔍 [DEBUG] ID Token:", idToken);

        const validAuth = !!session?.tokens?.accessToken;
        setIsAuthenticated(validAuth);
      } catch (error) {
        console.error("⚠️ [ERROR] fetchAuthSession failed:", error);
      }
      setLoading(false);
    };

    debugSession();
  }, []);

  if (loading) {
    return <DarkBlankLoadingPage />;
  }

  return isAuthenticated ? <Navigate to="/tool" /> : children;
};

// HomeRedirect Component
const HomeRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const debugSession = async () => {
      try {
        const session = await fetchAuthSession();
        console.log("🔍 [DEBUG] Session Object:", session);

        const accessToken = session?.tokens?.accessToken?.toString() || "No Access Token";
        console.log("🔍 [DEBUG] Access Token:", accessToken);

        const idToken = session?.tokens?.idToken?.toString() || "No ID Token";
        console.log("🔍 [DEBUG] ID Token:", idToken);

        const validAuth = !!session?.tokens?.accessToken;
        setIsAuthenticated(validAuth);
      } catch (error) {
        console.error("⚠️ [ERROR] fetchAuthSession failed:", error);
      }
      setLoading(false);
    };

    debugSession();
  }, []);

  if (loading) {
    return <DarkBlankLoadingPage />;
  }

  return isAuthenticated ? <Navigate to="/tool" /> : <Navigate to="/sign-in" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/landing" element={<Landing />} />
        <Route
          path="/sign-in"
          element={
            <UnauthenticatedRoute>
              <SignIn />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path="/tool"
          element={
            <ProtectedRoute>
              <Tool />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
