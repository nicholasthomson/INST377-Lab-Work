function mapInit() {
  const mymap = L.map('mapid').setView([38.9897, -76.937759], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGhlY2hhaXJtYW4yIiwiYSI6ImNrdXJnaXh2cTU0bDMycXE2cWNucm9hNzYifQ.0MuNWq4gmHNWteamsYaPcw'
  }).addTo(mymap);
  return mymap;
}

async function dataHandler(mapObject) {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endpoint);

  const locations = await request.json();

  const suggestions = document.querySelector('.suggestions');
  const input = document.querySelector('input');

  // eslint-disable-next-line no-shadow
  function findMatches(wordToMatch, locations) {
    return locations.filter((place) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return place.zip.match(regex);
    });
  }

  function clearMarkers(mymap) {
    mymap.eachLayer((layer) => {
      mymap.removeLayer(layer);
    });
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoidGhlY2hhaXJtYW4yIiwiYSI6ImNrdXJnaXh2cTU0bDMycXE2cWNucm9hNzYifQ.0MuNWq4gmHNWteamsYaPcw'
    }).addTo(mymap);
    mymap.setView([38.9897, -76.937759], 13);
  }

  function applyMarkers(mymap, testArray) {
    clearMarkers(mymap);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoidGhlY2hhaXJtYW4yIiwiYSI6ImNrdXJnaXh2cTU0bDMycXE2cWNucm9hNzYifQ.0MuNWq4gmHNWteamsYaPcw'
    }).addTo(mymap);
    mymap.setView([testArray[0].geocoded_column_1.coordinates[1],
      testArray[0].geocoded_column_1.coordinates[0]], 13);
    L.marker([testArray[0].geocoded_column_1.coordinates[1],
      testArray[0].geocoded_column_1.coordinates[0]]).addTo(mymap);
    L.marker([testArray[1].geocoded_column_1.coordinates[1],
      testArray[1].geocoded_column_1.coordinates[0]]).addTo(mymap);
    L.marker([testArray[2].geocoded_column_1.coordinates[1],
      testArray[2].geocoded_column_1.coordinates[0]]).addTo(mymap);
    L.marker([testArray[3].geocoded_column_1.coordinates[1],
      testArray[3].geocoded_column_1.coordinates[0]]).addTo(mymap);
    L.marker([testArray[4].geocoded_column_1.coordinates[1],
      testArray[4].geocoded_column_1.coordinates[0]]).addTo(mymap);
    console.log(testArray);
  }

  function displayMatches(event) {
    // I kept checking for empty values even tho <5 covers it because its in the lab requirements
    if (event.target.value === '' || event.target.value.length < 5) {
      suggestions.innerHTML = [];
      clearMarkers(mapObject);
    } if (event.target.value.length === 5) {
      const matchArray = findMatches(event.target.value, locations);
      let testArray = matchArray.filter((obj) => Object.keys(obj).includes('geocoded_column_1'));
      testArray = testArray.slice(0, 5);
      const html = testArray.map((place) => `          
                    <li>
                    <div class="box">                        
                          <span class="name"><strong>${place.name}</strong></span><br>
                          <span class="address"><em>${place.address_line_1}</em></span><br>
                          </div>
                    </li>
                `).join('');

      suggestions.innerHTML = html;
      applyMarkers(mapObject, testArray);
    } else {
      console.log('Waiting for valid Zip Code');
    }
  }

  input.addEventListener('input', (evt) => { displayMatches(evt); });
}

async function windowActions() {
  const mymap = mapInit();
  await dataHandler(mymap);
}

window.onload = windowActions;