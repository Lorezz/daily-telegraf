require('dotenv').config();
const axios = require('axios');

(async function main() {
  // const url = `https://g.tenor.com/v1/search?key=${process.env.TENOR}&contentfilter=high&limit=1`;
  const term = encodeURIComponent('wtf');
  const url = `https://g.tenor.com/v1/random?key=${process.env.TENOR}&q=${term}&limit=1&media_filter=minimal&contentfilter=high`;
  console.log('url', url);
  const response = await axios.get(url);
  console.log('STATUS', response.status);
  const gifs = response.data.results.map((result) => {
    return result.media[0].tinygif.url;
  });
  console.log(gifs);
})();
