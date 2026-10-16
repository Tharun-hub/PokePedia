import { useEffect, useState } from 'react';
import './index.css'
import { Link } from 'react-router';
import { CircleLoader } from 'react-spinners';
function PokemonCatalogueItem(props)
{
    const {name} = props
    const [pokemonDetails, setPokemonDetails] = useState({})
    const [loading,setLoading] = useState(true);
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`
    async function getData()
    {
        const response = await fetch(url);
        if(response.ok)
        {
            const responseData = await response.json();
        
            /* console.log(responseData, "wad") */
            const formattedData = {
                frontDefaultImg: responseData.sprites.other["official-artwork"].front_default,
                type: responseData.types,
                id: responseData.id
            }
            return formattedData;
        }
        else{
            console.log("This pokemon doesnt exist!")
        }
        
    }
    function renderItem()
    {
        return (
            <li className='card-container'>
                <img className='image' src={pokemonDetails.frontDefaultImg}/>
                <p className='name'>{name[0].toUpperCase() + name.slice(1)}</p>
                <p className='card-id'># {pokemonDetails.id}</p>
                <div className='card-pokemon-type-container'>
                    {pokemonDetails.type.map(t => {return <p className={`type-badge type-${t.type.name}`}>{t.type.name[0].toUpperCase()+t.type.name.slice(1)}</p>})}
                </div>
                
            </li>
        )
    }
    useEffect(()=>{
        
        getData().then(data=>setPokemonDetails(data)).catch(err=>console.log(err)).finally(()=>setLoading(false));
    },[url])
    return(
        <Link to={`/pokedex/${pokemonDetails.id}` }className="link-item">
            {loading && <CircleLoader color='black'></CircleLoader>}
            {!loading && renderItem()}
        </Link>
    )
}

export default PokemonCatalogueItem