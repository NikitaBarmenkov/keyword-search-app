const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = process.env.PORT || 3030;

const app = express()
.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const server = http.Server(app);
const wss = new WebSocket.Server({server});

const vk = require('./vk');
const reddit = require('./reddit');

wss.on('connection', ws => {
  ws.on('message', async function incoming(data) {
    await GetData(JSON.parse(data), ws);
  });
});

async function GetData(data, ws) {
    switch (data.radio) {
      case 'vk':
        await vk.GetData(ws, data.keyword, data.excluded_words);
        vk.GetRealTime(ws, data.keyword, data.excluded_words);
        break;
      case 'reddit':
        await reddit.GetData(ws, data.keyword, data.excluded_words);
        reddit.GetRealTime(ws, data.keyword, data.excluded_words);
        break;
    }
}

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
