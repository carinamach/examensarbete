import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfigs/firebaseConfig';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(3));
        const querySnapshot = await getDocs(q);
        
        const productsList = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });
        
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Laddar...</div>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Utvalda Produkter</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              <Link to={`/product/${product.id}`} className="text-decoration-none">
                <img 
                  src={product.productImage} 
                  alt={product.title} 
                  className="card-img-top"
                  style={{height: "200px", objectFit: "cover"}}
                />
                <div className="card-body">
                  <h5 className="card-title text-dark">{product.title}</h5>
                  <p className="card-text text-secondary">{product.price} kr</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts