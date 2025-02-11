import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from '../FirebaseConfigs/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

import './styles/Navbar.css'

const Navbar = () => {
  function GetCurrentUser() {
    const [user, setUser] = useState('')
    const usersCollectionRef = collection(db, "users")
    useEffect(() => {
      auth.onAuthStateChanged(userlogged => {
        if (userlogged) {
          const getUsers = async () => {
            const q = query(usersCollectionRef, where("uid", "==", userlogged.uid))
            const data = await getDocs(q)
            setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
          }
          getUsers();
        }
        else {
          setUser(null)
        }
      })
    }, [])
    return user
  }
  const loggeduser = GetCurrentUser();
  
const navigate = useNavigate();
const handleLogout = () => {
  auth.signOut().then(() => {
    navigate('/login');
  });
};

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-3">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold">MyShop</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <p className="nav-link text-black"><strong>Hej {loggeduser ? loggeduser[0].username || loggeduser[0].email : ""}!</strong></p>
            </li>
            {!loggeduser && (
              <>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Register</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link to="/cart" className="nav-link position-relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                </svg>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {loggeduser ? loggeduser[0].cart.length : 0}
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Profile" className="nav-link text-black">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                </svg>
              </Link>
            </li>
            {loggeduser && (
              <>
                <li className="nav-item">
                  <Link to="/addProduct" className="nav-link">Add Product</Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;
