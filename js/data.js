/* exported data */

let data = {
  view: 'search-form',
  matches: [],
  editing: null,
  nextPageId: 1,
};

// window.addEventListener('beforeunload', function (event) {
//   const dataJSON = JSON.stringify(data);

//   localStorage.setItem('journal-entry', dataJSON);
// });

// const previousDataJSON = localStorage.getItem('journal-entry');

// if (previousDataJSON !== null) {
//   data = JSON.parse(previousDataJSON);
// }
