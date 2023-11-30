const targetURL = 'https://api.rawg.io/api/games';
const key = 'c76172b8a9d1457998e7ae8127840d5d';
const $search = document.querySelector('#search-bar');
const $searchForm = document.querySelector('#search-form');

async function getSearchResults(query) {
  const response = await fetch(
    `${targetURL}?key=${key}&search=${encodeURIComponent(query)}`,
  );
  return await response.json();
}

async function handleInput(event) {
  data.results = await getSearchResults(event.target.value);
}

async function handleSubmit(event) {
  event.preventDefault();
  data.results = await getSearchResults($search.value);
}

$search.addEventListener('input', handleInput);
$searchForm.addEventListener('submit', handleSubmit);
