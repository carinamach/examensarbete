import { useContext } from 'react';
import UserAuthContext from './UserAuthContext';

export function useUser() {
    return useContext(UserAuthContext);
}
