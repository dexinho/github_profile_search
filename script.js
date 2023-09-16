const searchBar = document.querySelector('#search-bar')
const searchButton = document.querySelector('#search-button')
const pageCount = document.querySelector('#page-count')
const backwardOrForward = document.querySelectorAll('.backward-or-forward')
const searchResultsContainer = document.querySelector('#search-results-container')

function appendUsers({login, id, html_url, avatar_url}) {

    const searchResultDiv = document.createElement('div')
    const imagePlaceholderDiv = document.createElement('div')
    const profilePicture = document.createElement('img')
    const profileDetailsDiv = document.createElement('div')
    const userNameSpan = document.createElement('span')
    const userIDSpan = document.createElement('span')
    const userURL = document.createElement('a')

    searchResultsContainer.append(searchResultDiv)
    searchResultDiv.append(imagePlaceholderDiv)
    searchResultDiv.append(profileDetailsDiv)
    profileDetailsDiv.append(userNameSpan)
    profileDetailsDiv.append(userIDSpan)
    profileDetailsDiv.append(userURL)
    imagePlaceholderDiv.append(profilePicture)

    searchResultDiv.classList.add('search-result-div')
    imagePlaceholderDiv.classList.add('image-placeholder-div')
    profilePicture.classList.add('profile-picture')
    profileDetailsDiv.classList.add('profile-details-div')
    userURL.classList.add('user-url')

    profilePicture.src = avatar_url
    profilePicture.alt = 'profile-picture'
    userNameSpan.innerText = login
    userIDSpan.innerText = id
    userURL.innerText = 'Github'
    userURL.href = html_url
    userURL.target = '_blank'
}

function cleanUsers(){
    while (searchResultsContainer.childElementCount > 0)
        searchResultsContainer.removeChild(searchResultsContainer.firstElementChild)
}

async function fetchData() {
    const api = await fetch(`https://api.github.com/search/users?q=${searchBar.value}&per_page=${pageCount.value}`)
    const data = await api.json()

    cleanUsers()

    data.items.forEach(profile => {
        appendUsers(profile)
    })
}

searchButton.addEventListener('click', fetchData)
