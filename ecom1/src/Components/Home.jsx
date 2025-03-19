import Navbar from "./Navbar";
import FeaturedProducts from "./FeaturedProducts";
import { useUser } from "./UseUser";
import { Link } from 'react-router-dom';

const Home = () => {
    const loggeduser = useUser();

    return (
        <>
            <Navbar />
            <header>
            <video autoPlay loop muted className="hero-video" aria-label="Bakgrundsvideo">
    <source src="https://drive.google.com/uc?export=download&id=1VhVzraBD3KYB6zXyG_dNJIRxsunXqMtW" type="video/mp4" />
</video>

                <div className="heroOverlay"></div>
                <div className="hero d-flex justify-content-center align-items-center">
                    <div className="text-center px-4 w-100">
                        <h1 className="display-4 fw-bold">Unika handritade figurer – Direkt från hjärtat till din vägg!</h1>
                        <div className="col-lg-6 mx-auto">
                            <p className="lead mb-4">Upptäck charmiga och personliga illustrationer som sprider glädje.</p>
                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
                                <Link to="/products" className="btn primary btn-lg px-4 me-sm-3">Utforska Butiken</Link>
                                <Link to="/signup" className="btn secondary btn-lg px-4">Skapa Konto & Börja Handla</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="container px-5">
                <section aria-labelledby="featured-products">
                    <h2 id="featured-products" className="visually-hidden">Utvalda Produkter</h2>
                    <FeaturedProducts />
                </section>
            </main>
            
            <section className="about" id="about">
                <div className="container">
                    <h2>Om Happy Scribbles</h2>
                    <p>Alla våra illustrationer är handgjorda med kärlek. Vi skapar lekfulla och unika illustrationer för att sprida glädje!</p>

                    <p><strong>📖 Vill du veta mer om oss?</strong></p>
                    <Link to="/about-us" className="btn primary">Om oss</Link>
                </div>
            </section>
        </>
    );
};

export default Home;