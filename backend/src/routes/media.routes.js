const { authJwt } = require("../middleware");
const controller = require("../controllers/media.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Public routes
  app.get("/api/media", controller.findAll);
  app.get("/api/media/:id", controller.findOne);
  
  // Admin routes
  app.post("/api/media", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.put("/api/media/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
  app.delete("/api/media/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
};