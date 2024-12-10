const getDbPool = require('./db');
const authMiddleware = require('./authMiddleware');

const pool = getDbPool('user1');

module.exports = async (req, res) => {
  try {
    // Run the authentication middleware
    await authMiddleware(req, res, () => {});

    // Extract the `id` parameter from the request (e.g., URL query or route parameter)
    const { id } = req.query; // Or req.params if using route parameters like /api/report/:id

    if (!id) {
      // If the `id` is not provided, get the minimum `id` from the database
      const result = await pool.query('SELECT "id" as min_id FROM public.orp_audit_raws ORDER BY "id" LIMIT 1;');
      if (result.rows.length === 0 || !result.rows[0].min_id) {
        return res.status(404).json({ error: 'No reports found in the database.' });
      }

      // Return the minimum `id` as the response
      return res.status(200).json({ min_id: result.rows[0].min_id });
    }

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
