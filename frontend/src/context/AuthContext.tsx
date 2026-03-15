import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        const initAuth = async () => {
            try {
                console.log('Initializing Auth...');
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) throw sessionError;

                const storedUser = localStorage.getItem('fammerce_user');
                const storedToken = localStorage.getItem('fammerce_token');

                if (session) {
                    console.log('Supabase session found');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                    setToken(session.access_token);
                    localStorage.setItem('fammerce_token', session.access_token);
                } else if (storedUser && storedToken) {
                    console.log('Local session fallback found');
                    // Fallback for custom backend session
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                } else {
                    console.log('No active session found');
                }
            } catch (err) {
                console.error('Auth initialization failed:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change event:', event);
            if (event === 'PASSWORD_RECOVERY') {
                window.location.href = '/reset-password';
                // The original instruction had JSX here, which is not valid in this context.
                // If a redirect with a message is needed, it should be handled by the component
                // that consumes this context or by a dedicated redirect component.
                // For now, just redirecting.
                return;
            }

            if (session) {
                console.log('Auth state change: Session found');
                setToken(session.access_token);
                localStorage.setItem('fammerce_token', session.access_token);
            } else {
                console.log('Auth state change: No session found');
                setUser(null);
                setToken(null);
                localStorage.removeItem('fammerce_user');
                localStorage.removeItem('fammerce_token');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('fammerce_user', JSON.stringify(userData));
        localStorage.setItem('fammerce_token', authToken);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setToken(null);
        localStorage.removeItem('fammerce_user');
        localStorage.removeItem('fammerce_token');
        window.location.href = '/login';
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

