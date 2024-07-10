let lastScrollPosition = 0;
const jsonCollection = [];
let totalThumbsUp = 0;
let processedThumbsUp = 0;
let progressEnabled = false;

// Retrieve the total number of thumbs up if it exists
function getTotalThumbsUp() {
  const thumbsUpElement = document.querySelector('[data-qa="thumbs_up_link"] .ProfileNav__count');
  if (thumbsUpElement) {
    totalThumbsUp = parseInt(thumbsUpElement.innerText, 10);
    console.log(`Total Thumbs Up: ${totalThumbsUp}`);
    progressEnabled = true;
  } else {
    console.log("Total Thumbs Up element not found. Progress bar will be disabled.");
  }
}

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
      processedThumbsUp++;
      updateProgress();
    }
  });
}

function notInJsonCollection(pandoraTrackUri) {
  return !jsonCollection.some((item) => item["pandoraTrackUri"] === pandoraTrackUri);
}

// Update the progress in the console
function updateProgress() {
  if (progressEnabled) {
    const progress = Math.min((processedThumbsUp / totalThumbsUp) * 100, 100).toFixed(2);
    console.clear();
    console.log(`%cProgress: ${progress}% Completed (${processedThumbsUp}/${totalThumbsUp})`, "color: white; background-color: blue; padding: 2px;");
  } else {
    console.clear();
    console.log(`%cProcessed ${processedThumbsUp} items.`, "color: white; background-color: blue; padding: 2px;");
  }
}

// Initial call to get the total number of thumbs up and start the scrolling process
getTotalThumbsUp();
scrollDown();
