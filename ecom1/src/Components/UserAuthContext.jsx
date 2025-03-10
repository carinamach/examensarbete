import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from '../FirebaseConfigs/firebaseConfig';
import { collection, doc, query, where, onSnapshot } from 'firebase/firestore';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(userlogged => {
            if (userlogged) {
                // Skapa en query för att hämta användarens dokument
                const q = query(collection(db, "users"), where("uid", "==", userlogged.uid));

                // Lyssna på förändringar i användardokumentet i realtid
                const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        setUser(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                    }
                });

                return () => unsubscribeFirestore(); // Rensa upp när komponenten avmonteras
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
export default UserAuthContext; // Endast export av contextet och providern
