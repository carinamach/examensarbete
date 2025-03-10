import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfigs/firebaseConfig';
import { useUser } from './UseUser';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const loggeduser = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!loggeduser) {
        setError('Du måste vara inloggad för att se din kundvagn');
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', loggeduser[0].id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setCartItems(userData.cart || []);
          calculateTotal(userData.cart || []);
        } else {
          setError('Användaren kunde inte hittas');
        }
      } catch (err) {
        setError('Ett fel uppstod vid hämtning av kundvagnen');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [loggeduser]);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  };

  const handleFakePayment = async (event) => {
    event.preventDefault();
    alert('Betalning genomförd! Tack för ditt köp!');

    // Rensa kundvagnen i Firestore och spara köpet
    try {
      const userRef = doc(db, 'users', loggeduser[0].id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const purchaseHistory = userData.purchaseHistory || [];

        // Lägg till nuvarande köp i historiken
        purchaseHistory.push({
          items: cartItems,
          total: totalAmount,
          date: new Date().toISOString() // Spara datum för köpet
        });

        // Uppdatera användardokumentet
        await updateDoc(userRef, {
          cart: [], // Sätt kundvagnen till en tom array
          purchaseHistory: purchaseHistory // Spara köphistorik
        });

        setCartItems([]); // Rensa lokal state
        setPaymentSuccess(true); // Indikera att betalningen lyckades

        // Redirect to home after 4 seconds
        setTimeout(() => {
          setPaymentSuccess(false); // Clear success message
          navigate('/'); // Redirect to home
        }, 4000);
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
      alert('Kunde inte spara köpet');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        {loading && <div>Laddar...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && (
          <>
            <h1>Checkout</h1>
            <ul className="list-group">
              {cartItems.map((item) => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={item.productId}>
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="img-thumbnail me-3" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                    />
                    <div>
                      <h5 className="mb-1">{item.title}</h5>
                      <p className="mb-1">Pris: {item.price} kr</p>
                      <p className="mb-1">Antal: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="mt-4">Totalt: {totalAmount} kr</h3>
            <button className="btn btn-success mt-3" onClick={handleFakePayment}>
              Betala
            </button>
            {paymentSuccess && <div className="alert alert-success mt-3">Betalningen har genomförts!</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
