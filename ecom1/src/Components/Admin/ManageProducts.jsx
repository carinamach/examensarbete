import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FirebaseConfigs/firebaseConfig';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState(null);
  const [imageError, setImageError] = useState('');

  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const maxImageSize = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const validateImage = (file) => {
    if (!file) return '';
    if (!allowedImageTypes.includes(file.type.toLowerCase())) {
      return 'Bild måste vara i formatet png, jpeg, jpg eller webp';
    }
    if (file.size > maxImageSize) {
      return 'Bilden måste vara mindre än 5MB';
    }
    return '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const error = validateImage(file);
    setImageError(error);
    if (!error) {
      setNewImage(file);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Är du säker på att du vill ta bort denna produkt?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setNewImage(null);
    setImageError(''); 
  };

  const handleUpdate = async () => {
    try {
      const productRef = doc(db, 'products', editingProduct.id);
      let updateData = {
        title: editingProduct.title,
        description: editingProduct.description,
        price: Number(editingProduct.price)
      };

      // Om en ny bild har valts, ladda upp den först
      if (newImage) {
        const storageRef = ref(storage, `products-images/${Date.now()}-${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        const imageUrl = await getDownloadURL(storageRef);
        updateData.productImage = imageUrl;
      }

      await updateDoc(productRef, updateData);
      
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...updateData }
          : product
      ));

      setEditingProduct(null);
      setNewImage(null);
      setImageError('');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) {
    return <div>Laddar produkter...</div>;
  }

  return (
    <div>
      <h2>Hantera Produkter</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Bild</th>
              <th>Titel</th>
              <th>Pris</th>
              <th>Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img 
                    src={product.productImage} 
                    alt={product.title} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.price} kr</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(product)}
                  >
                    Redigera
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Redigera Produkt</h5>
                <button type="button" className="btn-close" onClick={() => setEditingProduct(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Titel</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Beskrivning</label>
                  <textarea
                    className="form-control"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Pris</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nuvarande bild</label>
                  <div>
                    <img 
                      src={editingProduct.productImage} 
                      alt={editingProduct.title}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      className="mb-2"
                    />
                  </div>
                  <label className="form-label">Byt bild (valfritt)</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept={allowedImageTypes.join(',')}
                  />
                  {imageError && <div className="text-danger mt-1">{imageError}</div>}
                  {newImage && <div className="text-success mt-1">Ny bild vald</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>Avbryt</button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleUpdate}
                  disabled={imageError !== ''}
                >
                  Spara ändringar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts; 