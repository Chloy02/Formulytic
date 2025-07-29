const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Formulytic API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    uptime: process.uptime()
  });
};

module.exports = { healthCheck };
