# Running Helix locally

## Get/update NPM & Node
First ensure that you have installed the latest version of NPM and the latest version of Node.  

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


## Install helix-cli
Use your fresh NPM to install the Helix client.  
`npm install -g @adobe/helix-cli`

## Clone this repository
`git clone https://github.com/adobe/pages`

## Start up the local server
Switch into the `/pages` directory of the repository:  
`cd pages`  
Run the command to start up Helix:  
`hlx up`  

This should automatically open `http://localhost:3000/` in your browser. Changes to your local Github repo will show up there.
