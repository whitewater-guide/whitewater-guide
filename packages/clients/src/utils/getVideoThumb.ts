import { get } from 'lodash';
import parse from 'url-parse';

const RE_VIMEO = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)$/;
const RE_YOUTUBE = /^(?:\/embed)?\/([\w-]{10,12})$/;
const RE_FACEBOOK = /^\/[\w-]+\/videos\/(\d+)(\/)?$/;

const YOUTUBE_SIZES = [
  { name: 'default', width: 120, height: 90 },
  { name: 'mqdefault', width: 320, height: 180 },
  { name: 'hqdefault', width: 480, height: 360 },
];
const VIMEO_SIZES = [
  { name: 'thumbnail_small', width: 100, height: 75 },
  { name: 'thumbnail_medium', width: 200, height: 150 },
  { name: 'thumbnail_large', width: 640, height: 360 },
];

export interface VideoThumb {
  url: string;
  width: number;
  height: number;
}

interface YoutubeQuery {
  v: string;
  [other: string]: any;
}

const getYoutubeThumb =
  async (host: string, query: YoutubeQuery, pathname: string, size: number): Promise<VideoThumb | null> => {
    let videoId = null;
    const { v } = query;
    if (v && v.match(/^[\w-]{10,12}$/)) {
      videoId = v;
    } else {
      const match = RE_YOUTUBE.exec(pathname);
      if (match) {
        videoId = match[1];
      }
    }

    if (videoId) {
      const { name, width, height } = YOUTUBE_SIZES[size];
      return Promise.resolve({
        url: `http://img.youtube.com/vi/${videoId}/${name}.jpg`,
        width,
        height,
      });
    }

    return Promise.resolve(null);
  };

const getVimeoThumb = async (pathname: string, size: number): Promise<VideoThumb | null> => {
  const match = RE_VIMEO.exec(pathname);
  if (match) {
    const videoId = match[1];
    const vimeoResponse = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
    const vimeoJson = await vimeoResponse.json();
    const { name, width, height } = VIMEO_SIZES[size];
    return {
      url: get(vimeoJson, `0.${name}`, null),
      width,
      height,
    };
  }
  return Promise.resolve(null);
};

// const getFacebookThumb = async (pathname: string, size: number) => {
//   // TODO: this doesn't work anymore
//   // Call needs to be made from backend using app_id and secret
//   const match = RE_FACEBOOK.exec(pathname);
//   if (match) {
//     const videoId = match[1];
//     const fbResponse = await fetch(`https://graph.facebook.com/${videoId}?fields=format`);
//     const fbJson = await fbResponse.json();
//     return get(fbJson, `format.${size}.picture`, null);
//   }
//   return null;
// };

// tslint:disable-next-line:no-inferrable-types
export default async function getVideoThumb(url: string, size: number = 0): Promise<VideoThumb | null> {
  if (!url) {
    return null;
  }

  const { host, query, pathname } = parse(url, true);

  if (['www.youtube.com', 'youtube.com', 'youtu.be'].indexOf(host) !== -1) {
    return getYoutubeThumb(host, query, pathname, size);
  }

  if (['www.vimeo.com', 'vimeo.com', 'player.vimeo.com'].indexOf(host) !== -1) {
    return getVimeoThumb(pathname, size);
  }

  // if (['facebook.com', 'www.facebook.com'].indexOf(host) !== -1) {
  //   return getFacebookThumb(pathname, size);
  // }

  return null;
}
