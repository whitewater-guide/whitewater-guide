import { get } from 'lodash';
import parse from 'url-parse';

const RE_VIMEO = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)$/;
const RE_YOUTUBE = /^(?:\/embed)?\/([\w-]{10,12})$/;
const RE_FACEBOOK = /^\/[\w-]+\/videos\/(\d+)(\/)?$/;

interface ThumbSize {
  name: string;
  width: number;
  height: number;
}

const YOUTUBE_SIZES: ThumbSize[] = [
  { name: 'default', width: 120, height: 90 },
  { name: 'mqdefault', width: 320, height: 180 },
  { name: 'hqdefault', width: 480, height: 360 },
];
const VIMEO_SIZES: ThumbSize[] = [
  { name: 'thumbnail_small', width: 100, height: 75 },
  { name: 'thumbnail_medium', width: 200, height: 150 },
  { name: 'thumbnail_large', width: 640, height: 360 },
];

export interface VideoThumb {
  thumb: string;
  width: number;
  height: number;
}

const getThumbSize = (minHeight: number, sizes: ThumbSize[]) => {
  let i = 0;
  while (i < (sizes.length - 1) && sizes[i].height < minHeight) {
    i++;
  }
  return sizes[i];
};

export const isYoutube = (url: string) =>
  ['www.youtube.com', 'youtube.com', 'youtu.be'].some(host => url.includes(host));

export const getYoutubeId = (url: string): string | null => {
  const { query, pathname } = parse(url, {}, true);
  const { v } = query;
  if (v && v.match(/^[\w-]{10,12}$/)) {
    return v;
  } else {
    const match = RE_YOUTUBE.exec(pathname);
    if (match) {
      return match[1];
    }
  }
  return null;
};

const getYoutubeThumb = async (url: string, minHeight: number): Promise<VideoThumb | null> => {
  const videoId = getYoutubeId(url);

  if (videoId) {
    const { name, width, height } = getThumbSize(minHeight, YOUTUBE_SIZES);
    return Promise.resolve({
      thumb: `http://img.youtube.com/vi/${videoId}/${name}.jpg`,
      width,
      height,
    });
  }

  return Promise.resolve(null);
};

export const isVimeo = (url: string) =>
  ['www.vimeo.com', 'vimeo.com', 'player.vimeo.com'].some(host => url.includes(host));

export const getVimeoId = (url: string): string | null => {
  const { pathname } = parse(url, {}, true);
  const match = RE_VIMEO.exec(pathname);
  return match ? match[1] : null;
};

const getVimeoThumb = async (url: string, minHeight: number): Promise<VideoThumb | null> => {
  const videoId = getVimeoId(url);
  if (videoId) {
    const vimeoResponse = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
    const vimeoJson = await vimeoResponse.json();
    const { name, width, height } = getThumbSize(minHeight, VIMEO_SIZES);
    return {
      thumb: get(vimeoJson, `0.${name}`, null),
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
export const getVideoThumb = async (url: string, minHeight: number = 32): Promise<VideoThumb | null> => {
  if (!url) {
    return null;
  }

  if (isYoutube(url)) {
    return getYoutubeThumb(url, minHeight);
  }

  if (isVimeo(url)) {
    return getVimeoThumb(url, minHeight);
  }

  // if (['facebook.com', 'www.facebook.com'].indexOf(host) !== -1) {
  //   return getFacebookThumb(pathname, size);
  // }

  return null;
};
