import Navbar from './Navbar'
import FeaturedProducts from './FeaturedProducts'
import { useUser } from './UseUser';
    
const AboutUs = () => {
    const loggeduser = useUser();

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="jumbotron text-center">
                    <h1>om oss</h1>
                </div>
            </div>
        </div>
    )
}

export default AboutUs