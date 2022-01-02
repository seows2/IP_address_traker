import { Express } from 'express';
import expressLoader from './express';

export default async (app: Express) => {
  expressLoader(app);
  console.info(`Express Loaded`);

  // [TODO]: connect Database, entity
};
