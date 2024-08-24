function runPandoraScript() {
  const proceed = confirm("Please make sure the page is scrolled to the top before proceeding.\n\nYou can refresh the page and then run the script again if needed. Click 'OK' to continue or 'Cancel' to stop.");

  if (!proceed) {
    console.log("Script execution stopped by the user.");
    return;
  }

  let totalThumbsUp = 0;
  let processedThumbsUp = 0;
  let progressEnabled = false;
  let scrollSpeed;
  const storageKey = "pandoraLikes";

  function initializeSettings() {
    localStorage.removeItem(storageKey);
    console.log("Existing data cleared. Starting fresh.");

    const speedChoice = prompt("Set your preferred scroll speed.\n\nNOTE: If your connection is too slow, FAST may error out.: SLOW (2s), NORMAL (.5s), FAST (0.15s)", "NORMAL").toUpperCase();
    
    switch(speedChoice) {
      case 'SLOW':
        scrollSpeed = 2000; // Slower scrolling (2 seconds)
        break;
      case 'FAST':
        scrollSpeed = 150; // Faster scrolling (0.15 seconds)
        break;
      case 'NORMAL':
      default:
        scrollSpeed = 500; // Normal scrolling (0.5 seconds)
        break;
    }

    console.log(`Scroll speed set to: ${speedChoice}`);
  }

  function getTotalThumbsUp() {
    try {
      const thumbsUpElement = document.querySelector('[data-qa="thumbs_up_link"] .ProfileNav__count');
      if (thumbsUpElement) {
        totalThumbsUp = parseInt(thumbsUpElement.innerText, 10);
        console.log(`Total Thumbs Up: ${totalThumbsUp}`);
        progressEnabled = true;
      } else {
        console.log("Total Thumbs Up element not found. Progress bar will be disabled.");
      }
    } catch (error) {
      console.error('Error retrieving total thumbs up:', error);
    }
  }

  function saveItemToLocalStorage(item) {
    try {
      const savedJson = localStorage.getItem(storageKey);
      const jsonData = savedJson ? JSON.parse(savedJson) : { stations: [] };

      let station = jsonData.stations.find(station => station.stationName === item.stationName);
      
      if (!station) {
        station = {
          stationName: item.stationName,
          likes: []
        };
        jsonData.stations.push(station);
      }
      
      station.likes.push(item);

      localStorage.setItem(storageKey, JSON.stringify(jsonData));
      updateLocalStorageItemCount();
    } catch (error) {
      console.error('Error saving item to localStorage:', error);
    }
  }

  function updateLocalStorageItemCount() {
    const savedJson = localStorage.getItem(storageKey);
    const jsonData = savedJson ? JSON.parse(savedJson) : { stations: [] };
    let itemCount = 0;

    jsonData.stations.forEach(station => {
      itemCount += station.likes.length;
    });

    console.log(`%cLocal Storage Item Count: ${itemCount} items`, "color: white; background-color: purple; padding: 2px;");
  }

  function loadProgress() {
    processedThumbsUp = 0;
  }

  function notInLocalStorage(pandoraTrackUri, stationName) {
    try {
      const savedJson = localStorage.getItem(storageKey);
      const jsonData = savedJson ? JSON.parse(savedJson) : { stations: [] };

      const station = jsonData.stations.find(station => station.stationName === stationName);
      if (!station) {
        return true;
      }

      return !station.likes.some((item) => item.pandoraTrackUri === pandoraTrackUri);
    } catch (error) {
      console.error('Error checking for duplicates in localStorage:', error);
      return false;
    }
  }

  function findAllLikedSongs() {
    const listItems = document.querySelectorAll(".UserProfile__ThumbUps__list__item");
    listItems.forEach((listItem) => {
      try {
        const pandoraTrackUri = "https://www.pandora.com" + listItem.querySelector('[data-qa="track_name_link"]').getAttribute("href");

        let stationName = listItem.querySelector('[data-qa="track_station_name_link"]').innerText;
        stationName = stationName.replace("Thumbed on ", "");

        if (notInLocalStorage(pandoraTrackUri, stationName)) {
          const albumCover = listItem.querySelector(".ImageLoader__cover")?.getAttribute("src").replace("_90W_90H", "_1080W_1080H");
          const songName = listItem.querySelector('[data-qa="track_name_link"]').innerText;
          const pandoraArtistUri = "https://www.pandora.com" + listItem.querySelector('[data-qa="track_artist_name_link"]').getAttribute("href");
          const artist = listItem.querySelector('[data-qa="track_artist_name_link"]').innerText;

          const jsonItem = {
            albumCover,
            pandoraTrackUri,
            songName,
            pandoraArtistUri,
            artist,
            stationName,
          };

          saveItemToLocalStorage(jsonItem);
          processedThumbsUp++;
          updateProgress();
        }
      } catch (error) {
        console.error('Error processing item:', error);
      }
    });

    if (processedThumbsUp >= totalThumbsUp) {
      console.log("All thumbs up have been processed.");
      updateProgress();
      console.log("Script execution completed.");
      return;
    }
  }

  function getLocalStorageSize() {
    const savedJson = localStorage.getItem(storageKey);
    const bytes = savedJson ? new Blob([savedJson]).size : 0;

    if (bytes < 1024) return `${bytes} bytes`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }

  function updateProgress() {
    if (progressEnabled) {
      const progress = Math.min((processedThumbsUp / totalThumbsUp) * 100, 100).toFixed(2);
      const localStorageSize = getLocalStorageSize();
      console.clear();
      console.log(`%cProgress: ${progress}% Completed (${processedThumbsUp}/${totalThumbsUp})`, "color: white; background-color: blue; padding: 2px;");
      console.log(`%cLocal Storage Size: ${localStorageSize}`, "color: white; background-color: green; padding: 2px;");
      updateLocalStorageItemCount();
    } else {
      console.clear();
      console.log(`%cProcessed ${processedThumbsUp} items.`, "color: white; background-color: blue; padding: 2px;");
    }
  }

  function saveJsonToFile() {
    try {
      const savedJson = localStorage.getItem(storageKey);
      if (savedJson) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(savedJson);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "pandora_thumbs_up_songs_grouped_by_station.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        console.log("JSON file has been saved to your downloads folder.");
      } else {
        console.log('No data found in localStorage');
      }
    } catch (error) {
      console.error('Error saving JSON file:', error);
    }
  }

  function scrollDown() {
    window.scrollBy(0, 100);
    scrollTimeout = setTimeout(checkScrollPosition, scrollSpeed);
  }

  function checkScrollPosition() {
    const listItems = document.querySelectorAll(".UserProfile__ThumbUps__list__item");

    if (listItems.length === 0 || processedThumbsUp >= totalThumbsUp) {
      clearTimeout(scrollTimeout);
      console.log("Collection complete.");
      updateProgress();
      saveJsonToFile();  // Only called here now, to prevent double saving
      console.log("Script execution completed.");
    } else {
      findAllLikedSongs();
      scrollDown();
    }
  }

  initializeSettings();
  getTotalThumbsUp();
  loadProgress();
  scrollDown();
}

runPandoraScript();
