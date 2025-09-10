import { config } from 'dotenv';
config({ path: '.env.local' });

// Test the Google API directly
async function testAPI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say hello'
            }]
          }]
        })
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct API test successful!');
      console.log('Response:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      const errorData = await response.json();
      console.log('❌ API Error:', response.status);
      console.log('Details:', errorData);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testAPI();
