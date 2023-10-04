const http = require('http');
const { app, dbPromise } = require('./app');

dbPromise
    .then(() => {
        app.set('port', process.env.PORT || 4000);
        const server = http.createServer(app);
        server.listen(process.env.PORT || 4000, () => console.log("Connexion à DB réussie. Serveur écoutant le port " + (process.env.PORT || 4000)));
    })
    .catch(error => console.log(error))