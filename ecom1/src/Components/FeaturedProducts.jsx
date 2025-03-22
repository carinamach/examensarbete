import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfigs/firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);

        const productsList = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });

        const randomProducts = [];
        while (randomProducts.length < 3 && productsList.length > 0) {
          const randomIndex = Math.floor(Math.random() * productsList.length);
          randomProducts.push(productsList[randomIndex]);
          productsList.splice(randomIndex, 1);
        }

        setProducts(randomProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div role="status" aria-live="polite">Laddar...</div>

  return (
    <section className="featured-products container py-3 mb-4">
      <h2 className="text-center mb-4">Utvalda Produkter</h2>
      <div className="row g-4">




        {products.map((product) => (
          <div className='col-md-4 mb-4' key={product.id}>
            <div className='card h-100 rounded-5 product-card'>
              <Link to={`/product/${product.id}`} className="text-decoration-none position-relative">
                <img
                  src={product.productImage}
                  alt={product.title}
                  className="card-img-top rounded-top-5 shadow-sm"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="overlay d-flex align-items-center justify-content-center">
                  <span className="btn btn-light">Read More</span>
                </div>
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-dark">{product.title}</h5>
                <p className="card-text mt-auto">
                  <strong>{product.price} kr</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="col-12 mt-4">
          <div className="d-flex justify-content-center">
            <Link
              to="/products"
              className="btn btn primary"
              aria-label="Visa alla produkter"
            >
              Fler Produkter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
