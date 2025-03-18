// Importera nödvändiga paket och komponenter
import React, { useState } from 'react';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Login-komponent för användarinloggning
const Login = () => {
    // State-variabler för att hantera formulärdata och meddelanden
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate(); // Hook för navigering mellan sidor
    const auth = getAuth(); // Hämta Firebase auth-instans

    // Funktion för att hantera inloggningsförsök
    const handleLogin = (e) => {
        e.preventDefault(); // Förhindra standardformulärsbeteende
        
        if (!email || !password) {
            setErrorMsg("Alla fält måste fyllas i");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Vid lyckad inloggning
                setSuccessMsg("Lyckad inloggning! Sidan kommer laddas till HEM.");
                setEmail('');
                setPassword('');
                setErrorMsg('');
                
                // Omdirigera användaren efter 3 sekunder
                setTimeout(() => {
                    navigate('/home');
                }, 3000);
            })
            .catch((error) => {
                // Hantera olika typer av inloggningsfel
                if (error.code === 'auth/invalid-email') {
                    setErrorMsg('Ogiltig e-postadress');
                } else if (error.code === 'auth/user-not-found') {
                    setErrorMsg('E-postadressen hittas inte');
                } else if (error.code === 'auth/wrong-password') {
                    setErrorMsg('Fel lösenord.');
                } else if (error.code === 'auth/invalid-credential') {
                    setErrorMsg('Ogiltigt användarnamn och/eller lösenord');
                } else {
                    setErrorMsg('Ett fel uppstod. Försök igen.');
                }
            });
    };

    // Renderar inloggningsformuläret
    return (
        <>
            <Navbar />
            <main className='container d-flex justify-content-center align-items-center vh-100'>
                <section className='card p-4 shadow' style={{ width: '25rem' }}>
                    <h2 className='text-center mb-3'>Login</h2>
                    {/* Visa success/error meddelanden om de finns */}
                    {successMsg && <div className='alert alert-success'>{successMsg}</div>}
                    {errorMsg && <div className='alert alert-danger'>{errorMsg}</div>}
                    
                    {/* Inloggningsformulär */}
                    <form onSubmit={handleLogin}>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='email'>E-post</label>
                            <input type='email' id='email' className='form-control' placeholder='E-post' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='password'>Lösenord</label>
                            <input type='password' id='password' className='form-control' placeholder='Lösenord' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type='submit' className='btn primary w-100'>Logga in</button>
                    </form>
                    
                    {/* Länk till registreringssidan */}
                    <div className='text-center mt-3'>
                        <span>Har du inte ett konto?</span>
                        <Link to='/signup' className='ms-1'>Registrera dig</Link>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Login;
