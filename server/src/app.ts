import express from 'express';
import loadApp from './loaders';

const createApp = async () => {
  const app = express();

  await loadApp(app);

  return app;
};

export default createApp;
