const session = require("express-session");
const MongoStore = require("connect-mongo");

// basic session configuration
// the NODE_ENV comes default with node, you dont need to add it in the .env

function sessionConfig(app) {
  const { NODE_ENV, MONGODB_URI, SESSION_SECRET } = process.env;
  const isProduction = NODE_ENV === "production";
  const sameSite = isProduction ? "none" : "lax";
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
        sameSite,
        secure: isProduction,
      },
    })
  );
}

module.exports = sessionConfig;


// const session = require("express-session");
// const MongoStore = require("connect-mongo");

// function sessionConfig(app) {
//   const { NODE_ENV, MONGODB_URI, SESSION_SECRET } = process.env;
//   app.set("trust proxy", 1);
//   app.use(
//     session({
//       secret: SESSION_SECRET,
//       resave: false,
//       saveUninitialized: true,
//       store: MongoStore.create({
//         mongoUrl: MONGODB_URI,
//       }),
//       cookie: {
//         maxAge: 1000 * 60 * 60 * 24 * 365,
//         sameSite: false,
//         secure: NODE_ENV === "production",
//       },
//     })
//   );
// }

// module.exports = sessionConfig;