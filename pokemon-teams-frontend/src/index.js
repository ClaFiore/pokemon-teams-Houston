const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons/`
const main = document.querySelector('main')

fetch(TRAINERS_URL)
.then(resp => resp.json())
.then(trainersArray => trainersArray.forEach(trainer => displayTrainer(trainer)))

function displayTrainer(trainer){
    
    const divCard = document.createElement('div')
    divCard.className = 'card'
    divCard.setAttribute('data-id', trainer.id)
    const p = document.createElement('p')
    p.innerText = trainer.name
    divCard.append(p)
    main.append(divCard)

    const btnAddPokemon = document.createElement('button')
    btnAddPokemon.innerText = 'Add Pokemon'
    btnAddPokemon.setAttribute('data-trainer-id', trainer.id)

    const ul = document.createElement('ul')
    trainer.pokemons.forEach(pokemon => {
        const li = document.createElement('li')
        li.innerText = `${pokemon.nickname} (${pokemon.species})`
        ul.append(li)
        const releaseBtn = document.createElement('button')
        releaseBtn.innerText = 'Release'
        releaseBtn.className = "release"
        releaseBtn.setAttribute('data-pokemon-id', pokemon.id)
        li.append(releaseBtn)
        releaseBtn.addEventListener('click', () => releasePokemon(pokemon, li))
    })

    divCard.append(btnAddPokemon, ul)
    btnAddPokemon.addEventListener('click', () => addPokemonFunc(trainer, ul))
}

function addPokemonFunc(trainer, ul){
    
    if (ul.childElementCount < 6){
        const configObj = { method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({"trainer_id": trainer.id})
        }
        fetch(POKEMONS_URL, configObj)
        .then(resp => resp.json())
        .then(newPokemon => {
            const newPokemonLi = document.createElement('li')
            newPokemonLi.innerText = `${newPokemon.nickname} (${newPokemon.species})`
            const releaseNewPokemonBtn = document.createElement('button')
            releaseNewPokemonBtn.innerText = 'Release'
            releaseNewPokemonBtn.className = "release"
            releaseNewPokemonBtn.setAttribute('data-pokemon-id', newPokemon.id)
            releaseNewPokemonBtn.addEventListener('click', () => releasePokemon(newPokemon, newPokemonLi))
            newPokemonLi.append(releaseNewPokemonBtn)
            ul.append(newPokemonLi)
        })
    }
    else{
        alert('Max number of Pokemon per trainer is 6')
    }
}

function releasePokemon(pokemon, li) {
    fetch(POKEMONS_URL+pokemon.id, {
        method: 'DELETE'
    })
    .then( () => {
        li.remove()
    })
}