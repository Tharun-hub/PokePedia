import './index.css'
import { NavLink, useLocation } from 'react-router'
import HeaderIconImage  from '../../assets/icons/pokemon-23.svg'
function Header()
{
    const { pathname } = useLocation();
    const page = pathname.startsWith('/pokedex') ? 'Pokédex' : pathname === '/' ? 'Discover Pokémon' : 'Page not found';

    return (
        <header className="site-header">
            <div className="header-container">
                <NavLink to="/" className="header-logo-container" aria-label="Poképedia home">
                    <img className='header-icon' src={HeaderIconImage} alt="Poképedia"/>
                    <span>Poképedia</span>
                </NavLink>
                <nav className="header-navlinks-container" aria-label="Main navigation">
                    <NavLink to="/" end className="header-link">Home</NavLink>
                    <NavLink to="/pokedex" className="header-link">Pokédex</NavLink>
                </nav>
            </div>
            {pathname !== '/' && <p className='page-title'>{page}</p>}
        </header>
    )
}
export default Header
