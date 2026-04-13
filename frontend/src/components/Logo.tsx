import React from 'react';

interface LogoProps {
    variant?: 'light' | 'dark';
    type?: 'full' | 'mark';
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
    variant = 'dark', 
    type = 'full', 
    className = '' 
}) => {
    // Mapping assets based on user instructions
    // Light Full Logo: farmmerce-20.png 
    // Dark Full Logo: logo.png
    // Light Mark: mark.png
    // Dark Mark: farmmerce-23.png (with fallback to filtered mark.png if missing)

    const getSrc = () => {
        if (type === 'full') {
            return variant === 'light' ? '/farmmerce-20.png' : '/logo.png';
        } else {
            // Mark only
            if (variant === 'light') {
                return '/mark.png';
            } else {
                // farmmerce-23.png is dark mark. Fallback logic included.
                return '/farmmerce-23.png';
            }
        }
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        if (type === 'mark' && variant === 'dark') {
            // Fallback for missing farmmerce-23.png
            target.src = '/mark.png';
            target.style.filter = 'brightness(0.2) contrast(1.2)';
        }
    };

    return (
        <img 
            src={getSrc()} 
            alt="Farmmerce" 
            className={`object-contain ${className}`}
            onError={handleError}
        />
    );
};

export default Logo;
