import Navbar from './Navbar'
import Products from './Products'
import { useUser } from './UserAuthContext';

const Home = () => {
    const loggeduser = useUser();

    return (
        <div>
            <Navbar />
            <Products />
            <p>{loggeduser ? loggeduser[0].username || loggeduser[0].email : "No Username"}</p>
        </div>
    )
}

export default Home