/* eslint-disable import/first */
require('dotenv').config();

import express from 'express';

(async () => {
  const app = express();

  app.get('/', (_, res) => {
    res.status(200).send('Hello, World!');
  });

  const port = process.env.PORT;

  app.listen(port, () => {
    console.log(
      `Server started at ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`,
    );
  });
})();
