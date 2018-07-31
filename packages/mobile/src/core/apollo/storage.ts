import FSStorage, { CacheDir } from 'redux-persist-fs-storage';

// This will create `whitewater` folder in cache storage for iOS and Android devices
export const storage = new FSStorage(CacheDir, 'whitewater');
