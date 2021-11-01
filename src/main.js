require('dotenv').config();
const _ = require('lodash');
const axios = require('axios');
const { Telegraf } = require('telegraf');
const CHAT_ID = process.env.CHAT_ID;
const videoParams = process.env.VIDEO_PARAMS.split('|');
const picParams = process.env.PIC_PARAMS.split('|');

async function getVideo(sub = 'Awww', sort = 'top', t = 'day') {
  const url = `https://www.reddit.com/r/${sub}/${sort}.json?t=${t}&limit=10`;
  console.log(url);
  const response = await axios.get(url);
  console.log('STATUS', response.status);
  const gifs = response.data.data.children
    .filter(
      (d) =>
        d.data &&
        d.data.thumbnail &&
        (d.data.preview?.reddit_video_preview ||
          d.data.secure_media?.reddit_video)
    )
    .map((result) => {
      const url =
        result.data.preview?.reddit_video_preview?.fallback_url ||
        result.data.secure_media?.reddit_video?.fallback_url;
      return url;
    });
  console.log(gifs);
  return gifs;
}

async function getPic(sub = 'Awww', sort = 'top', t = 'day') {
  const url = `https://www.reddit.com/r/${sub}/${sort}.json?t=${t}&limit=10`;
  console.log(url);
  const response = await axios.get(url);
  console.log('STATUS', response.status);
  const pics = response.data.data.children
    .filter(
      (d) =>
        d.data &&
        d.data.is_video == false &&
        d.data.url &&
        (d.data.url.includes('.jpg') || d.data.url.includes('.png'))
    )
    .map((result) => {
      const url = result.data.url;
      return url;
    });
  console.log(pics);
  return pics;
}

async function getGif() {
  const url = `https://g.tenor.com/v1/search?key=${process.env.TENOR}&contentfilter=high&limit=1`;
  console.log('url', url);
  const response = await axios.get(url);
  console.log('STATUS', response.status);
  const gifs = response.data.results.map((result) => {
    return result.media[0].gif.url;
  });
  console.log(gifs);
  return gifs[0];
}

(async () => {
  const bot = new Telegraf(process.env.BOT_KEY);

  const gif = await getGif();
  await bot.telegram.sendAnimation(CHAT_ID, gif);

  const video = await getVideo(...videoParams);
  if (video?.length) {
    await bot.telegram.sendVideo(CHAT_ID, video[0]);
  }

  let pic = await getPic(...picParams);
  if (pic?.length) {
    let pic2 = null;
    let pic1 = pic[0];
    pic = _.without(pic, pic1);
    if (pic.length) {
      pic2 = pic[Math.floor(Math.random() * pic.length)];
    }

    if (pic1 && pic2) {
      const media = [pic1, pic2].map((img) => {
        return { type: 'photo', media: img };
      });
      bot.telegram.sendMediaGroup(CHAT_ID, media);
    } else if (pic1) {
      await bot.telegram.sendPhoto(CHAT_ID, pic);
    }
  }
})();
