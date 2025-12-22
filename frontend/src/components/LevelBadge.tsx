import React from 'react';

interface LevelBadgeProps {
    level: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level }) => {
    return (
        <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#ffc107',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '24px',
            color: '#343a40',
            border: '4px solid #fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            {level}
        </div>
    );
};

export default LevelBadge;
