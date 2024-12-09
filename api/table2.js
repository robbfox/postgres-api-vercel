const getDbPool = require('./db');
const authMiddleware = require('./authMiddleware');

const pool = getDbPool('user2');

module.exports = async (req, res) => {
  try {
    await authMiddleware(req, res, () => {});
    const result = await pool.query('SELECT * FROM public.orp_audit_raws');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
