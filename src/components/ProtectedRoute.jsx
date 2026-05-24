import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, validateSession } from '../lib/auth';

export default function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!isAuthenticated()) {
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      const user = await validateSession();
      setIsValid(Boolean(user));
      setIsChecking(false);
    };

    check();
  }, []);

  if (isChecking) {
    return <div className="min-h-screen bg-black text-zinc-400 grid place-items-center">Checking session...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
