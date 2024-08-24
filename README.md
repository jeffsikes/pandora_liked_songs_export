# Exporting your Pandora Music Thumbs Up Collection

Pandora Music currently has no way to export your personal music preferences. There is an API, but it's currently not open to developers for use.

To get around these limitations, I created a website scraper to pull your liked (thumbed up) music into a JSON object that can be saved to you local filesystem.

The results will be categorized by station name.

## Working as of 08/24/2024
If Pandora changes just the slightest thing about their HTML class structure, this script will break. There are other similar scripts around that no longer work because of similar HTML structure changes.

## Step 1 - Open Pandora in a desktop web browser
I used Firefox and it worked well. Here's the URL you're looking for (you must be logged into Pandora).

[https://www.pandora.com/profile/thumbs/{yourUsername}](https://www.pandora.com/profile/thumbs/{yourUsername})

You can also find this by clicking your profile icon in the upper right of your screen, then choose "My Profile", then "Thumbs Up" from the left hand menu navigation.

Your screen should look similar to this:

![image](https://github.com/jeffsikes/pandora_export/assets/6627582/d0fb64b6-f9c6-48b6-9425-a6b29d1f81ec)

## Step 3 - Open Developer Tools Console
In Firefox, this is the wrench icon in your browser. It may not be a visible icon. If you're new to developer tools, you can [start exploring them here](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools).

Once opened, you're going to want the "Console" tab.

## Step 4 - Copy and paste the script into the Console tab.
Copy the script in full and paste it into the console tab. Then click Run.

A prompt will appear, remding you to be at the top of the page before running the script.

A second prompt will ask you at what speed you'd like to run the script. Type the word "FAST" or "SLOW", or just leave it at "NORMAL".

* NORMAL is selected by default
* If you have a fast connection and Pandora is playing nice, choose FAST if you're feeling lucky! 
* If you're having difficulties with the script stopping before your full list is completed, try setting it to SLOW instead.

This will take awhile to run. You should see a counter in the console counting up as it adds the new records to the array.

## Step 5 - Find the downloaded file.
You should see some text that states "JSON file has been saved to your downloads folder.".
A new file should be found in your downlaods folder titled "liked_songs_grouped_by_station.json"

You now have a file that contains the name, artist, channel and pandora links to all your thumbed up content, grouped by station. 

Have fun!
