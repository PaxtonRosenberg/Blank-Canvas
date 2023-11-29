/* global data */
const $artPeriod = document.getElementById('art-period');
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
const $periodOption = document.querySelectorAll('.period-option');
let artStyle = null;
let result;

function ajaxRequest() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.artic.edu/api/v1/artworks?`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const artworks = xhr.response.data;
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
    $galleryText.textContent = `Gallery - ${$artStyle.value}, ${$artPeriod.value}`;
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
    $galleryText.textContent = `Gallery - ${$artStyle.value}, ${$artPeriod.value}`;
  }
});

function pickRandomStyle(options) {
  return $styleOption[Math.floor(Math.random() * $styleOption.length)];
}

function pickRandomPeriod(options) {
  return $periodOption[Math.floor(Math.random() * $periodOption.length)];
}

$randomButton.addEventListener('click', function (event) {
  if ($periodOption.className !== 'exclude') {
    const randomPeriodChoice = pickRandomPeriod($artPeriod.options);
    $artPeriod.value = randomPeriodChoice.value;
  }
  if ($styleOption.className !== 'exclude') {
    const randomStyleChoice = pickRandomStyle($artStyle.options);
    $artStyle.value = randomStyleChoice.value;
  }
});

// fields=artist_title,date_display,date_start,date_end,department_title,description,image_id,title&limit=100&page=5

// const $photoUrl = document.getElementById('photo-url');
// const $image = document.querySelector('img');
// const $form = document.getElementById('journal-entry');
// const $title = document.getElementById('title');
// const $notes = document.getElementById('notes');
// const $entryHeader = document.querySelector('.headline');
// let liToReplace;
// let liToDelete;
// const $deleteEntry = document.querySelector('.delete');

// $photoUrl.addEventListener('input', function (event) {
//   $image.setAttribute('src', $photoUrl.value);
// });

// $form.addEventListener('submit', function (event) {
//   event.preventDefault();

//   const $title = $form.elements[0].value;
//   const $photo = $form.elements[1].value;
//   const $notes = $form.elements[2].value;

//   const formObject = {
//     title: $title,
//     url: $photo,
//     notes: $notes,
//   };

//   if (data.editing === null) {
//     formObject.entryId = data.nextEntryId;

//     data.entries.unshift(formObject);

//     data.nextEntryId++;

//     const newEntry = renderEntry(formObject);

//     $ul.prepend(newEntry);
//   } else {
//     formObject.entryId = data.editing.entryId;

//     for (let i = 0; i < data.entries.length; i++) {
//       if (data.entries[i].entryId === formObject.entryId) {
//         data.entries[i] = formObject;
//       }
//       const $lis = document.querySelectorAll('li');

//       const updatedLi = renderEntry(formObject);

//       for (let x = 0; x < $lis.length; x++) {
//         const currentEntryId = Number($lis[x].getAttribute('data-entry-id'));

//         if (currentEntryId === formObject.entryId) {
//           liToReplace = $lis[x];
//         }
//       }
//       liToReplace.replaceWith(updatedLi);
//     }
//     $entryHeader.textContent = 'New Entry';

//     data.editing = null;
//   }

//   $deleteEntry.className = 'hidden';

//   viewSwap('entries');

//   $image.setAttribute('src', 'images/placeholder-image-square.jpg');

//   $form.reset();

//   toggleNoEntriesText();
// });

// function renderEntry(entry) {
//   const $listItem = document.createElement('li');
//   $listItem.setAttribute('class', 'list-display');

//   const $columnHalf = document.createElement('div');
//   $columnHalf.setAttribute('class', 'column-half');
//   $listItem.appendChild($columnHalf);

//   const $image = document.createElement('img');
//   $image.setAttribute('src', entry.url);
//   $columnHalf.appendChild($image);

//   const $columnHalf2 = document.createElement('div');
//   $columnHalf2.setAttribute('class', 'column-half');
//   $listItem.append($columnHalf2);

//   const $titleContainer = document.createElement('div');
//   $titleContainer.setAttribute('class', 'title-container');
//   $columnHalf2.append($titleContainer);

//   const $title = document.createElement('h2');
//   $title.textContent = entry.title;
//   $titleContainer.appendChild($title);

//   const $pencil = document.createElement('i');
//   $pencil.setAttribute('class', 'fa-solid fa-pencil fa-lg');
//   $titleContainer.appendChild($pencil);

//   const $notes = document.createElement('p');
//   $notes.textContent = entry.notes;
//   $columnHalf2.append($notes);

//   $listItem.setAttribute('data-entry-id', entry.entryId);

//   return $listItem;
// }

// const $ul = document.querySelector('ul');

// document.addEventListener('DOMContentLoaded', function (event) {
//   for (let i = 0; i < data.entries.length; i++) {
//     const $dataEntries = renderEntry(data.entries[i]);

//     $ul.appendChild($dataEntries);
//   }

//   const pageViewed = data.view;

//   viewSwap(pageViewed);

//   toggleNoEntriesText();
// });

// const $noEntriesText = document.querySelector('.no-entries');

// function toggleNoEntriesText() {
//   if (data.entries.length !== 0) {
//     $noEntriesText.className = 'hidden';
//   } else {
//     $noEntriesText.className = 'no-entries';
//   }
// }

// const $entriesView = document.querySelector('[data-view="entries"]');
// const $formView = document.querySelector('[data-view="entry-form"]');

// function viewSwap(view) {
//   if (view === 'entries') {
//     $entriesView.className = '';

//     $formView.className = 'hidden';

//     $image.setAttribute('src', 'images/placeholder-image-square.jpg');

//     $entryHeader.textContent = 'New Entry';

//     $deleteEntry.className = 'hidden';

//     $form.reset();
//   } else if (view === 'entry-form') {
//     $entriesView.className = 'hidden';

//     $formView.className = '';

//     $image.setAttribute('src', 'images/placeholder-image-square.jpg');

//     $entryHeader.textContent = 'New Entry';

//     $deleteEntry.className = 'hidden';

//     $form.reset();
//   }

//   data.view = view;
// }

// const $entriesToggle = document.querySelector('.entries-toggle');

// $entriesToggle.addEventListener('click', function () {
//   viewSwap('entries');

//   toggleNoEntriesText();
// });

// const $newEntryButton = document.querySelector('.new-entry-toggle');

// $newEntryButton.addEventListener('click', function () {
//   viewSwap('entry-form');
// });

// $ul.addEventListener('click', function (event) {
//   if (event.target.tagName === 'I') {
//     viewSwap('entry-form');
//     const clickedParent = event.target.closest('li');
//     const idValue = Number(clickedParent.getAttribute('data-entry-id'));

//     for (let i = 0; i < data.entries.length; i++) {
//       if (idValue === data.entries[i].entryId) {
//         data.editing = data.entries[i];

//         $image.setAttribute('src', data.entries[i].url);

//         $photoUrl.value = data.entries[i].url;

//         $title.value = data.entries[i].title;

//         $notes.value = data.entries[i].notes;

//         $entryHeader.textContent = 'Edit Entry';

//         $deleteEntry.className = 'delete';
//       }
//     }
//   }
// });

// const $deleteModalOverlay = document.querySelector('.overlay');

// $deleteEntry.addEventListener('click', function (event) {
//   $deleteModalOverlay.className = 'overlay';
// });

// const $cancel = document.querySelector('.cancel');

// $cancel.addEventListener('click', function (event) {
//   $deleteModalOverlay.className = 'hidden';

//   $entryHeader.textContent = 'Edit Entry';

//   $deleteEntry.className = 'delete';
// });

// const $confirm = document.querySelector('.confirm');

// $confirm.addEventListener('click', function (event) {
//   viewSwap('entries');

//   $deleteModalOverlay.className = 'hidden';

//   for (let i = 0; i < data.entries.length; i++) {
//     if (data.entries[i].entryId === data.editing.entryId) {
//       data.entries[i] = data.editing;
//     }
//     const $lis = document.querySelectorAll('li');

//     for (let x = 0; x < $lis.length; x++) {
//       const currentEntryId = Number($lis[x].getAttribute('data-entry-id'));

//       if (currentEntryId === data.editing.entryId) {
//         liToDelete = $lis[x];
//       }
//     }
//     liToDelete.remove();
//   }
//   $entryHeader.textContent = 'New Entry';

//   data.editing = null;

//   $deleteEntry.className = 'hidden';

//   viewSwap('entries');

//   $image.setAttribute('src', 'images/placeholder-image-square.jpg');

//   $form.reset();

//   toggleNoEntriesText();
// });
