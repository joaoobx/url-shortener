import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import { createConnection } from 'typeorm';
import routes from './Routes';
import AppError from './Errors/AppError';
import params from './ormconfig';
import '@src/Container';

const start = async () => {
  await createConnection(params);

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);
  app.use(errors());

  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: Error, request: Request, response: Response, _: NextFunction) => {
      if (err instanceof AppError) {
        return response
          .status(err.statusCode)
          .json({ status: 'error', message: err.message });
      }

      return response.status(500).json({ status: 'error', err });
    }
  );

  app.listen(process.env.API_PORT || 3000, () => {
    console.log(`🚀 Server started on port ${process.env.API_PORT || 3000}`);
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
