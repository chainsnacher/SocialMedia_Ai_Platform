import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostEditor() {
  const [content, setContent] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [platforms, setPlatforms] = useState(['twitter']);

  async function savePost() {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
    await axios.post(`${apiBaseUrl}/api/posts`, {
      content: content,
      scheduledFor,
      platforms
    });
    toast.success('Post scheduled!');
  }

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            value="twitter"
            checked={platforms.includes('twitter')}
            onChange={e => {
              if (e.target.checked) {
                setPlatforms([...platforms, 'twitter']);
              } else {
                setPlatforms(platforms.filter(p => p !== 'twitter'));
              }
            }}
          />
          Twitter
        </label>
        <label>
          <input
            type="checkbox"
            value="facebook"
            checked={platforms.includes('facebook')}
            onChange={e => {
              if (e.target.checked) {
                setPlatforms([...platforms, 'facebook']);
              } else {
                setPlatforms(platforms.filter(p => p !== 'facebook'));
              }
            }}
          />
          Facebook
        </label>
        {/* Add more platforms as needed */}
      </div>
      <input type="datetime-local" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} />
      {/* Add platform selector if needed */}
      <button onClick={savePost}>Schedule Post</button>
      <ToastContainer />
    </div>
  );
}
