const { authJwt } = require("../middleware");
const controller = require("../controllers/request.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // User routes
  app.post("/api/requests", [authJwt.verifyToken], controller.create);
  app.get("/api/user/requests", [authJwt.verifyToken], controller.findAllForUser);
  
  // Admin routes
  app.get("/api/requests", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
  app.put("/api/requests/:id/status", [authJwt.verifyToken, authJwt.isAdmin], controller.updateStatus);
};