//Author: Shiwen(Lareina) Yang
import { Navigate } from 'react-router-dom';
import { useUser } from './userContext';

export const GuardedRoute = ({ component }) => {

    const { user } = useUser();
    const auth = user._id !== '' 

    return auth ? component : <Navigate to="/login" />;
};