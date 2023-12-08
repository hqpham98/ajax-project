const targetURL = 'https://api.rawg.io/api/games';
const key = 'c76172b8a9d1457998e7ae8127840d5d';
let timeoutID = null;
const $search = document.querySelector('#search-bar');
const $searchForm = document.querySelector('#search-form');
const $resultsPopup = document.querySelector('.results-popup');
const $loadingGif = document.querySelector('.loading-gif');
const $resultsContent = document.querySelector('.results-content');
const $resultsCount = document.querySelector('.results-count');

function clearEntries() {
  const entries = document.querySelectorAll(
    '.results-content > .results-entry',
  );
  if (entries) {
    for (entry of entries) {
      $resultsContent.removeChild(entry);
    }
  }
}

//store data in localStorage
function saveData() {
  localStorage.setItem('gameStuff', JSON.stringify(data));
}

//handle Array of Platform objects
function handlePlatforms(platforms) {
  let platform = '';
  let result = document.createElement('span');
  for (let i = 0; i < platforms.length; i++) {
    platform = platforms[i].platform.name;
    let plat = document.createElement('i');
    switch (platform) {
      case 'PC':
        plat.className = 'fa-brands fa-windows';
        result.appendChild(plat);
        break;
      case 'Apple Macintosh':
        plat.className = 'fa-brands fa-apple';
        result.appendChild(plat);
        break;
      case 'iOS':
        plat.className = 'fa-brands fa-app-store-ios';
        result.appendChild(plat);
        break;
      case 'Playstation':
        plat.className = 'fa-brands fa-playstation';
        result.appendChild(plat);
        break;
      case 'Xbox':
        plat.className = 'fa-brands fa-xbox';
        result.appendChild(plat);
        break;
      case 'Android':
        plat.className = 'fa-brands fa-google-play';
        result.appendChild(plat);
        break;
    }
  }
  return result;
}
function renderSearchEntries(results, count) {
  for (let i = 0; i < results.length && i < count; i++) {
    $resultsContent.appendChild(createSearchEntry(results[i]));
  }
}

function createSearchEntry(entry) {
  const entryRow = document.createElement('div');
  entryRow.className = 'results-entry row';
  entryRow.setAttribute('data-entry-id', entry.id);
  const imageColumn = document.createElement('div');
  imageColumn.className = 'column-10 justify-center align-center';
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'image-wrapper';
  const image = document.createElement('img');
  // image.className = "display-block";
  image.setAttribute('src', entry.background_image);
  image.setAttribute('alt', 'game image');
  const contentColumn = document.createElement('div');
  contentColumn.className = 'column-90';
  const platformRow = document.createElement('div');
  platformRow.className = 'row results-entry-platform align-top';
  const platformSpan = handlePlatforms(entry.parent_platforms);
  const contentRow = document.createElement('div');
  contentRow.className = 'row results-entry-content align-bottom';
  const contentSpan = document.createElement('span');
  contentSpan.innerText = entry.name;

  entryRow.appendChild(imageColumn);
  imageColumn.appendChild(imageWrapper);
  imageWrapper.appendChild(image);

  entryRow.appendChild(contentColumn);
  contentColumn.appendChild(platformRow);
  platformRow.appendChild(platformSpan);
  contentColumn.appendChild(contentRow);
  contentRow.appendChild(contentSpan);

  return entryRow;
}

function handleResultsCount(count) {
  if (count) {
    $resultsCount.innerText = count;
  } else {
    $resultsCount.innerText = '';
  }
}
async function getSearchResults(query) {
  const response = await fetch(
    `${targetURL}?key=${key}&search=${encodeURIComponent(query)}`,
  );
  return response.json();
}
async function getSelectedGame(gameID) {
  const response = await fetch(`${targetURL}/${gameID}?key=${key}`);
  return response.json();
}
async function handleInput(event) {
  if (event.target.value.trim() !== '') {
    $resultsPopup.classList.remove('hidden');
    $loadingGif.classList.remove('hidden');
    $resultsContent.classList.add('hidden');
    clearEntries();

    async function doSearch() {
      data.results = await getSearchResults(event.target.value);
      handleResultsCount(data.results.count);
      clearEntries();
      renderSearchEntries(data.results.results, 5);
      $loadingGif.classList.add('hidden');
      $resultsContent.classList.remove('hidden');
      saveData();
    }
    clearTimeout(timeoutID);
    timeoutID = setTimeout(doSearch, 750);
  } else {
    $resultsPopup.classList.add('hidden');
  }
}

async function handleEntryClick(event) {
  if (event.button === 0) {
    const entry = event.target.closest('.results-entry');
    if (entry) {
      data.selectedID = entry.getAttribute('data-entry-id');
      data.selectedGame = await getSelectedGame(data.selectedID);
      saveData();
      location.assign('game.html');
    }
  }
}

function handleBlur(event) {
  $resultsPopup.classList.add('hidden');
}

async function handleSubmit(event) {
  event.preventDefault();
  data.results = await getSearchResults($search.value);
}

function handleGamePageLoad(event) {
  if (window.location.pathname === '/game.html') {
    data = JSON.parse(localStorage.getItem('gameStuff'));
    const $gameTitle = document.querySelector('#game-title');
    const $rating = document.querySelector('#rating-val');
    const $platforms = document.querySelector('#platform-val');
    const $release = document.querySelector('#release-val');
    const $about = document.querySelector('#about-val');
    const $image = document.querySelector('#game-image');
    const $background = document.querySelector('#background-image');
    $gameTitle.innerText = data.selectedGame.name;
    $rating.innerText = data.selectedGame.rating;
    let plat = '';
    if (data.selectedGame.platforms) {
      for (let i = 0; i < data.selectedGame.platforms.length; i++) {
        plat += `${data.selectedGame.platforms[i].platform.name}${
          i === data.selectedGame.platforms.length - 1 ? '' : ', '
        }`;
      }
    }
    $platforms.innerText = plat;
    $release.innerText = data.selectedGame.released;
    $about.innerText = data.selectedGame.description_raw;
    $image.setAttribute('src', data.selectedGame.background_image_additional);
    $background.setAttribute('src', data.selectedGame.background_image);
  }
}

$search?.addEventListener('input', handleInput);
$search?.addEventListener('blur', handleBlur);
$searchForm?.addEventListener('submit', handleSubmit);
$resultsContent?.addEventListener('mousedown', handleEntryClick);
document.addEventListener('DOMContentLoaded', handleGamePageLoad);
