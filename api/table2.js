const getDbPool = require('./db');
const authMiddleware = require('./authMiddleware');

const pool = getDbPool('user2');

module.exports = async (req, res) => {
  try {
    // Run the authentication middleware
    await authMiddleware(req, res, () => {});

    // Extract the `id` parameter from the request (e.g., URL query or route parameter)
    const { id } = req.query; // Or req.params if using route parameters like /api/report/:id

    // If an `id` is provided, use it to get the specific report
    const result = await pool.query('SELECT * FROM public.orp_audit_raws WHERE "id" = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // Return the report as JSON
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
