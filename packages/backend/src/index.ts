import "dotenv/config";
import { validateEnv } from "./config.js";
import { buildApp } from "./app.js";

const config = validateEnv();
const app = await buildApp(config);

app.listen({ port: config.PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
