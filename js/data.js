/* exported data */

let data = {
  view: 'search-form',
  showcase: [],
  workspace: [],
  nextPageId: 1,
};

window.addEventListener('beforeunload', function (event) {
  const dataJSON = JSON.stringify(data.showcase);

  localStorage.setItem('favorite', dataJSON);
});

const previousDataJSON = localStorage.getItem('favorite');

if (previousDataJSON !== null) {
  data.showcase = JSON.parse(previousDataJSON);
}
