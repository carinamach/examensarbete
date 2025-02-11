import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import FofPage from './Components/FofPage';
import Cart from './Components/Cart';
import Profile from './Components/Profile';
import AddProduct from './Components/AddProduct';
function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
