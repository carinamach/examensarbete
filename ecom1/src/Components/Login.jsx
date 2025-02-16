// Importera nödvändiga paket och komponenter
import React, { useState } from 'react';
import Navbar from './Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Login-komponent för användarinloggning
const Login = () => {

  // State-variabler för att hantera formulärdata och meddelanden
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  
  const navigate = useNavigate(); // Hook för navigering mellan sidor
  const auth = getAuth(); // Hämta Firebase auth-instans



  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Funktion som hanterar inloggningsförsök
  const handleLogin = (e) => {
    e.preventDefault(); // Förhindra standardformulärsbeteende
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Vid lyckad inloggning
        setSuccessMsg("Lyckad inloggning! Sidan kommer laddas till HEM.");
        setPassword('');
        setEmail('');
        setErrorMsg('');
        // Omdirigera användaren efter 3 sekunder
        setTimeout(() => {
          setSuccessMsg(''),
            navigate('/home');
        }, 3000);
      })
      .catch((error) => {
        // Funktion för att validera e-postadressformat            
        const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

        // Hantera olika typer av inloggningsfel
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

  // Renderar inloggningsformuläret
  return (
    <div>
      <Navbar />
      {/* Container för centrering av inloggningsformuläret */}
      <div className='container d-flex justify-content-center align-items-center vh-100'>
        <div className='card p-4 shadow' style={{ width: '25rem' }}>
          <h2 className='text-center mb-3'>Login</h2>
          {/* Visa success/error meddelanden om de finns */}
          {successMsg && <div className='alert alert-success'>{successMsg}</div>}
          {errorMsg && <div className='alert alert-danger'>{errorMsg}</div>}
          {/* Inloggningsformulär */}
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
          {/* Länk till registreringssidan */}
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