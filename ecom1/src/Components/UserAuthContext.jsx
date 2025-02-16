// Import necessary hooks and functions from React and Firebase
import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from '../FirebaseConfigs/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Create a context for user authentication
const UserAuthContext = createContext();

// Provider component that wraps the app and provides user authentication state
export function UserAuthProvider({ children }) {
    // State to store the current user's data
    const [user, setUser] = useState('');
    // Reference to the users collection in Firestore
    const usersCollectionRef = collection(db, "users");

    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = auth.onAuthStateChanged(userlogged => {
            if (userlogged) {
                // If user is logged in, fetch their data from Firestore
                const getUsers = async () => {
                    // Query Firestore for user document matching the auth UID
                    const q = query(usersCollectionRef, where("uid", "==", userlogged.uid));
                    const data = await getDocs(q);
                    // Update user state with the fetched data
                    setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                }
                getUsers();
            } else {
                // If no user is logged in, set user state to null
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Provide user data to child components
    return (
        <UserAuthContext.Provider value={user}>
            {children}
        </UserAuthContext.Provider>
    );
}

// Custom hook to access user data from any component
export function useUser() {
    return useContext(UserAuthContext);
}