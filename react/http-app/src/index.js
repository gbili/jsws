import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import config from './config.json'
import logger from './services/logService.js'

logger.init(config.logger);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
