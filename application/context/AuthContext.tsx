import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/axios';
import { useRouter, useSegments } from 'expo-router';

const TOKEN_KEY = 'my-jwt';

interface AuthState {
  token: string | null;
  authenticated: boolean;
  user: { id: number; name: string; email: string } | null;
}

interface AuthContextType {
  onRegister?: (name: string, email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => void;
  authState: AuthState;
}

const AuthContext = createContext<AuthContextType>({
  authState: { token: null, authenticated: false, user: null },
});

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(authState: AuthState) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!authState.authenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (authState.authenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [authState.authenticated, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
    user: null,
  });

  useProtectedRoute(authState);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        try {
          const userPayload = JSON.parse(atob(token.split('.')[1]));
          setAuthState({
            token: token,
            authenticated: true,
            user: { id: userPayload.id, name: userPayload.name, email: userPayload.email },
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (e) {
          console.error('Failed to parse token', e);
        }
      }
    };
    loadToken();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post('/users/register', { name, email, password });
      return { error: false };
    } catch (e: any) {
      return { error: true, msg: e.response.data.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      const { token, user } = data;
      setAuthState({ token, authenticated: true, user });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return { error: false };
    } catch (e: any) {
      return { error: true, msg: e.response.data.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    api.defaults.headers.common['Authorization'] = '';
    setAuthState({ token: null, authenticated: false, user: null });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
