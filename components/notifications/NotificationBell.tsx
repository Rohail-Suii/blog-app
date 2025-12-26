/**
 * Notification Bell Component
 * Shows notification count and dropdown
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { formatDistanceToNow } from 'date-fns';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT, MARK_NOTIFICATION_READ, MARK_ALL_NOTIFICATIONS_READ } from '@/graphql';
import type { GetNotificationsResponse, GetUnreadNotificationCountResponse, Notification } from '@/graphql';
import { useAuth } from '@/lib/auth';

export function NotificationBell() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get unread count
    const { data: countData } = useQuery<GetUnreadNotificationCountResponse>(
        GET_UNREAD_NOTIFICATION_COUNT,
        { skip: !user, pollInterval: 30000 }
    );

    // Get notifications
    const { data: notifData, refetch } = useQuery<GetNotificationsResponse>(
        GET_NOTIFICATIONS,
        {
            variables: { first: 10, offset: 0 },
            skip: !user || !isOpen,
        }
    );

    const [markRead] = useMutation(MARK_NOTIFICATION_READ);
    const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

    const unreadCount = countData?.notificationsCollection?.edges?.length || 0;
    const notifications = notifData?.notificationsCollection?.edges?.map(e => e.node) || [];

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleMarkAllRead = async () => {
        if (user) {
            await markAllRead({ variables: { user_id: user.id } });
            refetch();
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await markRead({ variables: { id: notification.id } });
        }
        // Navigate based on notification type
        if (notification.data && typeof notification.data === 'object') {
            const data = notification.data as Record<string, string>;
            if (data.post_id) {
                window.location.href = `/posts/${data.post_id}`;
            }
        }
        setIsOpen(false);
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`block w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                >
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {notif.title}
                                    </p>
                                    {notif.message && (
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {notif.message}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
