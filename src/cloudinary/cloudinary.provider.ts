import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'dgcrbtaw5',
      api_key: '672834373364364',
      api_secret: 'xg9Ol2zsuW_GbO23knLIcVVn5P4',
    });
  },
};
