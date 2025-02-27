import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfigs/firebaseConfig';
import { useUser } from './UserAuthContext';
import Navbar from './Navbar';

const Cart = () => {
  const loggeduser = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const removeFromCart = async (productId) => {
    try {
      const userRef = doc(db, 'users', loggeduser[0].id);
      const updatedCart = cartItems.filter(item => item.productId !== productId);

      // Uppdatera användardokumentet i Firestore
      await updateDoc(userRef, {
        cart: updatedCart
      });

      // Uppdatera lokal state
      setCartItems(updatedCart);
      alert('Produkten har tagits bort från kundvagnen!');
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Kunde inte ta bort produkten från kundvagnen');
    }
  };

  if (loading) return <div>Laddar...</div>;
  if (error) return <div>Error: {error}</div>;

  // Visa meddelande om kundvagnen är tom
  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <h1>Kundvagn</h1>
          <p>Kundvagnen är tom. Lägg till produkter för att se dem här.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1>Kundvagn</h1>
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
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item.productId)}
              >
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Cart;