import React, { useState, useRef } from 'react';
import { Play, Pause, Mail, ArrowRight } from 'lucide-react';

interface HeroWithVideoProps {
    brandName?: string;
    heroTitle?: string;
    heroDescription?: string;
    backgroundImage?: string;
    videoUrl?: string;
    emailPlaceholder?: string;
    onEmailSubmit?: (email: string) => void;
}

const HeroWithVideo: React.FC<HeroWithVideoProps> = ({
    brandName = "TravelWise",
    heroTitle = "Plan Smarter. Travel Better.",
    heroDescription = "Create detailed itineraries, analyze your budget with AI, and organize your adventures — all in one beautiful app.",
    backgroundImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    emailPlaceholder = "enter@email.com",
    onEmailSubmit
}) => {
    const [email, setEmail] = useState('');
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoPaused, setIsVideoPaused] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleEmailSubmit = () => {
        if (onEmailSubmit && email) {
            onEmailSubmit(email);
        }
        console.log('Email submitted:', email);
    };

    const handlePlayVideo = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsVideoPlaying(true);
            setIsVideoPaused(false);
        }
    };

    const handlePauseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsVideoPaused(true);
        }
    };

    const handleResumeVideo = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsVideoPaused(false);
        }
    };

    const handleVideoEnded = () => {
        setIsVideoPlaying(false);
        setIsVideoPaused(false);
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="pt-8 pb-12 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        AI-Powered Travel Planning
                    </span>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl text-slate-900 font-bold tracking-tight fugaz-one-regular">
                        {heroTitle}
                    </h1>

                    <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
                        {heroDescription}
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder={emailPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-64 sm:w-80 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 font-medium pl-12 pr-4 py-3 text-base rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                            />
                        </div>
                        <button
                            onClick={handleEmailSubmit}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 text-base rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-105"
                        >
                            Join Now
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Video/Image Header */}
            <div className="max-w-5xl mx-auto px-4 pb-12">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
                    <img
                        src={backgroundImage}
                        alt="Travel destination"
                        className={`w-full h-full absolute inset-0 object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className={`w-full h-full absolute inset-0 object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                        onEnded={handleVideoEnded}
                        playsInline
                        muted
                    />

                    {/* Play/Pause Button */}
                    <div className="absolute bottom-5 right-5 z-10">
                        {!isVideoPlaying ? (
                            <button
                                onClick={handlePlayVideo}
                                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 shadow-lg group"
                                aria-label="Play video"
                            >
                                <Play className="h-7 w-7 text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={isVideoPaused ? handleResumeVideo : handlePauseVideo}
                                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 shadow-lg group"
                                aria-label={isVideoPaused ? "Resume video" : "Pause video"}
                            >
                                {isVideoPaused ? (
                                    <Play className="h-7 w-7 text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
                                ) : (
                                    <Pause className="h-7 w-7 text-white fill-white group-hover:scale-110 transition-transform" />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

export { HeroWithVideo };
