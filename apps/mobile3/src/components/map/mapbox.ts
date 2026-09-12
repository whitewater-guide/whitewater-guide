import Mapbox from '@rnmapbox/maps';

void Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');
