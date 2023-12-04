const targetURL = 'https://api.rawg.io/api/games';
const key = 'c76172b8a9d1457998e7ae8127840d5d';
let timeoutID = null;
const $search = document.querySelector('#search-bar');
const $searchForm = document.querySelector('#search-form');
const $resultsPopup = document.querySelector('.results-popup');
const $loadingGif = document.querySelector('.loading-gif');
const $resultsContent = document.querySelector('.results-content');
const $resultsCount = document.querySelector('.results-count');

// Creates a number of DOM objects from results
function createResults(results, count) {
  //  <div class="results-entry row">
  //     <div class="image-wrapper">
  //       <img src="https://media.rawg.io/media/games/a91/a9108384b5d691080b294cd744f350c9.jpg" />
  //     </div>
  //     <div class="results-entry-content">
  //       <p>Baldur's Gate</p>
  //     </div>
  //   </div>
}

function handleResultsCount(count) {
  if (count) {
    $resultsCount.innerText = count;
  } else {
    $resultsCount.innerText = '';
  }
}
async function getSearchResults(query) {
  // const response = await fetch(
  //   `${targetURL}?key=${key}&search=${encodeURIComponent(query)}`,
  // );

  //example based  off of  "Baldur's Gate" query
  const response = await fetch(`../js/test.json`);
  return await response.json();
}

async function handleInput(event) {
  if (event.target.value.trim() !== '') {
    $resultsPopup.classList.remove('hidden');
    $loadingGif.classList.remove('hidden');
    $resultsContent.classList.add('hidden');

    async function test() {
      console.log('started');
      data.results = await getSearchResults(event.target.value);
      handleResultsCount(data.results.count);
      console.log(data.results);
      $loadingGif.classList.add('hidden');
      $resultsContent.classList.remove('hidden');
    }
    clearTimeout(timeoutID);
    timeoutID = setTimeout(test, 1000);
  } else {
    $resultsPopup.classList.add('hidden');
  }
}

function handleBlur(event) {
  // $resultsPopup.classList.add("hidden");
}

async function handleSubmit(event) {
  event.preventDefault();
  data.results = await getSearchResults($search.value);
}

$search.addEventListener('input', handleInput);
$search.addEventListener('blur', handleBlur);
$searchForm.addEventListener('submit', handleSubmit);
