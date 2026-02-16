import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, logoutAction as logoutReduxAction, selectUser, selectIsAuthenticated } from '../store/authSlice';
import { login as loginService, logout as logoutService } from '../api/authService';
import { User, UserRole } from '../types/auth';

interface UseAuthReturn {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const login = async (username: string, password: string, role: UserRole): Promise<void> => {
        const user = await loginService(username, password, role);
        dispatch(setUser({ user, credentials: { username, password } }));

        // Navigate to appropriate dashboard
        navigate(user.role === 'STUDENT' ? '/student' : '/admin');
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
    };
};
