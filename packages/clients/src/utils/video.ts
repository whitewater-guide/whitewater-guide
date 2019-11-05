import get from 'lodash/get';
import parse from 'url-parse';

const RE_VIMEO = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)$/;
const RE_YOUTUBE = /^(?:\/embed)?\/([\w-]{10,12})$/;
// const RE_FACEBOOK = /^\/[\w-]+\/videos\/(\d+)\/?$|^\/watch\/\?v=(\d+)/;

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
  while (i < sizes.length - 1 && sizes[i].height < minHeight) {
    i++;
  }
  return sizes[i];
};

export const isFacebook = (url?: string | null) =>
  !!url &&
  ['facebook.com', 'www.facebook.com'].some((host) => url.includes(host));

export const getFacebookId = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }
  const { pathname, query } = parse(url, {}, true);
  const path = pathname.split('/').filter((i) => !!i);
  if (path[0] === 'watch' && !!query && !!query.v) {
    return query.v;
  }
  if (path[1] === 'videos' && !!path[2]) {
    return path[2];
  }
  return null;
};

const getFacebookThumb = (url?: string | null) => {
  const videoId = getFacebookId(url);
  if (!videoId) {
    return null;
  }
  return {
    thumb: `https://graph.facebook.com/${videoId}/picture`,
    width: 228,
    height: 128,
  };
};

export const isYoutube = (url?: string | null) =>
  !!url &&
  ['www.youtube.com', 'youtube.com', 'youtu.be'].some((host) =>
    url.includes(host),
  );

export const getYoutubeId = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }
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

const getYoutubeThumb = async (
  url: string | null,
  minHeight: number,
): Promise<VideoThumb | null> => {
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

export const isVimeo = (url?: string | null) =>
  !!url &&
  ['www.vimeo.com', 'vimeo.com', 'player.vimeo.com'].some((host) =>
    url.includes(host),
  );

export const getVimeoId = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }
  const { pathname } = parse(url, {}, true);
  const match = RE_VIMEO.exec(pathname);
  return match ? match[1] : null;
};

const getVimeoThumb = async (
  url: string,
  minHeight: number,
): Promise<VideoThumb | null> => {
  const videoId = getVimeoId(url);
  if (videoId) {
    const vimeoResponse = await fetch(
      `https://vimeo.com/api/v2/video/${videoId}.json`,
    );
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

// tslint:disable-next-line:no-inferrable-types
export const getVideoThumb = async (
  url?: string | null,
  minHeight: number = 32,
): Promise<VideoThumb | null> => {
  if (!url) {
    return null;
  }

  if (isYoutube(url)) {
    return getYoutubeThumb(url, minHeight);
  }

  if (isVimeo(url)) {
    return getVimeoThumb(url, minHeight);
  }

  if (isFacebook(url)) {
    return getFacebookThumb(url);
  }

  return null;
};
