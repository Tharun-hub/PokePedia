import { useEffect, useState } from "react";
import "./index.css";
import { useParams } from "react-router";

function CatalogueItemDetail() {
  const { id } = useParams();

  const [pokemonData, setPokemonData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [weaknessData, setWeaknessData] = useState([]);
  const [evolutionData, setEvolutionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const pokemonDataUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const speciesDataUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  async function getData(url) {
    const response = await fetch(url);

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error("No such pokemon");
    }
  }

  async function getWeaknessData(types) {
    const typeResponses = await Promise.all(
      types.map((type) => getData(type.type.url)),
    );

    const weaknessMap = {};

    typeResponses.forEach((typeData) => {
      typeData.damage_relations.double_damage_from.forEach((type) => {
        weaknessMap[type.name] = (weaknessMap[type.name] || 1) * 2;
      });

      typeData.damage_relations.half_damage_from.forEach((type) => {
        weaknessMap[type.name] = (weaknessMap[type.name] || 1) * 0.5;
      });

      typeData.damage_relations.no_damage_from.forEach((type) => {
        weaknessMap[type.name] = 0;
      });
    });

    return Object.entries(weaknessMap)
      .filter(([name, multiplier]) => multiplier > 1)
      .map(([name, multiplier]) => ({
        name,
        multiplier,
      }));
  }

  function getEvolutionSpecies(chain) {
    const evolutionList = [];

    function traverseEvolutionChain(evolution) {
      evolutionList.push(evolution.species.name);

      evolution.evolves_to.forEach((nextEvolution) => {
        traverseEvolutionChain(nextEvolution);
      });
    }

    traverseEvolutionChain(chain);

    return evolutionList;
  }

  async function getEvolutionData(url) {
    const evolutionChain = await getData(url);

    const evolutionNames = getEvolutionSpecies(evolutionChain.chain);

    const evolutionPokemon = await Promise.all(
      evolutionNames.map((name) =>
        getData(`https://pokeapi.co/api/v2/pokemon/${name}`),
      ),
    );

    return evolutionPokemon;
  }

  useEffect(() => {
    setLoading(true);

    async function fetchAllData() {
      try {
        const [pokemon, species] = await Promise.all([
          getData(pokemonDataUrl),
          getData(speciesDataUrl),
        ]);

        setPokemonData(pokemon);
        setSpeciesData(species);

        const weaknesses = await getWeaknessData(pokemon.types);
        setWeaknessData(weaknesses);

        const evolutions = await getEvolutionData(species.evolution_chain.url);

        setEvolutionData(evolutions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pokemonData || !speciesData) {
    return <p>Could not find this Pokémon.</p>;
  }

  function getEnglishGenus() {
    const genus = speciesData.genera.find(
      (item) => item.language.name === "en",
    );

    return genus ? genus.genus : "Unknown";
  }

  function getEnglishDescription() {
    const description = speciesData.flavor_text_entries.find(
      (item) => item.language.name === "en",
    );

    if (!description) {
      return "No description available.";
    }

    return description.flavor_text.replace(/\n|\f/g, " ");
  }

  function getGender() {
    if (speciesData.gender_rate === -1) {
      return "Genderless";
    }

    const femalePercentage = (speciesData.gender_rate / 8) * 100;

    const malePercentage = 100 - femalePercentage;

    return (
      <>
        <span className="gender-female">♀ {femalePercentage}%</span>

        <span className="gender-male">♂ {malePercentage}%</span>
      </>
    );
  }

  function getStatDots(stat) {
    const totalDots = 15;

    const filledDots = Math.round((stat / 255) * totalDots);

    return Array.from({ length: totalDots }, (_, index) => (
      <span
        key={index}
        className={index < filledDots ? "stat-dot filled" : "stat-dot"}
      ></span>
    ));
  }

  function renderWeaknesses() {
    return weaknessData.map((weakness) => (
      <div
        key={weakness.name}
        className={`weakness-badge type-badge type-${weakness.name}`}
      >
        <span>{weakness.name[0].toUpperCase() + weakness.name.slice(1)}</span>

        <small>{weakness.multiplier}×</small>
      </div>
    ));
  }

  function renderStats() {
    return pokemonData.stats.map((stat) => {
      const statName = stat.stat.name.replace("-", " ");

      return (
        <div className="stat-row" key={stat.stat.name}>
          <p className="stat-name">{statName}</p>

          <div className="stat-dots">{getStatDots(stat.base_stat)}</div>

          <p className="stat-value">{stat.base_stat}</p>
        </div>
      );
    });
  }

  function renderEvolutionaryLine() {
    return evolutionData.map((pokemon, index) => (
      <div className="evolution-item" key={pokemon.id}>
        <div className="evolution-pokemon">
          <img src={pokemon.sprites.other["official-artwork"].front_default} />

          <p>{pokemon.name}</p>

          <span>#{String(pokemon.id).padStart(4, "0")}</span>

          <div className="evolution-types">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`type-dot type-${type.type.name}`}
              ></span>
            ))}
          </div>
        </div>

        {index < evolutionData.length - 1 && (
          <span className="evolution-arrow">→</span>
        )}
      </div>
    ));
  }

  function RenderDetail() {
    return (
      <div className="item-container">
        <div className="pokemon-data">
          <img
            className="pokemon-data-image"
            src={pokemonData.sprites.other["official-artwork"].front_default}
          />

          <div className="pokemon-data-details-container">
            <p className="data-details">
              Category:
              <span className="data-details-span lighter">
                {getEnglishGenus()}
              </span>
            </p>

            <p className="data-details">
              Generation:
              <span className="data-details-span lighter">
                {speciesData.generation.name
                  .replace("generation-", "Generation ")
                  .toUpperCase()}
              </span>
            </p>

            <p className="data-details">
              Height:
              <span className="data-details-span lighter">
                {(pokemonData.height / 10).toFixed(1)} m
              </span>
            </p>

            <p className="data-details">
              Weight:
              <span className="data-details-span lighter">
                {(pokemonData.weight / 10).toFixed(1)} kg
              </span>
            </p>

            <p className="data-details">
              Gender:
              <span className="data-details-span lighter gender-container">
                {getGender()}
              </span>
            </p>
          </div>

          <div className="abilities-container">
            <p>
              Abilities:
              <span className="lighter">
                {pokemonData.abilities
                  .filter((item) => !item.is_hidden)
                  .map((item) => item.ability.name)
                  .join(", ")}
              </span>
            </p>

            <p>
              Hidden:
              <span className="lighter">
                {pokemonData.abilities
                  .filter((item) => item.is_hidden)
                  .map((item) => item.ability.name)
                  .join(", ")}
              </span>
            </p>
          </div>
          <div className="type-container">
            <p>Type:</p>
            <div className="card-pokemon-type-container">
              {pokemonData.types.map((t) => (
                <p
                  key={t.type.name}
                  className={`type-badge type-${t.type.name}`}
                >
                  {t.type.name[0].toUpperCase() + t.type.name.slice(1)}
                </p>
              ))}
            </div>
          </div>
          <div className="weaknesses-container">
            <p>Weaknesses:</p>
            <div className="weakness-list">{renderWeaknesses()}</div>
          </div>
          <div className="stats-container">
            <h3>{pokemonData.name}'s Stats</h3>
            {renderStats()}
          </div>
        </div>
        <div className="pokemon-description">
          <div className="pokemon-heading">
            <div>
              <h1 className="name">{pokemonData.name}</h1>
              <h2 className="pid">
                #{String(pokemonData.id).padStart(4, "0")}
              </h2>
            </div>
          </div>
          <p className="description-text">{getEnglishDescription()}</p>
          <hr />
          <h4 className="evolution-heading">Evolutionary Line</h4>
          <div className="evolution-container">{renderEvolutionaryLine()}</div>
          <hr />

          {/* <h4 className='evolution-heading'>
                        TV Episodes
                    </h4>

                    <div className='episode-placeholder'>
                        <p>
                            TV episode information can be added here later.
                        </p>
                    </div> */}
        </div>
      </div>
    );
  }

  return RenderDetail();
}

export default CatalogueItemDetail;
