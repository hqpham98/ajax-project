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

//handle Array of Platform objects
function handlePlatforms(platforms) {
  let platform = '';
  let result = document.createElement('span');
  for (let i = 0; i < platforms.length; i++) {
    platform = platforms[i].platform.name;
    if (platform === 'PC') {
      let plat = document.createElement('i');
      plat.className = 'fa-brands fa-windows';
      result.appendChild(plat);
    } else if (platform === 'Apple Macintosh') {
      let plat = document.createElement('i');
      plat.className = 'fa-brands fa-apple';
      result.appendChild(plat);
    } else if (platform === 'iOS') {
      let plat = document.createElement('i');
      plat.className = 'fa-brands fa-app-store-ios';
      result.appendChild(plat);
    } else if (platform === 'Playstation') {
      let plat = document.createElement('i');
      plat.className = 'fa-brands fa-playstation';
      result.appendChild(plat);
    } else if (platform === 'Xbox') {
      let plat = document.createElement('i');
      plat.className = 'fa-brands fa-xbox';
      result.appendChild(plat);
    } else if (platform === 'Android') {
      let plat = document.createElement('i');
      plat.className = 'fa-brands fa-google-play';
      result.appendChild(plat);
    }
  }
  return result;
}

async function renderSearchEntries(results, count) {
  for (let i = 0; i < results.length && i < count; i++) {
    $resultsContent.appendChild(createSearchEntry(results[i]));
  }
}

function createSearchEntry(entry) {
  const entryRow = document.createElement('div');
  entryRow.className = 'results-entry row';
  const imageColumn = document.createElement('div');
  imageColumn.className = 'column-10';
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'image-wrapper';
  const image = document.createElement('img');
  image.setAttribute('src', entry.background_image);
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

async function handleInput(event) {
  if (event.target.value.trim() !== '') {
    $resultsPopup.classList.remove('hidden');
    $loadingGif.classList.remove('hidden');
    $resultsContent.classList.add('hidden');
    clearEntries();

    async function doSearch() {
      data.results = await getSearchResults(event.target.value);
      handleResultsCount(data.results.count);
      renderSearchEntries(data.results.results, 5);
      $loadingGif.classList.add('hidden');
      $resultsContent.classList.remove('hidden');
    }
    clearTimeout(timeoutID);
    timeoutID = setTimeout(doSearch, 750);
  } else {
    $resultsPopup.classList.add('hidden');
  }
}

function handleBlur(event) {
  $resultsPopup.classList.add('hidden');
}

async function handleSubmit(event) {
  event.preventDefault();
  data.results = await getSearchResults($search.value);
}

$search.addEventListener('input', handleInput);
$search.addEventListener('blur', handleBlur);
$searchForm.addEventListener('submit', handleSubmit);
