var express = require('express');
var cors = require('cors');
const fs = require('fs');
const busboy = require('busboy');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', function (req, res) {
  let fileName, fileType, fileSize;
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      fileName = filename;
      fileType = mimeType;
      file.on('data', (data) => {
        fileSize = data.length;
      }).on('close', () => {
        console.log(`File [${name}] done`);
      });
    });
  
    bb.on('close', () => {
      res.json({ name: fileName, type: fileType, size: fileSize });
    });
    req.pipe(bb);
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
