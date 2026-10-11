import { useEffect, useState} from 'react'
import './index.css'
import PokemonCatalogueItem from '../PokemonCatalogueItem';
function Pokedex()
{
    const [searchInput, setSearchInput] = useState("");
    const [pokemonDataList, setPokemonDataList] = useState([]);
    let apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchInput}`
    function getSearchInput(event)
    {
        setSearchInput(event.target.value)
    }
    
    function onFormSubmit(event)
    {
        event.preventDefault();
        if(searchInput === "")
        {
            console.log("No input");
        }
        else
        {
            getData();
        }
        console.log(searchInput)
    }

    async function getData()
    {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        if(!response.ok)
        {
            onSubmitFailure(responseData)
        }
        else
        {
            onSubmitSuccess(responseData)
        }
    }
    function onSubmitSuccess(data)
    {
        console.log(data,"success");
    }
    function onSubmitFailure(error)
    {
        console.log(error.message)
    }
    async function GetCatalogueData()
    {
        const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=24&offset=0"
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        const pokemonList= responseData.results;
        setPokemonDataList(pokemonList);
    }

    useEffect(()=>{
        GetCatalogueData();
    })
    return (
        <div>
            <form onSubmit={onFormSubmit} className='input-form'>
                <input onChange={getSearchInput} className='searchInput' type='text' placeholder='Enter Pokémon Name or ID'></input>
                <div className='search-button-container'>
                    <button className='search-button'>Seach</button>
                </div>
            </form>
            <div className='pokedex-container'>
                <div className='filter'>
                    <select className='filter-type'>
                        <option>Type </option>
                        <option>Fire</option>
                        <img src="src/assets/icons/down-arrow.png"/>
                    </select>
                </div>
                <div className='catalogue-container'>
                    {
                        pokemonDataList.map((index)=><PokemonCatalogueItem name={index.name} url ={index.url}/>)
                    }
                </div>
            </div>
        </div>
    )
}
export default Pokedex