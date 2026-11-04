import './index.css'
import GreninjaImage  from '../../assets/images/greninja.png'
import { Link } from 'react-router'

function Home()
{

    return (
        <section className="main-container">
            <div className="main-text-container">
                <p className="eyebrow">Your complete Pokémon companion</p>
                <h1>Explore the Pokémon world.</h1>
                <p>Discover stats, abilities, types, weaknesses, and evolutions for Pokémon from every generation.</p>
                <Link className="explore-link" to="/pokedex">Explore the Pokédex <span aria-hidden="true">→</span></Link>
            </div>
            <div className="main-image-container">
                <div className="hero-orb"></div>
                <img className="main-image" src={GreninjaImage} alt="Greninja"/>
            </div>
        </section>
    )
}
export default Home
