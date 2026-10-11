import './index.css'
import { Link } from 'react-router'
import pageContext from '../../context/pageContext'
import { use } from 'react'
function Header()
{
    const pageContextValue = use(pageContext);
    const {page} = pageContextValue;
    return (
        <>
            <div className="header-container">
                <div className="header-logo-container">
                    <img className='header-icon' src="src/assets/icons/pokemon-23.svg"/>
                </div>
                <nav className="header-navlins-container">
                    <Link to={"/"} className="header-link">Home<hr className='navlinks-hr'></hr></Link>
                    <Link to={"/pokedex"} className="header-link">Pokédex<hr className='navlinks-hr'></hr></Link>
                    <Link to={"/about"} className="header-link">About<hr className='navlinks-hr'></hr></Link>
                </nav>
            </div>
            <h1 className='pageTitle'>{page}</h1>
        </>
    )
}
export default Header