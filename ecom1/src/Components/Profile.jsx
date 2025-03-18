import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfigs/firebaseConfig';
import { useUser } from './UseUser';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Profile = () => {
  const loggeduser = useUser();
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!loggeduser || !loggeduser[0]) {  
        setError('Du måste vara inloggad för att se din profil');
        setLoading(false);  // Se till att laddning stoppas
        return;
      }
      try {
        const userRef = doc(db, 'users', loggeduser[0].id);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setPurchaseHistory(userData.purchaseHistory ? userData.purchaseHistory : []);
        } else {
          setError('Användaren kunde inte hittas');
        }
      } finally {
        setLoading(false);
      }
    };
  
    // Om ingen användare är inloggad, stoppa laddningen direkt
    if (loggeduser === null) {
      setLoading(false);
    } else {
      fetchPurchaseHistory();
    }
  }, [loggeduser]);
  
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        {loading && <p>Laddar...</p>}
        {error && <p>Error: {error}</p>}

        {!loading && !error && (
          <>
            {loggeduser ? (
              <div>
                <h1 className="text-center p-4">Min profil</h1>
                <div className="d-flex justify-content-center">
                  <table className="table table-striped table-bordered w-50">
                    <thead>
                      <tr>
                        <th>Namn</th>
                        <th>Email</th>
                        <th>Lösenord</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{loggeduser[0].username}</td>
                        <td>{loggeduser[0].email}</td>
                        <td>{loggeduser[0].password}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <h1>Logga in för att se din profil</h1>
                <Link to="/login" className="btn btn-primary mt-3">Gå till inloggning</Link>
              </div>
            )}


            <h2 className="mt-5 text-center">📜 Köphistorik</h2>
            {!loading && !error && purchaseHistory.length === 0 && <p className='text-center'>Ingen köphistorik</p>}

            {purchaseHistory.length > 0 && (
              <>
                <div className="table-responsive">
                  <table className="order-history-table table table-striped table-bordered rounded-5">
                    <thead className="table-success ">
                      <tr>
                        <th>🗓️ Datum</th>
                        <th>🛒 Produkter</th>
                        <th>💰 Totalt</th>
                      </tr>
                    </thead>
                    <tbody>
                      { purchaseHistory.map((purchase, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(purchase.date).toLocaleDateString('sv-SE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td>
                            <ul className="list-unstyled mb-0">
                              {purchase.items.map((item) => (
                                <li key={item.productId} className="d-flex align-items-center mb-2">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="img-thumbnail me-2"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  />
                                  <div>
                                    <span className="fw-bold">{item.title}</span>
                                    <br />
                                    <span className="text-muted">{item.quantity} st • {item.price} kr</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="fw-bold text-success">{purchase.total} kr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;