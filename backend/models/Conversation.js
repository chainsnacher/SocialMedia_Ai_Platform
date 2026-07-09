 const mongoose = require('mongoose');
 const conversationSchema = new mongoose.Schema({
 userId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User',
 required: true
 },
 messages: [{
 role: {
 type: String,
 enum: ['user', 'assistant', 'system'],
 required: true
 },
 content: {
 type: String,
 required: true
 },
 timestamp: {
 type: Date,
 default: Date.now
 }
 }],
 businessContext: {
 companyName: String,
 industry: String,
 targetAudience: String,
 brandVoice: String,
 description: String,
 products: [String],
 competitors: [String],
 goals: [String]
 },
 lastActivity: {
 type: Date,
 default: Date.now
 }
 });
 module.exports = mongoose.model('Conversation', conversationSchema);
