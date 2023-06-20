import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

interface title {
  title: string,
  color: string
}

interface notification {
  id: number,
  description: string
}

interface clan {
  id: number,
  name: string,
  banner: string,
  emblem: string
}

interface User {
  id: number;
  clan: number;
  notifications: notification[];
  membersClan: {clan: clan};
  title: title;
  username: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  login: (token: string) => void;
  logout: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextProps>({
  authState: initialAuthState,
  login: () => { },
  logout: () => { }
});

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const decodeJwt = (token: string) => jwt_decode(token);
  
  const login = (token: string) => {
    
    localStorage.setItem('token', token);
    
    const decode_user: any = decodeJwt(token);

    fetch('https://localhost:8000/api/users?username=' + decode_user.username, {
      method: 'GET',
      headers: {
        'accept':'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      const user: User = data.find((user: User) => user.username === decode_user.username)

      setAuthState({ user, isAuthenticated: true });
    })
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState(initialAuthState);
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      login(token);

      
    };
  }, [])

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
