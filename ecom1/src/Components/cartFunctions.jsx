import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfigs/firebaseConfig';

export const addToCart = async (loggeduser,product) => {    

    if (!loggeduser) {
      alert('Du måste vara inloggad för att handla');
      return;
    }
  
    try {
      const userRef = doc(db, 'users', loggeduser[0].id);
      const userSnap = await getDoc(userRef);
  
      let currentCart = [];
      if (userSnap.exists()) {
        currentCart = userSnap.data().cart || []; // Hämta den senaste cart från Firestore
      }
  
      // Kolla om produkten redan finns i kundvagnen
      const existingItemIndex = currentCart.findIndex(item => item.productId === product.id);
      
      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart = [
          ...currentCart,
          {
            productId: product.id,
            quantity: 1,
            title: product.title,
            price: product.price,
            imageUrl: product.productImage
          }
        ];
      }
  
      await updateDoc(userRef, {
        cart: updatedCart
      });
  
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Kunde inte lägga till produkten i kundvagnen');
    }
  };