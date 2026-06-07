import { VideoEncoder } from './types';
import { ApngEncoder } from './ApngEncoder';
import { GifEncoder } from './GifEncoder';
import { MediaBunnyEncoder } from './MediaBunnyEncoder';

export const createEncoder = (formatId: string): VideoEncoder => {
  switch (formatId) {
    case 'apng':
      return new ApngEncoder();
    case 'gif':
      return new GifEncoder();
    default:
      return new MediaBunnyEncoder();
  }
};
