/* global data */

/* Document Selectors
 */
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
const $yes = document.querySelector('.yes');
const $no = document.querySelector('.no');
const $deleteModalOverlay = document.querySelector('.overlay-toggle');
let artStyle = null;
let result;
let matches = [];
const favorites = [];

/*AJAX Request function
 */
function ajaxRequest() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.artic.edu/api/v1/artworks?fields=id,artist_title,date_display,date_start,date_end,department_title,description,image_id,title&limit=100',
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const artworks = xhr.response.data;
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
        artObject.rating = 0;
        matches.push(artObject);
      }
    }
    toggleNoResultsText();
    for (let i = 0; i < matches.length; i++) {
      result = renderResults(matches[i]);
      $ul.prepend(result);
    }
  });
  xhr.send();
}
/*the form is the create gallery button on the home page and this is what
happens after you click it with search criteria
*/
$form.addEventListener('submit', function (event) {
  event.preventDefault();
  matches = [];
  artStyle = $artStyle.value;
  ajaxRequest();
  viewSwap('search-results');
  $showcaseView.classList.add('hidden');
});

/*rendering the items from the API to the gallery setup
 */
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

/* changing the views on the screen
 */
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

/*no results text for when the search query generates no results
 */
function toggleNoResultsText() {
  if (matches.length !== 0) {
    $noResultsText.className = 'hidden';
  } else {
    $noResultsText.className = 'no-results';
  }
}

/*toggles the hamburger menu options
 */
function toggleMenu() {
  if ($menuItems.className === 'menu hidden') {
    $menuItems.className = 'menu';
  } else if ($menuItems.className === 'menu') {
    $menuItems.className = 'menu hidden';
  }
}

/* when clicking the hamburger menu
 */
$hamburgerMenu.addEventListener('click', function (event) {
  toggleMenu();
});

// /*when clicking the home button in the hamburger menu
//  */
$home.addEventListener('click', function () {
  viewSwap('search-form');
  toggleMenu();
  $ul.innerHTML = '';
  artStyle = null;
  if (data.workspace.length > 0) {
    const workspaceLi = $workspaceUl.firstElementChild;
    workspaceLi.parentNode.removeChild(workspaceLi);
  }
  $form.reset();
});

// /*when clicking the gallery button in the hamburger menu
// */
$gallery.addEventListener('click', function () {
  viewSwap('search-results');
  $showcaseUl.classList.add('hidden');
  if (data.workspace.length > 0) {
    const workspaceLi = $workspaceUl.firstElementChild;
    workspaceLi.parentNode.removeChild(workspaceLi);
  }
  toggleMenu();
  $form.reset();
  if (artStyle === null) {
    $galleryText.textContent = 'Gallery';
  } else {
    $galleryText.textContent = `Gallery - ${$artStyle.value}`;
  }
});

/*function to pick a random style from the style drop down on the home page, called when the random
button is clicked
*/
function pickRandomStyle(options) {
  return $styleOption[Math.floor(Math.random() * $styleOption.length)];
}

/*random button event listener
 */
$randomButton.addEventListener('click', function (event) {
  if ($styleOption.className !== 'exclude') {
    const randomStyleChoice = pickRandomStyle($artStyle.options);
    $artStyle.value = randomStyleChoice.value;
  }
});

/*toggles the heart classes to be filled in or clear
 */
function heartButtonToggle(element) {
  if (element.className === 'fa-regular fa-heart fa-xl') {
    element.className = 'fa-solid fa-heart fa-xl red-bg';
  } else if (element.className === 'fa-solid fa-heart fa-xl red-bg') {
    element.className = 'fa-regular fa-heart fa-xl';
  }
}

// /*listens for a click on any element in the underordered list with an i tag
// */
$ul.addEventListener('click', function (event) {
  if (
    event.target.tagName === 'I' &&
    event.target.className === 'fa-regular fa-heart fa-xl'
  ) {
    heartButtonToggle(event.target);
    const clickedParent = event.target.closest('li');
    const entryId = Number(clickedParent.getAttribute('data-entry-id'));

    for (let i = 0; i < matches.length; i++) {
      if (entryId === matches[i].id) {
        results = renderShowcase(matches[i]);

        data.showcase.push(matches[i]);

        $showcaseUl.prepend(results);
      }
    }
  }
});

/*makes the DOM tree for a list item to be displayed on the showcase page.
 */
function renderShowcase(entry) {
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

  const $starsBox = document.createElement('div');
  $starsBox.setAttribute('class', 'stars-box');
  $heartBox.append($starsBox);

  const $star1 = document.createElement('i');
  const star1Class =
    entry.rating >= 1
      ? 'fa-solid fa-star fa-xl bg'
      : 'fa-regular fa-star fa-xl';
  $star1.setAttribute('class', star1Class);
  $star1.setAttribute('id', 'one');
  $starsBox.appendChild($star1);

  const $star2 = document.createElement('i');
  const star2Class =
    entry.rating >= 2
      ? 'fa-solid fa-star fa-xl bg'
      : 'fa-regular fa-star fa-xl';
  $star2.setAttribute('class', star2Class);
  $star2.setAttribute('id', 'two');
  $starsBox.appendChild($star2);

  const $star3 = document.createElement('i');
  const star3Class =
    entry.rating >= 3
      ? 'fa-solid fa-star fa-xl bg'
      : 'fa-regular fa-star fa-xl';
  $star3.setAttribute('class', star3Class);
  $star3.setAttribute('id', 'three');
  $starsBox.appendChild($star3);

  const $star4 = document.createElement('i');
  const star4Class =
    entry.rating >= 4
      ? 'fa-solid fa-star fa-xl bg'
      : 'fa-regular fa-star fa-xl';
  $star4.setAttribute('class', star4Class);
  $star4.setAttribute('id', 'four');
  $starsBox.appendChild($star4);

  const $star5 = document.createElement('i');
  const star5Class =
    entry.rating >= 5
      ? 'fa-solid fa-star fa-xl bg'
      : 'fa-regular fa-star fa-xl';
  $star5.setAttribute('class', star5Class);
  $star5.setAttribute('id', 'five');
  $starsBox.appendChild($star5);

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

/*showcase menu button, toggles the view to the showcase page
 */
$showcaseLink.addEventListener('click', function (event) {
  viewSwap('showcase');
  toggleMenu();
  if (data.workspace.length > 0) {
    const workspaceLi = $workspaceUl.firstElementChild;
    workspaceLi.parentNode.removeChild(workspaceLi);
  }
});

/*allows the entries to be rendered onto the showcase page once the content is loaded and without
refreshing the page. I used a document fragment to help performance as I initially tried this by rendering
each index of data.showcase, it significantly slowed down the page and caused timeout errors as my favorites list
and query grew
*/
document.addEventListener('DOMContentLoaded', function (event) {
  const fragment = document.createDocumentFragment();
  data.showcase.forEach(function (showcaseitem) {
    const result = renderShowcase(showcaseitem);
    fragment.prepend(result);
  });
  $showcaseUl.appendChild(fragment);
});

/*makes an image in on the showcase page clickable and changes the view to the workspace page, this also
will delete an item from the showcase page by clicking the heart when it is filled in. I used this link
to help with deleting an item from a specific index in local storage: https://sentry.io/answers/remove-specific-item-from-array/
Also, deletes the entry when the yes button is clicked
*/
$showcaseUl.addEventListener('click', function (event) {
  if (event.target.tagName === 'IMG' && data.view === 'showcase') {
    viewSwap('workspace');
    data.workspace = [];
    const clickedParent = event.target.closest('li');

    const entryId = Number(clickedParent.getAttribute('data-entry-id'));

    for (let i = 0; i < data.showcase.length; i++) {
      if (entryId === data.showcase[i].id && data.workspace.length === 0) {
        data.workspace.push(data.showcase[i]);
        result = renderWorkspace(data.workspace[0]);
        $workspaceUl.append(result);
      }
    }
  } else if (
    event.target.tagName === 'I' &&
    event.target.className === 'fa-solid fa-heart fa-xl red-bg'
  ) {
    const favoriteToDelete = event.target.closest('li');
    const favoriteToDeleteId = Number(
      favoriteToDelete.getAttribute('data-entry-id'),
    );

    $deleteModalOverlay.className = 'overlay-toggle';
    $yes.addEventListener('click', function (event) {
      const showcaseArray = [...$showcaseUl.children];

      for (let i = 0; i < showcaseArray.length; i++) {
        const showcaseEntry = showcaseArray[i];
        const showcaseId = Number(showcaseEntry.getAttribute('data-entry-id'));

        if (showcaseId === favoriteToDeleteId) {
          favoriteToDelete.parentNode.removeChild(favoriteToDelete);

          if (previousDataJSON !== null) {
            let storedFavorites = JSON.parse(previousDataJSON);
            for (let x = 0; x < storedFavorites.length; x++) {
              if (storedFavorites[x].id === favoriteToDeleteId) {
                const deletedFavorite = storedFavorites.splice(x, 1);
                const showcaseDelete = data.showcase.splice(x, 1);
                const updatedFavoritesJSON = JSON.stringify(storedFavorites);
                localStorage.setItem('favorite', updatedFavoritesJSON);
                break;
              }
            }
          }
        }
      }
      $deleteModalOverlay.className = 'hidden overlay-toggle';
    });
  }
});

/*removes the delete menu option if the no button is clicked
 */
$no.addEventListener('click', function (event) {
  $deleteModalOverlay.className = 'hidden overlay-toggle';
});

/*workspace menu button toggle
 */
$workspaceLink.addEventListener('click', function (event) {
  viewSwap('workspace');
  toggleMenu();
});

/*rendering the entry from the showcase page to the workspace page once the image is clicked
 */
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

    const $starsBox = document.createElement('div');
    $starsBox.setAttribute('class', 'stars-box');
    $heartBox.append($starsBox);

    const $star1 = document.createElement('i');
    $star1.setAttribute('class', 'fa-regular fa-star fa-xl');
    $star1.setAttribute('id', 'one');
    $starsBox.appendChild($star1);

    const $star2 = document.createElement('i');
    $star2.setAttribute('class', 'fa-regular fa-star fa-xl');
    $star2.setAttribute('id', 'two');
    $starsBox.appendChild($star2);

    const $star3 = document.createElement('i');
    $star3.setAttribute('class', 'fa-regular fa-star fa-xl');
    $star3.setAttribute('id', 'three');
    $starsBox.appendChild($star3);

    const $star4 = document.createElement('i');
    $star4.setAttribute('class', 'fa-regular fa-star fa-xl');
    $star4.setAttribute('id', 'four');
    $starsBox.appendChild($star4);

    const $star5 = document.createElement('i');
    $star5.setAttribute('class', 'fa-regular fa-star fa-xl');
    $star5.setAttribute('id', 'five');
    $starsBox.appendChild($star5);

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

/*this function does a few things, first it makes the +/- signs for the description drop down
clickable so you can toggle viewing the description of the art. Next this function makes the stars
clickable and triggers the function that fills in the stars as yellow when clicked.
*/
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
  } else if (event.target.tagName === 'I') {
    const clickedParent = event.target.closest('li');

    const stars = [...clickedParent.getElementsByClassName('fa-star')];

    executeRating(stars);

    stars.forEach(function (star) {
      if (
        star.getAttribute('id') === 'one' &&
        star.className === 'fa-solid fa-star fa-xl bg'
      ) {
        data.workspace[0].rating = 1;
      } else if (
        star.getAttribute('id') === 'two' &&
        star.className === 'fa-solid fa-star fa-xl bg'
      ) {
        data.workspace[0].rating = 2;
      } else if (
        star.getAttribute('id') === 'three' &&
        star.className === 'fa-solid fa-star fa-xl bg'
      ) {
        data.workspace[0].rating = 3;
      } else if (
        star.getAttribute('id') === 'four' &&
        star.className === 'fa-solid fa-star fa-xl bg'
      ) {
        data.workspace[0].rating = 4;
      } else if (
        star.getAttribute('id') === 'five' &&
        star.className === 'fa-solid fa-star fa-xl bg'
      ) {
        data.workspace[0].rating = 5;
      }
    });
  }
});

/* this function is what makes the stars change color when clicked, I used this guide as a reference
very helpful - https://dev.to/leonardoschmittk/how-to-make-a-star-rating-with-js-36d3
*/
function executeRating(stars) {
  const filledIn = 'fa-solid fa-star fa-xl bg';
  const notFilledIn = 'fa-regular fa-star fa-xl';
  let i;

  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star);

      if (star.className === notFilledIn) {
        for (i; i >= 0; i--) {
          stars[i].className = filledIn;
        }
      } else {
        for (i; i < stars.length; i++) {
          stars[i].className = notFilledIn;
        }
      }
    };
  });
}

/*this function swaps views back to the showcase page once the save button is clicked
it also gets the id from the entry that was ranked and compares it to the ids in the showcase array
since the new ranked image will need to be displayed on the showcase page, this function sets up the render
and replacement of the original list item from the showcase list.
*/
$saveButton.addEventListener('click', function (event) {
  viewSwap('showcase');
  const workspaceLi = $workspaceUl.firstElementChild;

  if (workspaceLi) {
    const workspaceId = Number(workspaceLi.getAttribute('data-entry-id'));
    const showcaseArray = [...$showcaseUl.children];

    for (let i = 0; i < showcaseArray.length; i++) {
      const showcaseEntry = showcaseArray[i];
      const showcaseId = Number(showcaseArray[i].getAttribute('data-entry-id'));

      if (showcaseId === workspaceId) {
        const clonedLi = renderShowcase(data.workspace[0]);
        $showcaseUl.insertBefore(clonedLi, showcaseEntry);
        workspaceLi.parentNode.removeChild(workspaceLi);
        showcaseEntry.parentNode.removeChild(showcaseEntry);

        if (previousDataJSON !== null) {
          const storedFavorites = JSON.parse(previousDataJSON);
          for (let x = 0; x < storedFavorites.length; x++) {
            if (storedFavorites[x].id === workspaceId) {
              storedFavorites[x] = data.workspace[0];
              const updatedFavoritesJSON = JSON.stringify(storedFavorites);
              localStorage.setItem('favorite', updatedFavoritesJSON);
              break;
            }
          }
        }
        return;
      }
    }
  }
});
