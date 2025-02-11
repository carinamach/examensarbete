import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '../FirebaseConfigs/firebaseConfig'

const Profile = () => {
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

  return (
    <div>
      <Navbar />    
      <div>
        {loggeduser ? (
          <div>
            <h1 className="text-center p-4">Din profil </h1>
            <div className="d-flex justify-content-center">
              <table className="table table-striped table-bordered w-50">
                <thead>
                  <tr>
                    <th>Namn</th>
                    <th>Email</th>
                    <th>Lösenord</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{loggeduser[0].username}</td>
                    <td>{loggeduser[0].email}</td>
                    <td>{loggeduser[0].password}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            {setTimeout(() => {
              return <h1>Logga in för att se din profil</h1>
            }, 3000)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile