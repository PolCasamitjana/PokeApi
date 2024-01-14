const btnaddPoke = document.getElementById("addPoke");
btnaddPoke.addEventListener('click', afegirPoke);
let contador = document.getElementById("numPoke");
let selectedPokemon = []; // Almacena los nombres de los dos Pokémon seleccionados

function getRandomPokemonId() {
    return Math.floor(Math.random() * 150) + 1;
}

function afegirPoke() {
    while (contador.value > 0) {
        const randomPokemonId = getRandomPokemonId();

        fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
            .then(x => x.json())
            .then(poke => {
                const pokeList = document.getElementById("pokeList");
                const temp = document.getElementById("poke-template");
                const clonedTemplate = temp.content.cloneNode(true);

                let name = clonedTemplate.querySelector('#name');
                name.innerText = poke.name;

                let img = clonedTemplate.querySelector('img');
                img.setAttribute("src", poke.sprites.front_default);

                let types = clonedTemplate.querySelector('#types');
                let temporalTypes = [];
                poke.types.forEach(type => {
                    temporalTypes.push(type.type.name);
                });
                types.innerHTML = temporalTypes.join("|");

                let attack = clonedTemplate.querySelector('#attack');
                let defense = clonedTemplate.querySelector('#defense');

                poke.stats.forEach(stat => {
                    if (stat.stat.name === 'attack') {
                        attack.innerText = `Attack: ${stat.base_stat}`;
                    } else if (stat.stat.name === 'defense') {
                        defense.innerText = `Defense: ${stat.base_stat}`;
                    }
                });

                // Agrega el evento de clic para seleccionar y comparar Pokémon
                clonedTemplate.querySelector('article').addEventListener('click', function () {
                    if (selectedPokemon.length < 2 && !selectedPokemon.includes(poke.name)) {
                        // Permite seleccionar hasta dos Pokémon y evita duplicados
                        selectedPokemon.push(poke.name);

                        if (selectedPokemon.length === 1) {
                            // Actualiza el desplegable de Pokemon 1
                            updateSelectMenu("pokemon1Select", selectedPokemon[0]);
                        } else if (selectedPokemon.length === 2) {
                            // Actualiza el desplegable de Pokemon 2
                            updateSelectMenu("pokemon2Select", selectedPokemon[1]);
                        }
                    }
                });

                pokeList.appendChild(clonedTemplate);
            });

        contador.value--;
    }
}

function updateSelectMenu(selectId, pokemonName) {
    const select = document.getElementById(selectId);
    const option = document.createElement("option");
    option.value = pokemonName;
    option.text = pokemonName;
    select.innerHTML = "";
    select.add(option);
}

function compararYMostrarResultado() {
    const pokemon1Name = document.getElementById("pokemon1Select").value;
    const pokemon2Name = document.getElementById("pokemon2Select").value;

    const pokemon1 = selectedPokemon.find(pokemon => pokemon === pokemon1Name);
    const pokemon2 = selectedPokemon.find(pokemon => pokemon === pokemon2Name);

    if (pokemon1 && pokemon2) {
        const result = compararStats(pokemon1, pokemon2);
        mostrarResultado(result);
    }
}

// Resto del código sigue igual...


function compararStats(pokemon1, pokemon2) {
    // Obtén las estadísticas de ataque y defensa de los Pokémon
    const statPokemon1 = getPokemonStats(pokemon1);
    const statPokemon2 = getPokemonStats(pokemon2);

    // Compara las estadísticas y devuelve el resultado
    if (statPokemon1 > statPokemon2) {
        return `${pokemon1} gana la batalla!`;
    } else if (statPokemon1 < statPokemon2) {
        return `${pokemon2} gana la batalla!`;
    } else {
        return "¡Es un empate!";
    }
}

function getPokemonStats(pokemon) {
    // En este ejemplo, simplemente devuelve una suma ficticia de las estadísticas de ataque y defensa
    // Puedes personalizar esto según las estadísticas reales del Pokémon
    return pokemon.length * 10; 
}

function mostrarResultado(resultado) {
    const battleResult = document.getElementById("battleResult");
    battleResult.innerText = resultado;
}

document.getElementById("battleButton").addEventListener("click", compararYMostrarResultado);
