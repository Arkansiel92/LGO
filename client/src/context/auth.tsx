// AuthContext.tsx

import { createContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}



interface AuthContextProps {
  authState: AuthState;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextProps>({
  authState: initialAuthState,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) setAuthState({user : null, isAuthenticated : true})
  }, [])

  const login = (email: string, token: string) => {
    
    localStorage.setItem('token', token);

    const user: User = {
      id: "1",
      email: email,
      token: token
    };

    setAuthState({ user, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState(initialAuthState);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
