async function windowActions () {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endpoint);

  const locations = await request.json();

  // eslint-disable-next-line no-shadow
  function findMatches(wordToMatch, locations) {
    return locations.filter((place) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return place.name.match(regex);
    });
  }

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, locations);
    const html = matchArray.map((place) => {
      const regex = new RegExp(this.value, 'gi');
      return `
                      <li>
                          <span class="name">${place.name}</span><br>
                          <span class="category">${place.category}</span><br>
                          <span class="address"><em>${place.address_line_1}</span><br>
                          <span class="city">${place.city}</span><br>
                          <span class="zip">${place.zip}</em></span>
                      </li>
                  `;
    }).join('');
    // eslint-disable-next-line no-use-before-define
    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => { displayMatches(evt); });
}

window.onload = windowActions;