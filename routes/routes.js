// load up our shiny new route for users
const buttonRoutes = require('./buttons.js');

const appRouter = (app, fs) => {
  // we've added in a default route here that handles empty routes
  // at the base API url
  app.get('/', (req, res) => {
    res.send('API Server');
  });

  // run our user route module here to complete the wire up
  buttonRoutes(app, fs);
};

module.exports = appRouter;