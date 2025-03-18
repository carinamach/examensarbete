import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfigs/firebaseConfig';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef);
        const querySnapshot = await getDocs(q);
        
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });

        setOrders(ordersData);
      } catch (error) {
        setError('Kunde inte hämta ordrar');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Ordrar</h2>
      
      {loading && <div>Laddar...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && !error && (
        <div className="accordion" id="ordersAccordion">
          {orders.map((order) => (
            <div className="accordion-item" key={order.id}>
              <h2 className="accordion-header">
                <button 
                  className="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#order-${order.id}`}
                >
                  <div className="d-flex accordion justify-content-between w-100 me-3">
                    <span>{order.id}</span>
                    <span className="me-3">{new Date(order.date).toLocaleDateString()}</span>
                    <span className="me-3">Status: {order.orderStatus}</span>
                    <span>Totalt: {order.total} kr</span>
                  </div>
                </button>
              </h2>
              <div 
                id={`order-${order.id}`} 
                className="accordion-collapse collapse"
                data-bs-parent="#ordersAccordion"
              >
                <div className="accordion-body">
                  <div className="mb-3">
                    <strong>Kund Information:</strong>
                    <p>Email: {order.userEmail}</p>
                    <p>Order ID: {order.id}</p>
                    <p>Datum: {new Date(order.date).toLocaleString()}</p>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Produkter:</strong>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Produkt</th>
                          <th>Antal</th>
                          <th>Pris</th>
                          <th>Totalt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.title}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price} kr</td>
                            <td>{item.price * item.quantity} kr</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-end">
                    <strong>Ordertotal: {order.total} kr</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 