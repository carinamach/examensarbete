import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../FirebaseConfigs/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './styles/style.css'

const Signup = () => {
  // State för att lagra användarens input
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Förhindrar att sidan laddas om vid formulärinlämning

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const initialcartvalue = 0; 
        console.log(user);
        
        addDoc(collection(db, "users"), {
          username: username,
          email: email,
          password: password, //lägger den är bara för att visa att jag kan använda lösenordet. Firebase auth löser det annars. 
          cart: initialcartvalue,
          uid: user.uid,
          purchaseHistory: []
        })
          .then(() => {
            setSuccessMsg("Ny användare registrerad! Sidan kommer laddas om till inloggningssidan.");
            setUserName('');
            setPassword('');
            setEmail('');
            setErrorMsg('');
            
        
            setTimeout(() => {
              setSuccessMsg('');
              navigate('/login');
            }, 2000);
          })
          .catch((error) => setErrorMsg(error.message));
      })
      .catch((error) => {
        if (error.message.includes('auth/invalid-email')) {
          setErrorMsg('Ogiltig e-postadress');
        } else if (error.message.includes('auth/email-already-in-use')) {
          setErrorMsg('E-postadressen används redan');
        } else if (error.message.includes('auth/weak-password')) {
          setErrorMsg('Lösenordet är för svagt. Välj ett starkare lösenord.');
        } else if (!email || !password || !username) {
          setErrorMsg("Alla fält måste fyllas i");
        } else if (password.length < 6) {
          setErrorMsg("Lösenordet måste vara minst 6 tecken");
        } else {
          setErrorMsg(error.message);
        }
      });
  };

  return (
    <div>
      <div className='container d-flex justify-content-center align-items-center vh-100'>
        <div className='card p-4 shadow' style={{ width: '25rem' }}>
          <h2 className='text-center mb-3'>Skapa konto</h2>
          {successMsg && <div className='alert alert-success'>{successMsg}</div>}
          {errorMsg && <div className='alert alert-danger'>{errorMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label className='form-label'>Användarnamn</label>
              <input type='text' className='form-control' placeholder='Användarnamn' onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className='mb-3'>
              <label className='form-label'>E-post</label>
              <input type='email' className='form-control' placeholder='E-post' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Lösenord</label>
              <input type='password' className='form-control' placeholder='Lösenord' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type='submit' className='btn primary w-100'>Registrera dig</button>
          </form>
          <div className='text-center mt-3'>
            <span>Har du redan ett konto?</span>
            <Link to='/login' className='ms-1'>Logga in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Signup;
