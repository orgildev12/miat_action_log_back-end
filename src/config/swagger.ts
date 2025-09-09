import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'MIAT Action Log API',
    version: '0.5.0',
    description: 'API documentation for MIAT Action Log back-end',
  },
  servers: [
    {
      url: 'http://localhost:{port}',
      description: 'Local server',
      variables: {
        port: {
          default: '3000',
        },
      },
    },
  ],
} as const;

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: swaggerDefinition as any,
  // Scan route files and controllers for @openapi JSDoc comments
  apis: [
    './src/routes/**/*.ts',
    './src/controllers/**/*.ts',
  './src/docs/**/*.{ts,yaml,yml}',
  './dist/src/routes/**/*.js',
  './dist/src/controllers/**/*.js',
  ],
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);
