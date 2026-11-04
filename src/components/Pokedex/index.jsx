import { useEffect, useState } from 'react';
import './index.css';
import PokemonCatalogueItem from '../PokemonCatalogueItem';
import { BarLoader } from 'react-spinners';

const PAGE_SIZE = 24;
const TYPES = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

function Pokedex() {
    const [searchInput, setSearchInput] = useState('');
    const [submittedSearch, setSubmittedSearch] = useState('');
    const [pokemonDataList, setPokemonDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedType, setSelectedType] = useState('all');
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function getCatalogueData() {
            setLoading(true);
            setError('');
            try {
                if (selectedType === 'all') {
                    const offset = (currentPage - 1) * PAGE_SIZE;
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`, { signal: controller.signal });
                    if (!response.ok) throw new Error('Could not load the Pokédex.');
                    const data = await response.json();
                    setPokemonDataList(data.results);
                    setTotalResults(data.count);
                } else {
                    const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`, { signal: controller.signal });
                    if (!response.ok) throw new Error('Could not load this type.');
                    const data = await response.json();
                    const results = data.pokemon.map(({ pokemon }) => pokemon);
                    setTotalResults(results.length);
                    setPokemonDataList(results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
                }
            } catch (requestError) {
                if (requestError.name !== 'AbortError') {
                    setError(requestError.message);
                    setPokemonDataList([]);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        getCatalogueData();
        return () => controller.abort();
    }, [currentPage, selectedType]);

    function onFormSubmit(event) {
        event.preventDefault();
        setSubmittedSearch(searchInput.trim().toLowerCase());
    }

    function onTypeChange(event) {
        setSelectedType(event.target.value);
        setCurrentPage(1);
        setSubmittedSearch('');
    }

    const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
    const isSearchActive = Boolean(submittedSearch);

    return (
        <section className='pokedex-page'>
            <div className='pokedex-intro'>
                <p>Browse the collection</p>
                <span>Search by name or national Pokédex number, or filter by type.</span>
            </div>
            <form onSubmit={onFormSubmit} className='input-form'>
                <label className='visually-hidden' htmlFor='pokemon-search'>Search Pokémon</label>
                <input id='pokemon-search' value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className='search-input' type='search' placeholder='Search Pokémon by name or ID' />
                <button className='search-button' type='submit'>Search</button>
            </form>
            <div className='pokedex-container'>
                <aside className='filter'>
                    <label htmlFor='type-filter'>Filter by type</label>
                    <select id='type-filter' value={selectedType} onChange={onTypeChange} className='filter-type'>
                        <option value='all'>All types</option>
                        {TYPES.map((type) => <option value={type} key={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}
                    </select>
                    <p>{isSearchActive ? 'Showing your search result' : `${totalResults.toLocaleString()} Pokémon found`}</p>
                </aside>
                <div className='catalogue-area'>
                    {isSearchActive ? (
                        <ul className='catalogue-container'><PokemonCatalogueItem name={submittedSearch} /></ul>
                    ) : loading ? (
                        <div className='loading-state'><BarLoader color='#2563eb' width={160} /><span>Loading Pokémon…</span></div>
                    ) : error ? (
                        <div className='message-state'>{error} Please try again.</div>
                    ) : (
                        <ul className='catalogue-container'>
                            {pokemonDataList.map((pokemon) => <PokemonCatalogueItem key={pokemon.name} name={pokemon.name} />)}
                        </ul>
                    )}
                    {!isSearchActive && !loading && !error && (
                        <nav className='page-scroll-button-container' aria-label='Pokédex pages'>
                            <button className='page-scroll-button' onClick={() => setCurrentPage((page) => page - 1)} disabled={currentPage === 1}>← Previous</button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button className='page-scroll-button' onClick={() => setCurrentPage((page) => page + 1)} disabled={currentPage === totalPages}>Next →</button>
                        </nav>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Pokedex;
