"use client";

import keycloak from "@/lib/keycloak";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";



// Define the shape of the user object
interface User {
  // Add the properties you expect from the user info response
  [key: string]: any;
}

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean | null;
  token: string | null;
  user: User | null;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  logout: () => {},
});

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setAuth] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const isRun = useRef(false);

  const getUserInfo = async (token: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      const data: User = await res.json();
      setUser(data);
      setAuth(true);
    } else {
      login();
    }
  };

  const login = async () => {
    if (isRun.current || !keycloak) return;
    isRun.current = true;
    try {
      const authenticated = await keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false,
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      });
      
      setKeycloakInitialized(true);
      setAuth(authenticated);
      
      if (authenticated && keycloak.token) {
        setCookie("access_token", keycloak.token);
        setToken(keycloak.token);
        await getUserInfo(keycloak.token);
      }

      // Set up token refresh
      if (authenticated) {
        setInterval(() => {
          keycloak.updateToken(70).catch(() => {
            console.error('Failed to refresh token');
          });
        }, 60000);
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      setAuth(false);
      setKeycloakInitialized(false);
      isRun.current = false;
    }
  };

  const logout = useCallback(async () => {
    try {
      if (!keycloakInitialized) {
        console.warn('Keycloak not initialized');
        deleteCookie('access_token');
        window.location.reload();
        return;
      }

      if (!keycloak?.authenticated) {
        console.warn('Not authenticated');
        deleteCookie('access_token');
        window.location.reload();
        return;
      }

      // Clear local state first
      setAuth(false);
      setUser(null);
      setToken(null);
      setKeycloakInitialized(false);
      deleteCookie('access_token');
      
      // Then attempt Keycloak logout
      const redirectUri = window.location.origin;
      await keycloak.logout({
        redirectUri
      });
    } catch (error) {
      console.error('Failed to logout:', error);
      // Clear everything and reload as fallback
      deleteCookie('access_token');
      window.location.reload();
    }
  }, [keycloakInitialized]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = getCookie("access_token");
        if (!accessToken) {
          await login();
        } else {
          if (keycloak && keycloak.token) {
            setToken(keycloak.token);
            setKeycloakInitialized(true);
            setAuth(true);
            await getUserInfo(keycloak.token);
          } else {
            // Token exists but Keycloak not initialized, try to login
            await login();
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        setAuth(false);
        setKeycloakInitialized(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);