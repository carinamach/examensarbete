import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfigs/firebaseConfig';
import { useUser } from './UseUser';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const loggeduser = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
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

  const handleQuantityChange = async (productId, change) => {
    const updatedCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );

    try {
      const userRef = doc(db, 'users', loggeduser[0].id);
      await updateDoc(userRef, { cart: updatedCart });
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Kunde inte uppdatera antalet');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const userRef = doc(db, 'users', loggeduser[0].id);
      const updatedCart = cartItems.filter(item => item.productId !== productId);
      await updateDoc(userRef, { cart: updatedCart });
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
      alert('Produkten har tagits bort från kundvagnen!');
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Kunde inte ta bort produkten från kundvagnen');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1>Kundvagn</h1>

        {error ? (
          <div>
            <div className="alert alert-danger">{error}</div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Logga in
            </button>
          </div>
        ) :
          cartItems.length === 0 ? (
            <div>
              <p>Kundvagnen är tom. Lägg till produkter för att se dem här.</p>
            </div>
          ) : (
            <>
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
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={() => handleQuantityChange(item.productId, -1)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm ms-2"
                            onClick={() => handleQuantityChange(item.productId, 1)}
                          >
                            +
                          </button>
                        </div>
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
              <h3 className="mt-4">Totalt: {totalAmount} kr</h3>
              <button className="btn btn-success mt-3" onClick={() => navigate('/checkout')}>
                Gå till Checkout
              </button>
            </>
          )}
      </div>
    </div>
  );
};

export default Cart;
