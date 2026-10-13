import { useEffect, useState} from 'react'
import './index.css'
import PokemonCatalogueItem from '../PokemonCatalogueItem';




function Pokedex()
{
    const [searchInput, setSearchInput] = useState("");
    const [showSearchData, setShowSearchData] = useState(false);
    const [pokemonDataList, setPokemonDataList] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    
    function getSearchInput(event)
    {
        if(event.target.value==="") setShowSearchData(false)
        setSearchInput(event.target.value)
    }
    
    function onFormSubmit(event)
    {
        event.preventDefault();

        if(searchInput === "")
        {
            console.log("No input");
            setShowSearchData(false);
        }
        else
        {
            setShowSearchData(true);
        }
        console.log(searchInput)
    }

    /* async function getData()
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
    } */
    /* function onSubmitSuccess(data)
    {
        setShowSearchData(true);
        RenderSearchPokemonItem(data);
    }
    function onSubmitFailure(error)
    {
        setShowSearchData(false);
        console.log(error.message)
    } */
    
    function RenderCatalogue()
    {
        return (
            pokemonDataList.map((index)=><PokemonCatalogueItem name={index.name} />)
        )
    }
    
    function NextPage()
    {
        setCurrentPage(page => page+1)
    }
    function PreviousPage()
    {
        if(currentPage>1)
        {
            setCurrentPage(page=> page-1);
        }
    }
    
    useEffect(()=>{
        async function GetCatalogueData()
        {
            const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=24&offset=${getPageOffset()}`
            const response = await fetch(apiUrl);
            const responseData = await response.json();
            const pokemonList= responseData.results;
            return pokemonList;
        }
        function getPageOffset()
        {
            return (currentPage-1) * 24;
        }
        GetCatalogueData().then(data => setPokemonDataList(data));
    },[currentPage])
    
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
                <ul className='catalogue-container'>
                    {showSearchData? <PokemonCatalogueItem name={searchInput}/>: RenderCatalogue()}
                </ul>
            </div>
            <div>
                <button onClick={PreviousPage}>-</button>
                <button onClick={NextPage}>+</button>
            </div>
        </div>
    )
}
export default Pokedex