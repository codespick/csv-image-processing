const Request = require('../models/Request');

const getStatus = async (req, res) => {
  try {
    const request = await Request.findOne({ requestId: req.params.requestId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({
      requestId: request.requestId,
      status: request.status,
      products: request.status === 'completed' ? request.products : undefined
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
};

module.exports = { getStatus };