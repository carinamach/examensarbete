// Importera nödvändiga hooks och Firebase-funktioner
import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfigs/firebaseConfig';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { addToCart } from './cartFunctions.jsx';
import { useUser } from './UseUser';


const Products = () => {
  // State för att hantera produkter, laddning och fel
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggeduser = useUser();

  useEffect(() => {
    // Funktion för att hämta produkter från Firestore
    const fetchProducts = async () => {
      try {
        // Skapa query för products-collection
        const snapshot = query(collection(db, 'products'));
        // Hämta alla dokument
        const docs = await getDocs(snapshot);
        const productsList = [];
        // Loopa igenom dokumenten och lägg till i array
        docs.forEach((doc) => {
          productsList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        // Uppdatera state med produkterna
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        // Hantera eventuella fel
        setError(error);
        setLoading(false);
      }
    };
    // Anropa fetchProducts när komponenten mountas
    fetchProducts();
  }, []);



  return (
    <div>
      <Navbar />
      <div className='container my-5'>
        <h1>Products</h1>
        {loading && <div>Laddar...</div>}
        {error && <div>Error: {error.message}</div>}
        <div className='row'>
          {/* Loopa igenom och visa alla produkter */}
          {products.map((product) => (
            <div className='col-md-4 mb-4' key={product.id}>
              <div className='card h-100 rounded-5'>
                <Link to={`/product/${product.id}`} className="text-decoration-none">
                  <img
                    src={product.productImage}
                    alt={product.title}
                    className="card-img-top rounded-top-5 shadow-sm"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                </Link>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark">{product.title}</h5>
                  
                  <p className="card-text mt-auto">
                    <strong>{product.price} kr</strong>
                  </p>
                  <div className='buttons mt-2'>
                    <button className="btn primary" onClick={() => addToCart(loggeduser, product)}>
                      Lägg till i kundvagn
                    </button>
                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <button className="btn secondary">
                      Läs mer
                    </button>
                    </Link>
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products