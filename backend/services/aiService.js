 const { OpenAI } = require('openai');
 const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
 });
 class AIContentGenerator {
 static async generateContent(businessInfo, prompt, contentType = 'text') {
 try {
 const systemPrompt = `You are a professional social media content creator. 
Business Context:- Company: ${businessInfo.companyName || 'N/A'}- Industry: ${businessInfo.industry || 'General'}- Target Audience: ${businessInfo.targetAudience || 'General audience'}- Brand Voice: ${businessInfo.brandVoice || 'Professional yet engaging'}- Description: ${businessInfo.description || 'N/A'}
 Create engaging, authentic social media content that:
 1. Matches the brand voice and industry
 2. Appeals to the target audience  
3. Includes relevant hashtags (3-5 max)
 4. Feels natural and human-written
 5. Is platform-optimized
 6. Avoids overly promotional language
 Content Type: ${contentType}
 Keep posts under 280 characters for Twitter compatibility.`;
 const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });
      const content = completion.choices[0].message.content.trim();
      
      // Extract hashtags
      const hashtagRegex = /#\w+/g;
      const hashtags = content.match(hashtagRegex) || [];
      
      return {
        success: true,
        content: {
          text: content,
          hashtags: hashtags.map(tag => tag.substring(1)), // Remove # symbol
          wordCount: content.split(' ').length,
          characterCount: content.length
        }
      };
    } catch (error) {
      console.error('AI Generation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  static async generateMultiplePosts(businessInfo, topics, count = 3) {
    try {
      const posts = [];
      
      for (const topic of topics.slice(0, count)) {
        const result = await this.generateContent(businessInfo, topic);
        if (result.success) {
          posts.push(result.content);
        }
      }
      
      return {
        success: true,
        posts
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
 }
module.exports = AIContentGenerator;