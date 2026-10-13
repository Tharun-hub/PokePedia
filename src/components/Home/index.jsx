import './index.css'
import GreninjaImage  from '../../assets/images/greninja.png'

function Home()
{

    return (
    <div>
        <div className="main-container">
            <div className="main-text-container">
                <h1>Explore the Pokémon world.</h1>
                <p>Discover, compare, and learn about every Pokémon across every generation.</p>
            </div>
            <div className="main-image-container">
                <img className="main-image" src= {GreninjaImage}/>
            </div>
        </div>
        
    </div>
    )
}
export default Home