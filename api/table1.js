const getDbPool = require('./db');
const authMiddleware = require('./authMiddleware');

const pool = getDbPool('user1');

module.exports = async (req, res) => {
  try {
    await authMiddleware(req, res, () => {});
    
    // Get the minimum and maximum id
    const minIdResult = await pool.query('SELECT MIN("id") AS minId FROM public.orp_audit_raws');
    const maxIdResult = await pool.query('SELECT MAX("id") AS maxId FROM public.orp_audit_raws');

    const minId = minIdResult.rows[0].minid;
    const maxId = maxIdResult.rows[0].maxid;

    if (minId === null || maxId === null) {
      return res.status(404).json({ error: 'No data found in the database.' });
    }

    // Create an array of IDs to loop through
    const data = [];
    for (let id = minId; id <= maxId; id++) {
      const result = await pool.query('SELECT * FROM public.orp_audit_raws WHERE "id" = $1;', [id]);
      if (result.rows.length > 0) {
        data.push(result.rows[0]);
      }
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
