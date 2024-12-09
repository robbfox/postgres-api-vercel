module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === process.env.AUTH_SECRET) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }
  };
  