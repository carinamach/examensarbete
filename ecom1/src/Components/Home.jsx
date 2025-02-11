import { useState, useEffect } from 'react';
import Navbar from './Navbar'
import Products from './Products'
import { auth, db } from '../FirebaseConfigs/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';


const Home = () => {
    function GetCurrentUser() {
        const [user, setUser] = useState('')
        const usersCollectionRef = collection(db, "users")
        useEffect(() => {
            auth.onAuthStateChanged(userlogged => {
                if (userlogged) {
                    const getUsers = async () => {
                        const q = query(usersCollectionRef, where("uid", "==", userlogged.uid))
                        const data = await getDocs(q)
                        setUser (data.docs.map((doc)=>({...doc.data(), id:doc.id})))
                    }                
                    getUsers();
                }
                else{
                    setUser(null)
                }
            })
        },[])
        return user
    }
const loggeduser= GetCurrentUser(); 

// console.log(loggeduser)
    return (
        <div>
            <Navbar />
            <Products />
            <p>{loggeduser ? loggeduser[0].username || loggeduser[0].email : "No Username"}</p>
            </div>
    )

}
export default Home