import { useEffect, useState } from 'react';
import './index.css';
import { Link } from 'react-router';
import { CircleLoader } from 'react-spinners';

function PokemonCatalogueItem({ name }) {
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function getData() {
            setLoading(true);
            setNotFound(false);
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal: controller.signal });
                if (!response.ok) throw new Error('Not found');
                const data = await response.json();
                setPokemonDetails({
                    image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                    types: data.types,
                    id: data.id,
                    name: data.name,
                });
            } catch (error) {
                if (error.name !== 'AbortError') setNotFound(true);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        getData();
        return () => controller.abort();
    }, [name]);

    if (loading) {
        return <li className='pokemon-card card-loading'><CircleLoader size={28} color='#2563eb' /><span>Loading…</span></li>;
    }

    if (notFound || !pokemonDetails) {
        return <li className='pokemon-card card-not-found'><strong>No Pokémon found</strong><span>Check the spelling or try a national ID.</span></li>;
    }

    const displayName = pokemonDetails.name[0].toUpperCase() + pokemonDetails.name.slice(1);

    return (
        <li>
            <Link to={`/pokedex/${pokemonDetails.id}`} className='link-item' aria-label={`View ${displayName}`}>
                <article className='pokemon-card'>
                    <span className='card-id'>#{String(pokemonDetails.id).padStart(4, '0')}</span>
                    <img className='pokemon-image' src={pokemonDetails.image} alt={displayName} loading='lazy' />
                    <h2 className='card-name'>{displayName}</h2>
                    <div className='card-pokemon-type-container'>
                        {pokemonDetails.types.map((type) => <span key={type.type.name} className={`type-badge type-${type.type.name}`}>{type.type.name}</span>)}
                    </div>
                </article>
            </Link>
        </li>
    );
}

export default PokemonCatalogueItem;
