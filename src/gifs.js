require('dotenv').config();
const axios = require('axios');

async function getVideoGifs() {
  const response = await axios(process.env.GIFS, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'GET',
  });
  console.log('status', response.status);
  const gifs = response.data.gifs;

  function views(a, b) {
    if (a.views > b.views) return 1;
    if (a.views < b.views) return -1;
    return 0;
  }

  const urls = gifs
    .filter((g) => g.urls.sd)
    .sort(views)
    .map((g) => g.urls.sd);

  if (!urls) return null;

  console.log(urls.slice(0, 5));
  return urls.slice(0, 5);
}

module.exports = getVideoGifs;
