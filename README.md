#Hapnhen
Hapnhen is an event-based, user-generated social networking application.

  Post your own events!
  
  or
  
  Find events near you!
  
Whatever you do, don't stay cooped up inside, find out what's *hapnhen!*

## **Installation**:

**1. Download Node.js**

If you have homebrew, you can simply type `brew install node` into a terminal prompt.
If you don't have homebrew, go [here](https://nodejs.org/en/download/) and pick the appropriate pre-built install for your machine.

**2. Download the hapnhen directory.**

Click on the button "Download Zip" at the top right of the hapnhen github directory.

**3. Unzip the directory.**

Find the hapnhen folder you just downloaded and unzip it. On macs this should simply mean clicking on the zipped file.

**4. Move into the Hapnhen directory.**

Open up a terminal prompt and change directories into the hapnhen directory you just downloaded.
To change directories, type `cd </path/to/file>` where "\</path/to/file\>" is replaced by the actual path to the hapnhen directory on your machine.

**5. Install dependencies.**
Once in the hapnhen directory type `npm install` into a terminal prompt to install the dependencies for the project.
There will be a few harmless warnings, which you may ignore.

**6. Run a local server.**

While still in the hapnhen directory, type `node index` into the terminal.
It will ask you for your database username and password.
You should see a line that says "Server Started" after a second or too.
Congrats! Your local server is up and running!

**7. Visit the webpage.**

Open up your favorite browser and type `127.0.0.1:3000` into the address bar and the webpage should appear.

##**Making changes**:

To make changes, open up a text editor and open up the relevant file.

  **For Content:** Open the **mapPage.html** file found in the pages folder of the hapnhen directory.
  
  **For Style:** Open the **mapPage.css** file in the css folder, same directory.
  
  **For function:** Open up the **map.js** or **createEvent.js** file in the js folder.

If you don't know what text editor to use try [this](http://www.sublimetext.com/2).
