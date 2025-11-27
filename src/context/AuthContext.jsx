import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('displayName'));
  const [avatarPath, setAvatarPath] = useState(() => localStorage.getItem('avatarPath'));

  const login = (newToken, newRole, newUserId, newDisplayName) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('userId', newUserId);
    localStorage.setItem('displayName', newDisplayName);
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
    setDisplayName(newDisplayName);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('displayName');
    localStorage.removeItem('avatarPath');
    setToken(null);
    setRole(null);
    setUserId(null);
    setDisplayName(null);
    setAvatarPath(null);
  };

  const updateAvatar = (path) => {
    localStorage.setItem('avatarPath', path);
    setAvatarPath(path);
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, displayName, avatarPath, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
