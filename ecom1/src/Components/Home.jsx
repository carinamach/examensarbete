import Navbar from './Navbar'
import FeaturedProducts from './FeaturedProducts'
import { useUser } from './UserAuthContext';
    
const Home = () => {
    const loggeduser = useUser();

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="jumbotron text-center">
                    <h1>Välkommen till vår butik</h1>
                    <p className="lead">Upptäck våra senaste produkter</p>
                </div>
                <FeaturedProducts />
            </div>
        </div>
    )
}

export default Home