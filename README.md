# pages.adobe.com landing pages

The pages project includes all the client-sided code (js/css) and configuration to run pages.adobe.com on [helix](https://github.com/adobe/helix-home).

## Public access

The public website is up and running on:

https://pages.adobe.com/

The "inner CDN" or helix origin is at:

https://main--pages--adobe.hlx3.page/


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

> Some scripts depend on ES modules, if you encounter errors when running them, update Node.js.


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

## Dev scripts

### Lint
```sh
npm run lint
```
> Note: Linting is also performed in a pre-commit hook

### Test
```sh
npm run test
```

### Compare
`./tools/run-compare.js` and `./tools/compare/` contain a script for comparing pages between the branch you're working on and the current "source-of-truth" branch/endpoint. The output is based on enabled plugins, any/all of:
1. screenshot
2. lighthouse

The pages compared come from `./tools/pagelist.js`, which may be more comparisons than needed for a change and should be edited according to the use case.

#### Compare all in pagelist
```sh
npm run compare
```

### Sync
Used for bulk pushing changes via Admin API.

#### Flags
`glob` - for selective matching files/directories (default `undefined`)
`env` - environment to use, any of: `"preview"`, `"publish"`, `"code"` (default `"preview"`)
`owner` - repo owner to use (default `"adobe"`)
`repo` - repo name to use (default `"pages"`)
`branch` - branch to use (default `"main"`)

#### Preview all content
With a locally mounted gdrive, you can bulk preview/publish content.
```sh
npm run sync -- "/Volumes/GoogleDrive/My Drive/pages"
```
> Note: Selective globs are preferred, this will take a long time and is unnecessary in most cases.

#### Publish a specific directory
```sh
npm run sync -- "/Volumes/GoogleDrive/My Drive/pages" --env=publish --glob="./my/content/dir/**/*"
```

#### Sync a block to codebus
```sh
npm run sync -- "/path/to/this/repo/pages" --env=code --glob="./pages/blocks/myblock/**/*"
```
