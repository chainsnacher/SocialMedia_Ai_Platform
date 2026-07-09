 const express = require('express');
 const auth = require('../middleware/auth');
 const AIContentGenerator = require('../services/aiService');
 const Conversation = require('../models/Conversation');
 const User = require('../models/user');
 const router = express.Router();
 // Start or continue conversation
 router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;
    // Find or create conversation
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({
        userId,
        messages: [],
        businessContext: req.user.businessInfo || {}
      });
    }
    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message
    });
    // Generate AI response based on context
    const businessInfo = conversation.businessContext;
    const aiResponse = await generateContextualResponse(message, businessInfo, conversation.messages);
    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse.content
    });
    conversation.lastActivity = new Date();
    await conversation.save();
    res.json({
      success: true,
      response: aiResponse.content,
      suggestions: aiResponse.suggestions || []
    });
  } catch (error) {
    console.error('Chat error:', error);
res.status(500).json({ 
  success: false, 
  error: 'Failed to process chat message' 
});
  }
 });
 // Generate content based on business info
 router.post('/generate-content', auth, async (req, res) => {
  try {
    const { prompt, contentType = 'text', platforms = ['twitter'] } = req.body;
    
    const businessInfo = req.user.businessInfo || {};
    const result = await AIContentGenerator.generateContent(businessInfo, prompt, contentType);
    if (result.success) {
      res.json({
        success: true,
        content: result.content,
        platforms
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Content generation failed' 
    });
  }
 });
 // Update business context
 router.post('/update-business-info', auth, async (req, res) => {
  try {
    const { businessInfo } = req.body;
    
    // Update user's business info
    await User.findByIdAndUpdate(req.user._id, {
      businessInfo: { ...req.user.businessInfo, ...businessInfo }
    });
    // Update conversation context
    await Conversation.findOneAndUpdate(
      { userId: req.user._id },
      { businessContext: { ...req.user.businessInfo, ...businessInfo } }
    );
    res.json({ success: true, message: 'Business info updated' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update business info' 
    });
  }
});
 // Helper function to generate contextual responses
 async function generateContextualResponse(message, businessInfo, conversationHistory) {
  try {
    const systemPrompt = `You are an AI social media assistant helping businesses create 
Business Context:- Company: ${businessInfo.companyName || 'Not specified'}- Industry: ${businessInfo.industry || 'Not specified'}  - Target Audience: ${businessInfo.targetAudience || 'General audience'}- Brand Voice: ${businessInfo.brandVoice || 'Professional'}
 Your role is to:
 1. Ask clarifying questions about their business if info is missing
 2. Suggest content ideas based on their industry and audience
 3. Help refine their brand voice and messaging
 4. Generate specific post content when requested
 5. Provide social media strategy advice
 Be conversational, helpful, and focus on creating authentic content that doesn't sound AI
 Recent conversation context: ${JSON.stringify(conversationHistory.slice(-6))}`;
    const completion = await require('openai').OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }).chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });
    return {
      content: completion.choices[0].message.content.trim(),
      suggestions: generateSuggestions(message, businessInfo)
    };
  } catch (error) {
    throw new Error('Failed to generate AI response');
  }
 }
 // Generate quick reply suggestions
 function generateSuggestions(message, businessInfo) {
  const suggestions = [
    "Generate content ideas for this week",
    "Help me improve my brand voice",
    "Create posts for upcoming events",
    "Suggest trending topics for my industry"
  ];
  
  return suggestions.slice(0, 3);
 }
module.exports = router;