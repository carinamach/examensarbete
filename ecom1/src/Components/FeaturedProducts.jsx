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

  if (loading) return <div role="status" aria-live="polite">Laddar...</div>

  return (
    <section  className="featured-products container py-3 mb-4">
      <h2 className="text-center mb-4">Utvalda Produkter</h2>
      <div className="row g-4">
        {products.map((product) => (
          <article className="col-12 col-sm-6 col-md-4" key={product.id}>
            <div className="product-card h-100 rounded-4">
              <Link 
                to={`/product/${product.id}`} 
                className="text-decoration-none position-relative d-block"
                aria-label={`Visa ${product.title}`}
              >
                <div className="image-container position-relative">
                  <img
                    src={product.productImage}
                    alt={product.title}
                    className="img-fluid rounded-4 w-100"
                    style={{ 
                      height: "300px", 
                      objectFit: "cover",
                      aspectRatio: "4/3"
                    }}
                    loading="lazy"
                  />
                  <div className="overlay d-flex align-items-center justify-content-center">
                    <span className="btn btn-light">Läs mer</span>
                  </div>
                </div>
                <div className="product-info text-center mt-3 p-3">
                  <h3 className="h5 product-title text-dark mb-2">{product.title}</h3>
                  <p className="product-price text-secondary mb-0">
                    <span className="visually-hidden">Pris:</span>
                    {product.price} kr
                  </p>
                </div>
              </Link>
            </div>
          </article>
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

export default FeaturedProducts