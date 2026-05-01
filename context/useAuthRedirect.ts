// hooks/useAuthRedirect.ts
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastContext';

export const useAuthRedirect = ({
    requireAuth = false,
    redirectTo = '/login',
    redirectIfAuthenticated = false,
}: {
    requireAuth?: boolean;
    redirectTo?: string;
    redirectIfAuthenticated?: boolean;
}) => {
    const router = useRouter();
    const { showToast } = useToast();
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || hasTriggered.current) return;
        
        const token = localStorage.getItem('userId');

        if (requireAuth && !token) {
            hasTriggered.current = true;
            showToast("Please login to view your orders", "warning");
            router.push(redirectTo);
        }

        if (redirectIfAuthenticated && token) {
            router.push('/');
        }
    }, []);
};
