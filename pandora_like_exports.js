let lastScrollPosition = 0;
// Initialize an array to store the JSON objects

const jsonCollection = [];

// Set an interval for scrolling (adjust the interval duration as needed)
const scrollInterval = setInterval(scrollDown, 100); // Scroll every 100 milliseconds

function scrollDown() {
  // Scroll down by a certain amount in each iteration
  window.scrollBy(0, 100);

  // Check if the scroll position has changed
  if (window.scrollY === lastScrollPosition) {
    // Stop scrolling when the scroll position doesn't change (assuming no more content is being loaded)
    // The resulting jsonCollection array now contains JSON objects for each iteration
    clearInterval(scrollInterval);

    console.log("Here is your collection of liked songs in JSON format");

    console.log(jsonCollection);

    return;
  }

  findAllLikedSongs();

  // Update the last scroll position
  lastScrollPosition = window.scrollY;
}

function findAllLikedSongs() {
  // Now, you can run the script to extract information from the elements
  const listItems = document.querySelectorAll(
    ".UserProfile__ThumbUps__list__item"
  );

  // Loop through each iteration
  listItems.forEach((listItem) => {
    // Extract information from the current iteration
    const pandoraTrackUri =
      "https://www.pandora.com" +
      listItem
        .querySelector('[data-qa="track_name_link"]')
        .getAttribute("href");

    if (notInJsonCollection(pandoraTrackUri)) {
      const albumCover = listItem
        .querySelector(".ImageLoader__cover")
        ?.getAttribute("src")
        .replace("_90W_90H", "_1080W_1080H");
      const songName = listItem.querySelector(
        '[data-qa="track_name_link"]'
      ).innerText;
      const pandoraArtistUri =
        "https://www.pandora.com" +
        listItem
          .querySelector('[data-qa="track_artist_name_link"]')
          .getAttribute("href");
      const artist = listItem.querySelector(
        '[data-qa="track_artist_name_link"]'
      ).innerText;
      let stationName = listItem.querySelector(
        '[data-qa="track_station_name_link"]'
      ).innerText;

      // Remove "Thumbed on " if it exists in stationName
      stationName = stationName.replace("Thumbed on ", "");

      // Create a JSON object and push it to the collection
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

// Function to deduplicate the array based on a specific property (e.g., "id")
function notInJsonCollection(pandoraTrackUri) {
  return !jsonCollection.some(
    (item) => item["pandoraTrackUri"] === pandoraTrackUri
  );
}
