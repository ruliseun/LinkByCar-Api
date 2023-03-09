import setupServer from "./app/server.js";
import path from "path";

global.appRoot = path.resolve();

const { PORT = 3000 } = process.env;
const { httpServer } = setupServer();

httpServer.listen(PORT, () => {
  "\n**[APP STARTED]**", console.log(`\n[SERVER]: Listening on port ${PORT}`);
});
