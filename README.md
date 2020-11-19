# pages.adobe.com landing pages

The pages project includes all the client-sided code (js/css) and configuration to run pages.adobe.com on [helix](https://github.com/adobe/helix-home).

## Public access

The public website is up and running on:

https://pages.adobe.com/

The "inner CDN" or helix origin is at:

https://pages-adobe.hlx.page/


## Develop with Helix locally

### Get/update NPM & Node
First ensure that you have a somewhat recent version of NPM and Node.  

Check your NPM version:  
`npm -v`  

Check your Node version:  
`node -v`  

If you can't run these commands, [install NPM and Node](https://www.npmjs.com/get-npm).  

If you need to update your existing NPM:  
`npm install -g npm@latest`  

If you need to update your existing version of Node, [use NVM](https://github.com/nvm-sh/nvm):
`nvm install node`  

If you don't have NVM, [install it with these instructions](https://github.com/nvm-sh/nvm#installing-and-updating).


### Install helix-cli
Use your fresh NPM to install the Helix client.
`npm install -g @adobe/helix-cli` or `sudo npm install -g @adobe/helix-cli` (if you get permission errors.)

### Clone this repository
`git clone https://github.com/adobe/pages`

### Start up the local server
Switch into the `/pages` directory of the repository:  
`cd pages`  
Run the command to start up Helix:  
`hlx up`  

This should automatically open `http://localhost:3000/` in your browser. Changes to your local Github repo will show up there.
