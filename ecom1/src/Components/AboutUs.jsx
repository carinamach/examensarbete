import Navbar from './Navbar'
import { useUser } from './UseUser';

const AboutUs = () => {
    const loggeduser = useUser();

    return (
        <>
            <div className='containerAbout rounded-5'>
                <header>
                    <h1>Om Happy Scribbles</h1> 
                </header>

                <main className>
                    <section>
                        <p>Välkommen till <span className="highlight">Happy Scribbles</span> – en plats där kreativitet möter glädje i form av handritade illustrationer! 🎨✍️</p>
                    </section>

                    <article>
                        <h2>Vem står bakom?</h2>
                        <p>Jag heter <span className="highlight">Carina</span>, och jag har alltid älskat att rita små figurer och doodles som sprider glädje. <strong>Happy Scribbles</strong> föddes ur min passion för att skapa  unika illustrationer med en personlig touch. Varje bild ritas digitalt för att behålla den charmiga, handgjorda känslan – ingen massproduktion, bara äkta kreativitet!</p>
                    </article>

                    <article>
                        <h2>✨ Varför Happy Scribbles?</h2>
                        <ul>
                            <li><span className="highlight">Handgjort & unikt</span> – varje illustration är skapad med omsorg</li>
                            <li><span className="highlight">Snabb leverans</span> – digital leverans direkt till din mejl</li>
                            <li><span className="highlight">Glädje i varje streck</span> – skapad för att sprida positivitet</li>
                        </ul>
                    </article>

                    <aside className='rounded-end-5'>
                        <p>📍 <strong>Har du frågor eller vill ha en specialbeställning?</strong></p>
                        <p>Tveka inte att <a href="mailto:dinmail@happyscribbles.com?subject=Denna%20butik%20finns%20ej&body=Hej!%0D%0A%0D%0ADenna%20butik%20finns%20ej.%20E-postadressen%20är%20också%20fejk.%0D%0A%0D%0AHa%20en%20bra%20dag!"> kontakta mig här</a>.</p>
                    </aside>
                </main>
            </div>
        </>

    )
}

export default AboutUs