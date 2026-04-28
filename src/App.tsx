import { useState } from 'react';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import { User } from './types';

const SESSION_KEY = 'chemo_session_user';

function getSavedUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getSavedUser);

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <DashboardLayout currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;
