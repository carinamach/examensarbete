import React, { useState } from 'react';
import Navbar from './Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook för att navigera till andra sidor
  const auth = getAuth();
  // State för att hantera fel- och framgångsmeddelanden
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSuccessMsg("Lyckad inloggning! Sidan kommer laddas till HEM.");
        setPassword('');
        setEmail('');
        setErrorMsg('');
        setTimeout(() => {
          setSuccessMsg(''),
            navigate('/home');
        }, 3000);
      })
      .catch((error) => {
        // Hanterar olika felmeddelanden från Firebase Authentication            
        const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

        if (error.message.includes('auth/invalid-email')) {
          setErrorMsg('Ogiltig e-postadress');
      
        } else if (error.message.includes('auth/user-not-found')) {
          setErrorMsg('E-postadressen hittas inte');
        } else if (error.message.includes('auth/wrong-password')) {
          setErrorMsg('Fel lösenord.');
        } else if (error.message.includes('auth/invalid-credential')) {
          setErrorMsg('Ogiltlig användarnamn och/ eller lösenord');
        } else if (!email || !password) {
          setErrorMsg("Alla fält måste fyllas i");
        } else if (!validateEmail(email)) {
          setErrorMsg("Ogiltig e-postadressformat.");
        }
        else {
          setErrorMsg(error.message);
        }
      })
  }
  return (

    <div>
      <Navbar />
      <div className='container d-flex justify-content-center align-items-center vh-100'>
        <div className='card p-4 shadow' style={{ width: '25rem' }}>
          <h2 className='text-center mb-3'>Login</h2>
          {successMsg && <div className='alert alert-success'>{successMsg}</div>}
          {errorMsg && <div className='alert alert-danger'>{errorMsg}</div>}
          <form onSubmit={handleLogin}>
            <div className='mb-3'>
              <label className='form-label'>E-post</label>
              <input type='email' className='form-control' placeholder='E-post' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Lösenord</label>
              <input type='password' className='form-control' placeholder='Lösenord' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className='btn btn-primary w-100'>Logga in</button>
          </form>
          <div className='text-center mt-3'>
            <span>Har du inte ett konto?</span>
            <Link to='/signup' className='ms-1'>Registrera dig</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login