//Node Modules import
const http = require("http");
const express = require("express");
const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({});
const path = require("path");
const _ = require("lodash");
const app = express();

//Garnet imports
const Infoset = require("./utils/infoset.js");
const API = require("./utils/api.js");
const config = require("./utils/configuration.js");
const router = require("./routes/routes.js");

app.use(require("morgan")("short"));

(function initWebpack() {
  const webpack = require("webpack");
  const webpackConfig = require("./webpack/common.config");

  const compiler = webpack(webpackConfig);

  app.use(
    require("webpack-dev-middleware")(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  );

  app.use(
    require("webpack-hot-middleware")(compiler, {
      log: console.log,
      path: "/__webpack_hmr",
      heartbeat: 10 * 1000
    })
  );

  app.use(express.static(path.join(__dirname, "/")));
})();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use(router);

const server = http.createServer(app);

server.listen(config.bind_port(), () => {
  console.log("Garnet started and listening on port " + server.address().port);
});
