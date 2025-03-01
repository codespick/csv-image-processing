const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  products: [{
    serialNumber: Number,
    productName: String,
    inputImageUrls: [String],
    outputImageUrls: [String]
  }],
  webhookUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);