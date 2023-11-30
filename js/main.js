/* global data */
const $artStyle = document.getElementById('art-style');
const $randomButton = document.querySelector('.randomize');
const $createButton = document.querySelector('.create');
const $ul = document.querySelector('ul');
const $showcaseUl = document.querySelector('.showcase-list');
const $workspaceUl = document.querySelector('.workspace-list');
const $galleryText = document.querySelector('.gallery-text');
const $form = document.getElementById('art-selections');
const $noResultsText = document.querySelector('.no-results');
const $searchResults = document.querySelector('[data-view=search-results]');
const $searchInputs = document.querySelector('[data-view=search-form]');
const $showcaseView = document.querySelector('[data-view=showcase]');
const $workspaceView = document.querySelector('[data-view=workspace]');
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
const $saveButton = document.querySelector('.save-rating');
let artStyle = null;
let result;
const favorites = [];

function ajaxRequest() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.artic.edu/api/v1/artworks?fields=id,artist_title,date_display,date_start,date_end,department_title,description,image_id,title&limit=100',
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const artworks = xhr.response.data;
    data.matches = [];
    console.log(artworks);
    for (let i = 0; i < artworks.length; i++) {
      if (artworks[i].department_title === artStyle) {
        const artObject = {};
        artObject.artistTitle = artworks[i].artist_title;
        artObject.startDate = artworks[i].date_start;
        artObject.endDate = artworks[i].date_end;
        artObject.displayDate = artworks[i].display_date;
        artObject.departmentTitle = artworks[i].department_title;
        artObject.description = artworks[i].description;
        artObject.imageId = artworks[i].image_id;
        artObject.title = artworks[i].title;
        artObject.id = artworks[i].id;
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
  $showcaseView.classList.add('hidden');
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

  for (let i = 0; i < data.showcase.length; i++) {
    if (data.showcase.length === 0) {
      $heart.setAttribute('class', 'fa-regular fa-heart fa-xl');
    } else if (data.showcase[i].id === entry.id) {
      $heart.setAttribute('class', 'fa-solid fa-heart fa-xl red-bg');
    }
  }
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

  $listItem.setAttribute('data-entry-id', entry.id);

  $listItem.append($tagline);

  return $listItem;
}

function viewSwap(view) {
  if (view === 'search-results') {
    $searchResults.className = 'form-container';
    $searchInputs.className = 'hidden';
    $galleryText.className = 'gallery-text';
    $galleryText.textContent = `Gallery - ${$artStyle.value}`;
    $showcaseView.classname = 'hidden';
    $workspaceView.className = 'hidden';
    $saveButton.className = 'hidden';
    $form.reset();
  } else if (view === 'search-form') {
    $searchResults.className = 'hidden';
    $searchInputs.className = 'form-container';
    $galleryText.className = 'hidden';
    $noResultsText.className = 'hidden';
    $showcaseView.className = 'hidden';
    $workspaceView.className = 'hidden';
    $saveButton.className = 'hidden';
    $form.reset();
  } else if (view === 'showcase') {
    $searchResults.className = 'hidden';
    $searchInputs.className = 'hidden';
    $galleryText.className = 'gallery-text';
    $galleryText.textContent = 'Showcase';
    $noResultsText.className = 'hidden';
    $showcaseView.className = 'form-container';
    $showcaseUl.className = 'showcase-list';
    $workspaceView.className = 'hidden';
    $saveButton.className = 'hidden';
    $form.reset();
  } else if (view === 'workspace') {
    $searchInputs.className = 'hidden';
    $searchResults.className = 'hidden';
    $showcaseView.className = 'hidden';
    $galleryText.className = 'gallery-text';
    $galleryText.textContent = 'Workspace';
    $workspaceView.className = '';
    $saveButton.className = 'save-rating';
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
  $form.reset();
});

$gallery.addEventListener('click', function () {
  viewSwap('search-results');
  $showcaseUl.classList.add('hidden');
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

function heartButtonToggle(element) {
  if (element.className === 'fa-regular fa-heart fa-xl') {
    element.className = 'fa-solid fa-heart fa-xl red-bg';
  } else if (element.className === 'fa-solid fa-heart fa-xl red-bg') {
    element.className = 'fa-regular fa-heart fa-xl';
  }
}

$ul.addEventListener('click', function (event) {
  if (event.target.tagName === 'I') {
    heartButtonToggle(event.target);
    const clickedParent = event.target.closest('li');
    const entryId = Number(clickedParent.getAttribute('data-entry-id'));

    for (let i = 0; i < data.matches.length; i++) {
      if (entryId === data.matches[i].id) {
        results = renderShowcase(data.matches[i]);
        $showcaseUl.prepend(results);
        data.showcase.push(data.matches[i]);
      }
    }
  }
});

$showcaseLink.addEventListener('click', function (event) {
  viewSwap('showcase');
  toggleMenu();
});

function renderShowcase(entry) {
  for (let i = 0; i < data.showcase.length; i++) {
    if (data.showcase[i].id !== entry.id) {
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
      $heart.setAttribute('class', 'fa-solid fa-heart fa-xl red-bg');
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

      $listItem.setAttribute('data-entry-id', entry.id);

      $listItem.append($tagline);

      return $listItem;
    }
  }
}

$showcaseUl.addEventListener('click', function (event) {
  if (event.target.tagName === 'I') {
    heartButtonToggle(event.target);
  }
});

document.addEventListener('DOMContentLoaded', function (event) {
  for (let i = 0; i < data.showcase.length; i++) {
    result = renderShowcase(data.showcase[i]);
    $showcaseUl.prepend(result);
  }
});

$showcaseUl.addEventListener('click', function (event) {
  if (event.target.tagName === 'IMG' && data.view === 'showcase') {
    viewSwap('workspace');
    data.workspace = [];
    const clickedParent = event.target.closest('li');
    const entryId = Number(clickedParent.getAttribute('data-entry-id'));

    for (let i = 0; i < data.showcase.length; i++) {
      if (entryId === data.showcase[i].id) {
        data.workspace.push(data.showcase[i]);
        result = renderWorkspace(data.showcase[i]);
        $workspaceUl.append(result);
      }
    }
  }
});

$workspaceLink.addEventListener('click', function (event) {
  viewSwap('workspace');
  toggleMenu();
});

function renderWorkspace(entry) {
  if (data.workspace.length === 1) {
    const $listItem = document.createElement('li');

    const $image = document.createElement('img');
    $image.setAttribute('class', 'workspace-img');

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
    $heart.setAttribute('class', 'fa-solid fa-heart fa-xl red-bg');
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

    $listItem.setAttribute('data-entry-id', entry.id);

    $listItem.appendChild($tagline);

    const $descriptionHeaderBox = document.createElement('div');
    $descriptionHeaderBox.setAttribute('class', 'description-header-box');
    $listItem.appendChild($descriptionHeaderBox);

    const $descriptionLabel = document.createElement('p');
    $descriptionLabel.setAttribute('class', 'description-header-text');
    $descriptionLabel.textContent = 'Description';
    $descriptionHeaderBox.appendChild($descriptionLabel);

    const $plus = document.createElement('i');
    $plus.setAttribute('class', 'fa-solid fa-plus fa-sm');
    $descriptionHeaderBox.appendChild($plus);

    const $descriptionBox = document.createElement('div');
    $descriptionBox.setAttribute('class', 'hidden description-box');
    $listItem.appendChild($descriptionBox);

    const $description = document.createElement('p');
    if (entry.description === null) {
      $description.textContent = 'No description available';
    } else {
      $description.innerHTML = `${entry.description}`;
    }

    $description.setAttribute('class', 'description-text');

    $descriptionBox.append($description);

    return $listItem;
  }
}

$workspaceUl.addEventListener('click', function (event) {
  if (
    event.target.tagName === 'I' &&
    event.target.className === 'fa-solid fa-plus fa-sm'
  ) {
    const clickedParent = event.target.closest('li');

    const $descriptionBox = clickedParent.querySelector('.description-box');

    const $expand = clickedParent.querySelector('.fa-plus');

    if ($descriptionBox.className === 'hidden description-box') {
      $descriptionBox.className = 'description-box';
      $expand.className = 'fa-solid fa-minus fa-sm';
    } else if ($descriptionBox.className === 'description-box') {
      $descriptionBox.className = 'hidden description-box';
      $expand.className = 'fa-solid fa-plus fa-sm';
    }
  } else if (
    event.target.tagName === 'I' &&
    event.target.className === 'fa-solid fa-minus fa-sm'
  ) {
    const clickedParent = event.target.closest('li');

    const $descriptionBox = clickedParent.querySelector('.description-box');

    const $restract = clickedParent.querySelector('.fa-minus');

    $descriptionBox.className = 'hidden description-box';

    $restract.className = 'fa-solid fa-plus fa-sm';
  }
});
