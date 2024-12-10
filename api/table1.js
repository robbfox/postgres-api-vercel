const getDbPool = require('./db');
const authMiddleware = require('./authMiddleware');

// Get the database connection pool for a specific user
const pool = getDbPool('user1');

module.exports = async (req, res) => {
  try {
    // Run the authentication middleware
    await authMiddleware(req, res, () => {});

    // Extract the `id` parameter from the request
    const { id } = req.query; // Or req.params if using route parameters like /api/report/:id

    if (!id) {
      // If no `id` is provided, get the minimum `id`
      const minResult = await pool.query('SELECT MIN(id) AS min_id FROM public.orp_audit_raws;');

      if (minResult.rows.length === 0) {
        return res.status(404).json({ error: 'No reports found.' });
      }

      // Return the minimum `id` as the response
      return res.status(200).json({ min_id: minResult.rows[0].min_id });
    }

    // If an `id` is provided, get the specific report
    const result = await pool.query('SELECT * FROM public.orp_audit_raws WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // Return the report as JSON
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};
