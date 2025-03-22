import { useState, useEffect, createContext } from 'react';
import { auth, db } from '../FirebaseConfigs/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(userlogged => {
            if (userlogged) {
                const q = query(collection(db, "users"), where("uid", "==", userlogged.uid));

                // Lyssna på förändringar i användardokumentet i realtid
                const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        setUser(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                    }
                });

                return () => unsubscribeFirestore(); 
            } else {
                setUser(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <UserAuthContext.Provider value={user}>
            {children}
        </UserAuthContext.Provider>
    );
}
export default UserAuthContext;