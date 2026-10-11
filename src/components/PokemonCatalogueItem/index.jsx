import { useEffect, useState } from 'react';
import './index.css'

function PokemonCatalogueItem(props)
{
    const {name, url} = props
    const [pokemonDetails, setPokemonDetails] = useState({})

    async function getData()
    {
        const response = await fetch(url);
        const responseData = await response.json();
        console.log(responseData)
        const formattedData = {
            frontDefaultImg: responseData.sprites.other["official-artwork"].front_default,
            type: responseData.types,
            id: responseData.id
        }
        setPokemonDetails(formattedData);
    }
    useEffect(()=>{
        getData()
    },[])
    return(
        <div className='card-container'>
            <img className='image' src={pokemonDetails.frontDefaultImg}/>
            <p className='name'>{name[0].toUpperCase() + name.slice(1)}</p>
            <p># {pokemonDetails.id}</p>
        </div>
    )
}

export default PokemonCatalogueItem