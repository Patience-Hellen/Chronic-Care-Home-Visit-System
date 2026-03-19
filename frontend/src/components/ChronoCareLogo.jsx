import './ChronoCareLogo.css';

export function ChronoCareLogo() {
    return (
        <div className="logo-container">
            <svg viewBox="0 0 80 80" className="logo-svg">
                <circle cx="40" cy="40" r="38" fill="url(#blueGradient)" />

                <g transform="translate(40, 40)">
                    <rect x="-3" y="-18" width="6" height="36" rx="2" fill="white" />
                    <rect x="-18" y="-3" width="36" height="6" rx="2" fill="white" />

                    <circle cx="0" cy="-12" r="1.5" fill="white" />
                    <circle cx="12" cy="0" r="1.5" fill="white" />
                    <circle cx="0" cy="12" r="1.5" fill="white" />
                    <circle cx="-12" cy="0" r="1.5" fill="white" />
                </g>

                <path
                    d="M40 32C40 32 35 27 31 27C27 27 25 29 25 32C25 35 27 37 40 47C53 37 55 35 55 32C55 29 53 27 49 27C45 27 40 32 40 32Z"
                    fill="white"
                    opacity="0.9"
                />

                <defs>
                    <linearGradient id="blueGradient">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}