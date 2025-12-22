import React from 'react';

interface ProgressBarProps {
    xp: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ xp }) => {
    // Simple logic: Next level is next 50 XP milestone for demo
    // Lvl 1: 0-49, Lvl 2: 50-99...
    // Progress in current level = (XP % 50) / 50

    const progress = (xp % 50) / 50 * 100;

    return (
        <div style={{ width: '100%', background: '#e9ecef', borderRadius: '5px', height: '10px', marginTop: '5px' }}>
            <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                borderRadius: '5px',
                transition: 'width 0.5s ease-in-out'
            }}></div>
        </div>
    );
};

export default ProgressBar;
