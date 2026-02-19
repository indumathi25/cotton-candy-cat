import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { setUser, logoutAction as logoutReduxAction, selectUser, selectIsAuthenticated } from '../store/authSlice';
import { login as loginService, logout as logoutService } from '../api/authService';
import { User, UserRole } from '../types/auth';

interface LoginParams {
    username: string;
    password: string;
    role: UserRole;
    studentId?: number;
}

interface UseAuthReturn {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string, role: UserRole, studentId?: number) => Promise<User>;
    logout: () => void;
    isLoading: boolean;
    error: Error | null;
}

export const useAuth = (): UseAuthReturn => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const loginMutation = useMutation({
        mutationFn: ({ username, password, role, studentId }: LoginParams) =>
            loginService(username, password, role, studentId),
        onSuccess: (user, variables) => {
            dispatch(setUser({
                user,
                credentials: {
                    username: variables.username,
                    password: variables.password
                }
            }));

            // Navigate to appropriate dashboard
            navigate(user.role === 'STUDENT' ? '/student' : '/admin');
        }
    });

    const login = (username: string, password: string, role: UserRole, studentId?: number): Promise<User> => {
        return loginMutation.mutateAsync({ username, password, role, studentId });
    };

    const logout = (): void => {
        logoutService();
        dispatch(logoutReduxAction());
        navigate('/login');
    };

    return {
        user,
        isAuthenticated,
        login,
        logout,
        isLoading: loginMutation.isPending,
        error: loginMutation.error as Error | null,
    };
};
