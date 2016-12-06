import server from './lib/server.js';

// start the service
server.listen(8813, () => {
    const instance = server.address();
    console.info(`Server instance started: ${instance.address} ${instance.port}`);
});
