import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '../UseUser';
import Navbar from '../Navbar';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import AdminOrders from './AdminOrders';

const AdminPage = () => {
  const loggeduser = useUser();
  const isAdmin = loggeduser && loggeduser[0].email === "admin@admin.se";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <div className="container mt-4 adminStart">
        <h1>Admin Dashboard</h1>
        
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="list-group">
              <Link to="/admin/add-product" className="list-group-item list-group-item-action">
                Lägg till produkt
              </Link>
              <Link to="/admin/manage-products" className="list-group-item list-group-item-action">
                Hantera produkter
              </Link>
              <Link to="/admin/orders" className="list-group-item list-group-item-action">
                Ordrar
              </Link>
            </div>
          </div>
          
          <div className="col-md-9">
            <Routes>
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/manage-products" element={<ManageProducts />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route index element={<AdminWelcome />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminWelcome = () => (
  <div className="text-center">
    <h2>Välkommen till Admin Dashboard</h2>
    <p>Välj en sektion från menyn till vänster för att börja.</p>
  </div>
);

export default AdminPage; 