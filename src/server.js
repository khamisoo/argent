const cluster = require('cluster');
const os = require('os');
const fs = require('fs');
const path = require('path');
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const logsDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  logger.info(`Master process is running with PID ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    logger.info(`Worker ${process.pid} running on http://localhost:${PORT}`);
  });
}