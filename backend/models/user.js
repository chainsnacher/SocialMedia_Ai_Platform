const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');
 const userSchema = new mongoose.Schema({
 username: {
 type: String,
 required: true,
 unique: true,
 trim: true,
 minlength: 3,
 maxlength: 30
 },
 email: {
 type: String,
 required: true,
 unique: true,
 lowercase: true
 },
 password: {
 type: String,
 required: true,
 minlength: 6
 },
 businessInfo: {
 companyName: String,
 industry: String,
 targetAudience: String,
 brandVoice: String,
 description: String
 },
 connectedAccounts: {
 twitter: {
 connected: { type: Boolean, default: false },
 username: String,
 accessToken: String,
 accessTokenSecret: String
 },
 linkedin: {
 connected: { type: Boolean, default: false },
 profile: String
 },
 instagram: {
 connected: { type: Boolean, default: false },
 username: String
 }
 },
 createdAt: {
 type: Date,
 default: Date.now
 }
 });
// Hash password before saving
 userSchema.pre('save', async function(next) {
 if (!this.isModified('password')) return next();
 this.password = await bcrypt.hash(this.password, 12);
 next();
 });
 // Compare password method
 userSchema.methods.comparePassword = async function(password) {
 return await bcrypt.compare(password, this.password);
 };
 module.exports = mongoose.model('User', userSchema);