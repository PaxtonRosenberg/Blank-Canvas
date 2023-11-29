/* global data */
const $artStyle = document.getElementById('art-style');
const $randomButton = document.querySelector('.randomize');
const $createButton = document.querySelector('.create');
const $ul = document.querySelector('ul');
const $galleryText = document.querySelector('.gallery-text');
const $form = document.getElementById('art-selections');
const $noResultsText = document.querySelector('.no-results');
const $searchResults = document.querySelector('[data-view=search-results]');
const $searchInputs = document.querySelector('[data-view=search-form]');
const $hamburgerMenu = document.querySelector('.hamburger');
const $menuItems = document.querySelector('.menu');
const $main = document.querySelector('main');
const $homeLink = document.querySelector('.home-link');
const $galleryLink = document.querySelector('.gallery-link');
const $showcaseLink = document.querySelector('.showcase-link');
const $workspaceLink = document.querySelector('.workspace-link');
const $home = document.querySelector('.home-link');
const $gallery = document.querySelector('.gallery-link');
const $styleOption = document.querySelectorAll('.style-option');
let artStyle = null;
let result;

function ajaxRequest() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.artic.edu/api/v1/artworks?fields=artist_title,date_display,date_start,date_end,department_title,description,image_id,title&limit=100`,
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const artworks = xhr.response.data;
    console.log(artworks);
    for (let i = 0; i < artworks.length; i++) {
      if (artworks[i].department_title === artStyle && artworks[i].date_end) {
        const artObject = {};
        artObject.artistTitle = artworks[i].artist_title;
        artObject.startDate = artworks[i].date_start;
        artObject.endDate = artworks[i].date_end;
        artObject.displayDate = artworks[i].display_date;
        artObject.departmentTitle = artworks[i].department_title;
        artObject.description = artworks[i].description;
        artObject.imageId = artworks[i].image_id;
        artObject.title = artworks[i].title;
        data.matches.push(artObject);
      }
    }
    toggleNoResultsText();
    for (let i = 0; i < data.matches.length; i++) {
      result = renderResults(data.matches[i]);
      $ul.prepend(result);
    }
  });
  xhr.send();
}

$form.addEventListener('submit', function (event) {
  event.preventDefault();
  artStyle = $artStyle.value;
  ajaxRequest();
  viewSwap('search-results');
});

function renderResults(entry) {
  const $listItem = document.createElement('li');
  $listItem.setAttribute('class', 'column-third');

  const $image = document.createElement('img');
  $image.setAttribute('class', 'gallery-img');

  if (entry.imageId === null) {
    $image.setAttribute('src', 'images/placeholder-image.jpg');
  } else {
    $image.setAttribute(
      'src',
      `https://www.artic.edu/iiif/2/${entry.imageId}/full/843,/0/default.jpg`,
    );
  }
  $listItem.appendChild($image);

  const $heartBox = document.createElement('div');
  $heartBox.setAttribute('class', 'heart-box');
  $listItem.append($heartBox);

  const $heart = document.createElement('i');
  $heart.setAttribute('class', 'fa-regular fa-heart fa-xl');
  $heartBox.appendChild($heart);

  const $title = document.createElement('h4');
  $title.setAttribute('class', 'title-text');
  $title.textContent = entry.title;
  $listItem.appendChild($title);

  const $tagline = document.createElement('h5');
  $tagline.setAttribute('class', 'tagline-text');
  if (entry.artistTitle === null) {
    $tagline.textContent = `unknown, ${entry.startDate}-${entry.endDate}`;
  } else if (entry.startDate === entry.endDate) {
    $tagline.textContent = `${entry.artistTitle}, ${entry.endDate}`;
  } else {
    $tagline.textContent = `${entry.artistTitle}, ${entry.startDate}-${entry.endDate}`;
  }

  $listItem.append($tagline);

  return $listItem;
}

function viewSwap(view) {
  if (view === 'search-results') {
    $searchResults.className = 'form-container';
    $searchInputs.className = 'hidden';
    $galleryText.className = 'gallery-text';
    $galleryText.textContent = `Gallery - ${$artStyle.value}`;
    $form.reset();
  } else if (view === 'search-form') {
    $searchResults.className = 'hidden';
    $searchInputs.className = 'form-container';
    $galleryText.textContent = '';
    $noResultsText.className = 'hidden';
    $form.reset();
  }
  data.view = view;
}

function toggleNoResultsText() {
  if (data.matches.length !== 0) {
    $noResultsText.className = 'hidden';
  } else {
    $noResultsText.className = 'no-results';
  }
}

function toggleMenu() {
  if ($menuItems.className === 'menu') {
    $menuItems.className = 'menu hidden';
  }
}

$hamburgerMenu.addEventListener('click', function (event) {
  if ($menuItems.className === 'menu hidden') {
    $menuItems.className = 'menu';
  } else if ($menuItems.className === 'menu') {
    $menuItems.className = 'menu hidden';
  }
});

$home.addEventListener('click', function () {
  viewSwap('search-form');
  toggleMenu();
  $ul.innerHTML = '';
  artStyle = null;
  data.matches = [];
  $form.reset();
});

$gallery.addEventListener('click', function () {
  viewSwap('search-results');
  toggleMenu();
  $form.reset();
  if (artStyle === null) {
    $galleryText.textContent = 'Gallery';
  } else {
    $galleryText.textContent = `Gallery - ${$artStyle.value}`;
  }
});

function pickRandomStyle(options) {
  return $styleOption[Math.floor(Math.random() * $styleOption.length)];
}

$randomButton.addEventListener('click', function (event) {
  if ($styleOption.className !== 'exclude') {
    const randomStyleChoice = pickRandomStyle($artStyle.options);
    $artStyle.value = randomStyleChoice.value;
  }
});
