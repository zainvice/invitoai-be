const cors = require('cors');
const express = require('express');

const configureServer = (app) => {

  const allowedOrigins = ['http://localhost:3000', 'https://example.com'];

  const corsOptions = {
    origin: (origin, callback) => {

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, 
  };


  app.use(cors(corsOptions));


  app.use(express.json());


  console.log('✅ Server Configured with CORS!');
};

module.exports = configureServer;
