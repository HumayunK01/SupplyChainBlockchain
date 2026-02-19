import React from 'react';

const GridBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none -z-50 opacity-[0.03] md:hidden">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #94a3b8 1px, transparent 1px),
                        linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />
        </div>
    );
};

export default GridBackground;
