import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfigs/firebaseConfig';
import { useUser } from './UseUser';
import { addToCart } from './cartFunctions';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggeduser = useUser();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Produkten kunde inte hittas');
        }
      } catch (error) {
        setError(`Ett fel uppstod vid hämtning av produkten: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Laddar...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Ingen produkt hittad</div>;

  return (
    <div className='m-4'>
      <div className="container mt-5">
        <div className="row">
          <h1>{product.title}</h1>
          <p className="lead text-dark">{product.price} kr</p>
          <div className="col-md-6 mb-3">
            <img src={product.productImage} alt={product.title} className="img-fluid rounded-5 border" />
          </div>
          <div className="col-md-6">
            <p>{product.description}</p>
            <button className="btn primary" onClick={() => addToCart(loggeduser, product)}>
              Lägg till i kundvagn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product; 
