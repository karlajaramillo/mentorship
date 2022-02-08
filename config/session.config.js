const session = require("express-session");
const MongoStore = require("connect-mongo");

function sessionConfig(app) {
  const { NODE_ENV, MONGODB_URI, SESSION_SECRET } = process.env;
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: MONGODB_URI,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        sameSite: false,
        secure: NODE_ENV === "production",
      },
    })
  );
}

module.exports = sessionConfig;
