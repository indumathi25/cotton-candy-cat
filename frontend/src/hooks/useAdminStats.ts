import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminStats } from '../types/admin';
import { getAuthCredentials } from '../api/authService';
import { API_ENDPOINTS } from '../constants';

interface UseAdminStatsReturn {
    stats: AdminStats | null;
    loading: boolean;
    error: string | null;
}

export const useAdminStats = (): UseAdminStatsReturn => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const credentials = getAuthCredentials();

                let config = {};
                if (credentials) {
                    config = {
                        auth: {
                            username: credentials.username,
                            password: credentials.password
                        }
                    };
                }

                const response = await axios.get(API_ENDPOINTS.ADMIN_STATS, config);
                setStats(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch admin statistics');
                console.error('Error fetching admin stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};
