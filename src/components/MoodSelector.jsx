import React, { useState } from 'react';

// 気分一覧
const moods = ['元気', 'リラックス', '集中', '癒し', 'お祝い'];

export default function MoodSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div
      style={{
        padding: 32,
        background: '#e0f7fa',
        borderRadius: 16,
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => {
            setSelected(mood);
            onSelect(mood);
          }}
          style={{
            padding: '12px 24px',
            borderRadius: 24,
            border: 'none',
            fontSize: 20,
            background: selected === mood ? '#aed581' : '#fff',
            color: selected === mood ? '#33691e' : '#333',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #a5d6a7',
          }}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}
