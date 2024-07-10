let lastScrollPosition = 0;
const jsonCollection = [];

// Use a debounced scroll event listener
let scrollTimeout;

function scrollDown() {
  window.scrollBy(0, 100);
  scrollTimeout = setTimeout(checkScrollPosition, 200); // Adjust debounce interval as needed
}

function checkScrollPosition() {
  if (window.scrollY === lastScrollPosition) {
    clearTimeout(scrollTimeout);
    console.log("Here is your collection of liked songs in JSON format");
    console.log(JSON.stringify(jsonCollection, null, 2));
  } else {
    lastScrollPosition = window.scrollY;
    findAllLikedSongs();
    scrollDown();
  }
}

// Batch processing function
function findAllLikedSongs() {
  const listItems = document.querySelectorAll(".UserProfile__ThumbUps__list__item");
  listItems.forEach((listItem) => {
    const pandoraTrackUri = "https://www.pandora.com" + listItem.querySelector('[data-qa="track_name_link"]').getAttribute("href");

    if (notInJsonCollection(pandoraTrackUri)) {
      const albumCover = listItem.querySelector(".ImageLoader__cover")?.getAttribute("src").replace("_90W_90H", "_1080W_1080H");
      const songName = listItem.querySelector('[data-qa="track_name_link"]').innerText;
      const pandoraArtistUri = "https://www.pandora.com" + listItem.querySelector('[data-qa="track_artist_name_link"]').getAttribute("href");
      const artist = listItem.querySelector('[data-qa="track_artist_name_link"]').innerText;
      let stationName = listItem.querySelector('[data-qa="track_station_name_link"]').innerText;

      stationName = stationName.replace("Thumbed on ", "");

      const jsonItem = {
        albumCover,
        pandoraTrackUri,
        songName,
        pandoraArtistUri,
        artist,
        stationName,
      };

      jsonCollection.push(jsonItem);
      console.log(jsonCollection.length);
    }
  });
}

function notInJsonCollection(pandoraTrackUri) {
  return !jsonCollection.some((item) => item["pandoraTrackUri"] === pandoraTrackUri);
}

// Initial call to start the scrolling process
scrollDown();
