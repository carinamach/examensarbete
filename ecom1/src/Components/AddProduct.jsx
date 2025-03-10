// Importera nödvändiga komponenter och funktioner
import Navbar from './Navbar'
import { useUser } from './UseUser';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../FirebaseConfigs/firebaseConfig';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';

const AddProduct = () => {
  // Hämta inloggad användare
  const loggeduser = useUser();
  
  // State för formulärdata
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    productImage: null
  });

  // State för felmeddelanden
  const [errors, setErrors] = useState({
    image: '',
    upload: '',
  });

  // State för framgångsmeddelande och inlämningsstatus
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Konstanter för bildvalidering
  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const maxImageSize = 5 * 1024 * 1024; // 5MB

  // Ny state för antal produkter
  const [productCount, setProductCount] = useState(1);

  // Hantera ändringar i textfält
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validera uppladdad bild
  const validateImage = (file) => {
    if (!file) {
      return 'Ingen bild vald';
    }
    if (!allowedImageTypes.includes(file.type.toLowerCase())) {
      return 'Bild måste vara i formatet png, jpeg, jpg eller webp';
    }
    if (file.size > maxImageSize) {
      return 'Bilden måste vara mindre än 5MB';
    }
    return '';
  };

  // Hantera bilduppladdning
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const imageError = validateImage(file);
    
    setErrors(prev => ({
      ...prev,
      image: imageError
    }));

    if (!imageError) {
      setFormData(prev => ({
        ...prev,
        productImage: file
      }));
    }
  };

  // Hantera produkttillägg
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Validera att alla fält är ifyllda
    if (!formData.title || !formData.description || !formData.price || !formData.productImage) {
      setErrors(prev => ({
        ...prev,
        upload: 'Alla fält måste fyllas i'
      }));
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors(prev => ({ ...prev, upload: '' }));
      
      // Ladda upp bild till Firebase Storage
      const storageRef = ref(storage, `products-images/${Date.now()}-${formData.productImage.name}`);
      await uploadBytes(storageRef, formData.productImage);
      const imageUrl = await getDownloadURL(storageRef);
      
      // Lägg till produkt i Firestore
      await addDoc(collection(db, 'products'), {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        productImage: imageUrl,
        createdAt: new Date().toISOString(),
        createdBy: loggeduser[0].email
      });

      // Återställ formulär efter lyckad uppladdning
      setSuccessMessage('Produkt tillagd!');
      setFormData({
        title: '',
        description: '',
        price: '',
        productImage: null
      });
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        upload: `Något gick fel: ${error.message}`
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const increaseCount = () => {
    setProductCount(prevCount => prevCount + 1);
  };

  const decreaseCount = () => {
    setProductCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1)); // Förhindra att gå under 1
  };

  return (
    <div>
      <Navbar />
      <div className='container'>
        {/* Visa olika innehåll beroende på om användaren är admin */}
        {loggeduser && loggeduser[0].email === "admin@admin.se" ? (
          <div className="mt-5">
            <h1 className="mb-4">Lägg till produkt</h1>
            <form onSubmit={handleAddProduct} className="d-flex flex-column gap-3">
              {/* Visa meddelanden */}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              {errors.upload && <div className="alert alert-danger">{errors.upload}</div>}
              {errors.image && <div className="alert alert-danger">{errors.image}</div>}
              
              {/* Formulärfält för titel */}
              <div className="form-group">
                <input type="text" name="title" className="form-control" placeholder="Titel" value={formData.title} onChange={handleInputChange} required />
              </div>

              {/* Formulärfält för beskrivning */}
              <div className="form-group">
                <textarea name="description" className="form-control" placeholder="Beskrivning" value={formData.description} onChange={handleInputChange} required rows="3" />
              </div>

              {/* Formulärfält för pris */}
              <div className="form-group">
                <input type="number" name="price" className="form-control" placeholder="Pris (kr)" value={formData.price} onChange={handleInputChange} required min="0" />
              </div>

              {/* Formulärfält för bilduppladdning */}
              <div className="form-group">
                <input type="file" className="form-control" onChange={handleImageUpload} accept={allowedImageTypes.join(',')} required />
              </div>

              {/* Formulärfält för antal produkter
              <div className="form-group">
                <label>Antal produkter</label>
                <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-secondary" onClick={decreaseCount}>-</button>
                    <input type="number" className="form-control mx-2" value={productCount} readOnly />
                    <button type="button" className="btn btn-secondary" onClick={increaseCount}>+</button>
                </div>
              </div> */}

              {/* Submit-knapp */}
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Lägger till...' : 'Lägg till produkt'}</button>
            </form>
          </div>
        ) : (
          <div className="mt-5 text-center">
            <h1>Bara administratörer kan lägga till produkter</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;