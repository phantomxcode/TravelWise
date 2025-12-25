
import React from 'react';

interface MapPreviewProps {
  location: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ location }) => {
  const encodedLocation = encodeURIComponent(location);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY}&q=${encodedLocation}`;

  // Using a fallback search link if an API key is not fully configured for Embed API 
  // or a standard search embed which is more stable for simple previews.
  const embedUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50">
        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <h3 className="font-bold text-slate-800">Destination Map</h3>
      </div>
      <div className="relative w-full h-64 md:h-80 bg-slate-100">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          title={`Map of ${location}`}
        ></iframe>
      </div>
      <div className="p-3 text-center bg-slate-50">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          Exploring {location}
        </p>
      </div>
    </div>
  );
};

export default MapPreview;
