import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from '@/config';
import routes from '@/api';
import ErrorResponse from '@/util/errorResponse';
import errorHandler from '@/api/middlewares/error';
import * as error from '@/constants/error';

export default (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  app.use(config.api.prefix, routes());

  app.all('*', (_req, _res, next) => {
    next(new ErrorResponse(error.ERROR_NOT_FOUND));
  });
  app.use(errorHandler);

  return app;
};
