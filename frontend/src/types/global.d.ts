import { MongooseCache } from 'mongoose';

declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}
