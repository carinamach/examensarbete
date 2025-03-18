import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import FofPage from './Components/FofPage';
import Cart from './Components/Cart';
import Profile from './Components/Profile';
import AddProduct from './Components/AddProduct';
import { UserAuthProvider } from './Components/UserAuthContext';
import Products from './Components/Products';
import Product from './Components/Product';
import FeaturedProducts from './Components/FeaturedProducts';
import Checkout from './Components/CheckOut';
import AboutUs from './Components/AboutUs';
function App() {
  return (
    <UserAuthProvider>  
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element = {<Home/>}/>
          <Route exact path="/home" element = {<Home/>}/>
          <Route exact path="/signup" element = {<Signup/>}/>
          <Route exact path="/login" element = {<Login/>}/>
          <Route exact path="/cart" element = {<Cart/>}/>
          <Route exact path="/profile" element = {<Profile/>}/>
          <Route exact path="/addProduct" element = {<AddProduct/>}/>
          <Route exact path="*" element = {<FofPage/>}/>
          <Route exact path="/products" element = {<Products/>}/>
          <Route exact path="/product/:id" element = {<Product/>}/>
          <Route exact path="/featuredProducts" element = {<FeaturedProducts/>}/>
          <Route exact path="/checkout" element={<Checkout />} />
          <Route exact path="/about-us" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </UserAuthProvider>
  );
}

export default App;
