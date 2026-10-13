import { useEffect, useState } from 'react';
import './index.css'
import { Link } from 'react-router';

function PokemonCatalogueItem(props)
{
    const {name} = props
    const [pokemonDetails, setPokemonDetails] = useState({})
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
    useEffect(()=>{
        getData().then(data=>setPokemonDetails(data))
    },[url])
    return(
        <Link to={`/pokedex/${pokemonDetails.id}` }className="link-item">
            <li className='card-container'>
                <img className='image' src={pokemonDetails.frontDefaultImg}/>
                <p className='name'>{name[0].toUpperCase() + name.slice(1)}</p>
                <p className='card-id'># {pokemonDetails.id}</p>
            </li>
        </Link>
    )
}

export default PokemonCatalogueItem