import { startApp } from "./startup";
import { appConfig } from "./utils/app-config";


// start the server, ok = listen, err = exit(1):
startApp.start()
    .then(server => server.listen(appConfig.port, appConfig.host,
         () => console.log(`Listening on http://${appConfig.host}:${appConfig.port}`)
    ))
    .catch(err => {
        console.error("Startup failed: ", err);
        process.exit(1);
});
