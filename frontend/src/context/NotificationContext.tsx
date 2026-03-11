import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';

interface Notification {
    id: number;
    title: string;
    body: string;
    read: boolean;
    type: string;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markRead: (id: number) => Promise<void>;
    markAllRead: () => Promise<void>;
    refresh: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = useCallback(() => {
        if (!user) return;
        fetch(`${API_URL}/notifications/${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNotifications(data);
            })
            .catch(err => console.error('Notification fetch error:', err));
    }, [user]);

    // Initial fetch + poll every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markRead = async (id: number) => {
        await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PATCH' });
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = async () => {
        if (!user) return;
        await fetch(`${API_URL}/notifications/read-all/${user.id}`, { method: 'PATCH' });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, refresh: fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
}
