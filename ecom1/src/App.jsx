import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './Components/Home';
import Footer from './Components/Footer'; // Importing the Footer component
import Login from './Components/Login';
import Signup from './Components/Signup';
import FofPage from './Components/FofPage';
import Cart from './Components/Cart';
import Profile from './Components/Profile';
import AddProduct from './Components/Admin/AddProduct';
import { UserAuthProvider } from './Components/UserAuthContext';
import Products from './Components/Products';
import Product from './Components/Product';
import FeaturedProducts from './Components/FeaturedProducts';
import Checkout from './Components/Checkout';
import AboutUs from './Components/AboutUs';
import AdminPage from './Components/Admin/AdminPage';
import Navbar from './Components/Navbar';

function App() {
  return (
    <UserAuthProvider>  
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route exact path="/" element = {<Home/>}/>
          <Route exact path="/home" element = {<Home/>}/>
          <Route exact path="/signup" element = {<Signup/>}/>
          <Route exact path="/login" element = {<Login/>}/>
          <Route exact path="/cart" element = {<Cart/>}/>
          <Route exact path="/profile" element = {<Profile/>}/>
          <Route exact path="/addProduct" element = {<AddProduct/>}/>
          <Route exact path="/products" element = {<Products/>}/>
          <Route exact path="/product/:id" element = {<Product/>}/>
          <Route exact path="/featuredProducts" element = {<FeaturedProducts/>}/>
          <Route exact path="/checkout" element={<Checkout />} />
          <Route exact path="/about-us" element={<AboutUs />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element = {<FofPage/>}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserAuthProvider>
  );
}

export default App;
