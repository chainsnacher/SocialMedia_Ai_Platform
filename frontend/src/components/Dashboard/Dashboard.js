import React from 'react';
import Chatbot from '../Chatbot/Chatbot';
import CalendarView from '../Calendar/Calendar';
import PostEditor from './PostEditor';

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Chatbot />
      <PostEditor />
      <CalendarView />
      {/* Add analytics/summary as needed */}
    </div>
  );
}
