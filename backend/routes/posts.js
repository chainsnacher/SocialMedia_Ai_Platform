 const express = require('express');
 const auth = require('../middleware/auth');
 const Post = require('../models/Post');
 const TwitterService = require('../services/twitterService');
 const router = express.Router();
 // Create new post
 router.post('/', auth, async (req, res) => {
 try {
 const { content, scheduledFor, platforms, postType = 'dynamic' } = req.body;
 const post = new Post({
 userId: req.user._id,
 content: {
 text: content.text,
 hashtags: content.hashtags || [],
 mentions: content.mentions || []
 },
 scheduledFor: new Date(scheduledFor),
 postType,
 platforms: {
 twitter: { scheduled: platforms.includes('twitter') },
 linkedin: { scheduled: platforms.includes('linkedin') },
 instagram: { scheduled: platforms.includes('instagram') }
 }
 });
 await post.save();
    res.status(201).json({
      success: true,
      post: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
 });
 // Get user's posts
 router.get('/', auth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let query = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.scheduledFor = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    const posts = await Post.find(query)
      .sort({ scheduledFor: 1 })
      .limit(100);
    res.json({
      success: true,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
 });
 // Update post
 router.put('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const updates = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: postId, userId: req.user._id },
      { $set: updates },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
 });
 // Delete post
 router.delete('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOneAndDelete({
      _id: postId,
      userId: req.user._id
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
 });
 // Publish post immediately
 router.post('/:postId/publish', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findOne({
      _id: postId,
      userId: req.user._id
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    const results = await publishPost(post);
    // Update post status
    post.status = results.success ? 'posted' : 'failed';
    post.platforms = { ...post.platforms, ...results.platforms };
    await post.save();
    res.json({
      success: results.success,
      results: results.platforms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
 });
 // Helper function to publish posts
 async function publishPost(post) {
  const results = { success: false, platforms: {} };
  
  try {
    // Twitter publishing
    if (post.platforms.twitter.scheduled) {
      const twitterService = new TwitterService();
      const twitterResult = await twitterService.postTweet(post.content.text);
      
      results.platforms.twitter = {
        ...post.platforms.twitter,
        posted: twitterResult.success,
        postId: twitterResult.postId,
        error: twitterResult.error
      };
    }
    // LinkedIn and Instagram would be similar
    // For hackathon demo, we'll simulate these
    if (post.platforms.linkedin.scheduled) {
      results.platforms.linkedin = {
        ...post.platforms.linkedin,
        posted: true,
        postId: `linkedin_${Date.now()}`
};
 }
 if (post.platforms.instagram.scheduled) {
 results.platforms.instagram = {
 ...post.platforms.instagram,
 posted: true,
 postId: `instagram_${Date.now()}`
 };
 }
 results.success = Object.values(results.platforms).some(p => p.posted);
 return results;
 } catch (error) {
 results.error = error.message;
 return results;
 }
 }
 module.exports = router;