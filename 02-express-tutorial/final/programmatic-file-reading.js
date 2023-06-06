const http = require('http');
const  { readdir, readFile } = require ('node:fs/promises');
const path = require('path');

const { readDirectoryServeContentFiles } = require('./utils/functions');

const server = http.createServer((req, res) => {

    // on this array you can insert all directories path you need to read files from

    let routePaths= ['./navbar-app'];

    for ( let i = 0; i < routePaths.length; i++ ){

        // this function reads directory files and writes on server response to serve them

        readDirectoryServeContentFiles(routePaths[i], readdir, readFile, path, req, res)

    }


});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
