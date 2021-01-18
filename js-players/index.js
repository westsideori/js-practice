// DOM Elements
const createPlayerToggleButton = document.getElementById("toggle-create-player-form-button")
const createPlayerBox = document.getElementById("create-player-box")
const createPlayerForm = document.getElementById("create-player-form")
const playersBox = document.getElementById("players-box")
const searchForm = document.getElementById("search-player-form")

// Fetches
function getAllPlayers() {
    return fetch("http://localhost:3000/players")
        .then(resp => resp.json())
}

function createPlayer(newPlayerObj) {
    return fetch("http://localhost:3000/players", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(newPlayerObj)
    })
        .then(resp => {
            if (resp.ok) {
                return resp.json()
            } else {
                throw new Error("Hmm. That didn't seem to work.")
            }
            
        })
}

function updatePlayer(id, editedPlayer) {
    return fetch(`http://localhost:3000/players/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/jason"
        },
        body: JSON.stringify(editedPlayer)
    })
        .then(resp => {
            if (resp.ok) {
                return resp.json()
            } else {
                throw new Error("Hmm. That didn't seem to work.")
            }
        })
}

function deletePlayer(id) {
    return fetch(`http://localhost:3000/players/${id}`, {
        method: 'DELETE'
    })
    .then(resp => {
        if (resp.ok) {
            return resp.json()
        } else {
            throw new Error("Hmm. That didn't seem to work.")
        }
    })
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    getAllPlayers()
        .then(playersData => {
            renderAllPlayers(playersData)
        })
        .catch(error => {
            alert(error)
        })
})

createPlayerToggleButton.addEventListener("click", handleCreatePlayerToggleClick)

createPlayerForm.addEventListener('submit', handleCreatePlayerSubmit)

playersBox.addEventListener('click', handlePlayersBoxClick)

searchForm.addEventListener('submit', handleSearch)

//Event Handlers
function handleCreatePlayerToggleClick() {
    if (createPlayerBox.style.display === "none") {
        createPlayerBox.style.display = "block"
    } else {
        createPlayerBox.style.display = "none"
    }
}

function handleCreatePlayerSubmit(event) {
    event.preventDefault()

    const newPlayer = {
        name: event.target.name.value,
        number: event.target.number.value,
        image: event.target.image.value
    }

    createPlayer(newPlayer)
        .then(newPlayerObject => {
            renderOnePlayer(newPlayerObject)
            createPlayerBox.style.display = "none"
        })
    
        event.target.reset()
}

function handlePlayersBoxClick(event) {
    if (event.target.matches(".delete-button")) {
       deleteSequence(event)
    } else if (event.target.matches(".edit-button")) {
        editSequence(event)
    }
}

function handleSearch(event) {
    event.preventDefault()
    const searchValue = document.getElementById("search-name").value
    getAllPlayers()
        .then(playersArray => {
            const resultsArray = playersArray.filter(player => player.name.toLowerCase().includes(searchValue))
            const playersCards = playersBox.getElementsByClassName("player-div")
            console.log(playersCards)
            Array.from(playersCards).forEach(player => player.remove())
            renderAllPlayers(resultsArray)
        })
}

//Helpers
function deleteSequence(event) {
    const button = event.target
    const card = button.closest(".player-div")
    const id = card.dataset.id
    deletePlayer(id)
    card.remove()
}

function editSequence(event) {
    const button = event.target
    const card = button.closest(".player-div")
    console.log(card)
    const image = card.getElementsByTagName("img")[0]
    const id = card.dataset.id
    const originalImg = card.getElementsByTagName("img")[0].src
    image.remove()
    button.remove()
    const editFormBox = document.createElement("div")
    const originalNum = parseInt(card.getElementsByTagName("h4")[0].innerHTML.replace("#", ""))
    console.log(originalImg.src)
    editFormBox.innerHTML = `
        <form>
            <label for="number">Number:</label><br>
            <input type="number" name="number" value=${originalNum}><br>
            <label for="image">Image:</label><br>
            <input type="text" name="image" value=${originalImg}><br>
            <input type="submit" value="Confirm Changes">
    `
    card.append(editFormBox)
    editFormBox.getElementsByTagName("form")[0].addEventListener("submit", function (e) {
        e.preventDefault()
        const editedPlayer = {
            number: e.target.number.value,
            image: e.target.image.value
        }
        updatePlayer(id, editedPlayer)
            .then(editedPlayerObject => {
                editFormBox.remove()
                card.remove()
                renderOnePlayer(editedPlayerObject)
            })
    })

}

//Render Functions
function renderOnePlayer(playerObject) {
    const playerDiv = document.createElement("div")
    playerDiv.className = "player-div"
    playerDiv.dataset.id = playerObject.id
    playerDiv.innerHTML = `
        <h3>${playerObject.name}</h3>
        <h4>#${playerObject.number}</h4>
        <img src="${playerObject.image}" alt="${playerObject.name}">
        <br>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
    `
    playersBox.appendChild(playerDiv)
}

function renderAllPlayers(playersData) {
    playersData.forEach(renderOnePlayer)
}