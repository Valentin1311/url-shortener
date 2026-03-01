import "dotenv/config";
import { validateEnv } from "./config";
import { buildApp } from "./app";

const config = validateEnv();
const app = await buildApp(config);

app.listen({ port: config.PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
