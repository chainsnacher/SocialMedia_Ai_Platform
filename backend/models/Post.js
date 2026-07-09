const mongoose = require('mongoose');
 const postSchema = new mongoose.Schema({
 userId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User',
 required: true
 },
 content: {
 text: { type: String, required: true },
 hashtags: [String],
 mentions: [String]
 },
 platforms: {
 twitter: { 
scheduled: { type: Boolean, default: false },
 posted: { type: Boolean, default: false },
 postId: String,
 error: String
 },
 linkedin: { 
scheduled: { type: Boolean, default: false },
 posted: { type: Boolean, default: false },
 postId: String,
 error: String
 },
 instagram: { 
scheduled: { type: Boolean, default: false },
 posted: { type: Boolean, default: false },
 postId: String,
 error: String
 }
 },
 scheduledFor: {
 type: Date,
 required: true
 },
 postType: {
 type: String,
enum: ['dynamic', 'static'],
 default: 'dynamic'
 },
 aiGenerated: {
 type: Boolean,
 default: false
 },
 aiPrompt: String,
 status: {
 type: String,
 enum: ['draft', 'scheduled', 'posted', 'failed'],
 default: 'draft'
 },
 createdAt: {
 type: Date,
 default: Date.now
 }
 });
 module.exports = mongoose.model('Post', postSchema);