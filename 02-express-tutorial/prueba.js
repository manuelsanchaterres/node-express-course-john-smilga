const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {

    const directoryPath = path.join(__dirname, 'navbar-app');

    fs.readdir(directoryPath, (err, files) => {

        let filestoServe = []
        let fileInfo = {}
        let counter = 0
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach((file) => {

            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stats) => {

                if (err) {

                    if (err.code === 'ENOENT') {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('File Not Found');
                    } else {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    }

                } else {


                    if (stats.isFile()) {
                        // Read the file and serve its contents
                        fs.readFile(filePath, 'utf8', (err, data) => {

                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Internal Server Error');
                            } else {
                                // Determine the appropriate content type based on the file extension
                                const ext = path.extname(filePath);

                                let contentType = 'text/plain';
                                if (ext === '.html') {
                                contentType = 'text/html';
                                } else if (ext === '.css') {
                                contentType = 'text/css';
                                } else if (ext === '.js') {
                                contentType = 'text/javascript';
                                } else if (ext === '.svg') {
                                    contentType = 'image/svg+xml';
                                } else {

                                    contentType = 'text/plain'
                                }

                                fileInfo = {...fileInfo, contentType, data}


                                filestoServe = [...filestoServe, fileInfo]

                                counter++

                                if (counter === files.length ) {

                                    filestoServe.map((item) => {
    
                                        const {contentType, data} = item


                                        res.writeHead(200, { 'content-type': `${contentType}` })
                                        res.write(data)
                                    })

                                    res.end()

    
                                }


                                // Set the appropriate headers and send the file data
                                // res.writeHead(200, { 'Content-Type': contentType });

                                // res.end(data);

                            }

                        });
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('File Not Found');
                    }


                }

            });
            
        });

        console.log('line 87',filestoServe);


    });


});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
