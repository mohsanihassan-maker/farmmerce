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
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                // We still need the user details from our local storage or DB
                const storedUser = localStorage.getItem('fammerce_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                setToken(session.access_token);
                localStorage.setItem('fammerce_token', session.access_token);
            }
            
            setLoading(false);
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                setToken(session.access_token);
                localStorage.setItem('fammerce_token', session.access_token);
            } else {
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

