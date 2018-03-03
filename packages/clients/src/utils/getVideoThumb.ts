import { get } from 'lodash';
import parse from 'url-parse';

const RE_VIMEO = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)$/;
const RE_YOUTUBE = /^(?:\/embed)?\/([\w-]{10,12})$/;
const RE_FACEBOOK = /^\/[\w-]+\/videos\/(\d+)(\/)?$/;

const YOUTUBE_SIZES = ['default', 'mqdefault', 'hqdefault'];
const VIMEO_SIZES = ['thumbnail_small', 'thumbnail_medium', 'thumbnail_large'];

interface YoutubeQuery {
  v: string;
  [other: string]: any;
}

const getYoutubeThumb = async (host: string, query: YoutubeQuery, pathname: string, size: number) => {
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
    return `http://img.youtube.com/vi/${videoId}/${YOUTUBE_SIZES[size]}.jpg`;
  }

  return null;
};

const getVimeoThumb = async (pathname: string, size: number) => {
  const match = RE_VIMEO.exec(pathname);
  if (match) {
    const videoId = match[1];
    const vimeoResponse = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
    const vimeoJson = await vimeoResponse.json();
    return get(vimeoJson, `0.${VIMEO_SIZES[size]}`, null);
  }
  return null;
};

const getFacebookThumb = async (pathname: string, size: number) => {
  const match = RE_FACEBOOK.exec(pathname);
  if (match) {
    const videoId = match[1];
    const fbResponse = await fetch(`https://graph.facebook.com/${videoId}?fields=format`);
    const fbJson = await fbResponse.json();
    return get(fbJson, `format.${size}.picture`, null);
  }
  return null;
};

// tslint:disable-next-line:no-inferrable-types
export default async function getVideoThumb(url: string, size: number = 0) {
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

  if (['facebook.com', 'www.facebook.com'].indexOf(host) !== -1) {
    return getFacebookThumb(pathname, size);
  }

  return null;
}
