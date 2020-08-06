const express = require('express');
const { Server } = require('ws');

const port = process.env.PORT || 3030;

const server = express()
.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})
.listen(port, () => {
  console.log('it\'s alive');
});
const wss = new Server({ server });

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