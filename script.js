const searchBar = document.querySelector('#search-bar')
const searchButton = document.querySelector('#search-button')
const pageCount = document.querySelector('#page-count')
const backwardOrForward = document.querySelectorAll('.backward-or-forward')
const searchResultsContainer = document.querySelector('#search-results-container')
const forwardOrBackward = document.querySelectorAll('.forward-or-backward')
const pageNumber = document.querySelector('#page-number')
const maxPages = document.querySelector('#max-pages')
const previousOrNextPage = document.querySelector('#previous-or-next-page')
const GIT_USER_DATA = []
let ITEMS_PER_PAGE = 0
let FETCH_SWITCH = true
searchButton.disabled = true

function showUsersOnTheScreen({ login, id, html_url, avatar_url }) {

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

function cleanUsers() {
    while (searchResultsContainer.childElementCount > 0)
        searchResultsContainer.removeChild(searchResultsContainer.firstElementChild)
}

function appendUsers() {
    cleanUsers()

    for (let i = ITEMS_PER_PAGE; i < Math.min(ITEMS_PER_PAGE + Number(pageCount.value), GIT_USER_DATA.length); i++) {
        showUsersOnTheScreen(GIT_USER_DATA[i])
    }
}

function resetPageNumbers() {
    ITEMS_PER_PAGE = 0
    pageNumber.innerText = GIT_USER_DATA.length > 0 ? 1 : 0
    maxPages.innerText = Math.ceil((GIT_USER_DATA.length) / Number(pageCount.value))
}

function showPagingAndEnableSearchButton() {
    previousOrNextPage.style.display = 'flex'
    searchButton.disabled = true
}

async function fetchData() {

    if (FETCH_SWITCH) {
        FETCH_SWITCH = !FETCH_SWITCH
        try {
            const api = await fetch(`https://api.github.com/search/users?q=${searchBar.value}&per_page=100`)
            const data = await api.json()

            GIT_USER_DATA.length = 0
            GIT_USER_DATA.push(...data.items)

            showPagingAndEnableSearchButton()
            resetPageNumbers()
            appendUsers()

        } catch (err) {
            console.log(err)
        } finally {
            FETCH_SWITCH = !FETCH_SWITCH
        }
    }
}

searchButton.addEventListener('click', fetchData)
searchBar.addEventListener('change', () => {
    if (searchBar.value !== '') searchButton.disabled = false
})
searchBar.addEventListener('keydown', (e) => e.key === 'Enter' ? fetchData() : null)
pageCount.addEventListener('change', () => GIT_USER_DATA.length > 0 ? fetchData() : null)

forwardOrBackward.forEach(button => {
    button.addEventListener('click', (e) => {

        numOfPagesSelected = Number(pageCount.value)

        if (e.target.id === 'one-backward') {
            ITEMS_PER_PAGE = ITEMS_PER_PAGE - pageCount.value < 0
                ? 0
                : (pageNumber.innerText--, ITEMS_PER_PAGE - numOfPagesSelected)
        }
        else if (e.target.id === 'one-forward') {
            ITEMS_PER_PAGE = ITEMS_PER_PAGE + numOfPagesSelected >= GIT_USER_DATA.length
                ? ITEMS_PER_PAGE
                : (pageNumber.innerText++, ITEMS_PER_PAGE + numOfPagesSelected)
        }
        else if (e.target.id === 'full-forward') {
            pageNumber.innerText = Math.ceil((GIT_USER_DATA.length) / numOfPagesSelected)
            ITEMS_PER_PAGE = Number(pageNumber.innerText - 1) * pageCount.value
        }
        else if (e.target.id === 'full-backward') resetPageNumbers()

        appendUsers()
    })
})
