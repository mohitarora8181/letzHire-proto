import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const VideoInterview = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // For safety, we'll validate that the ID exists
    if (!id) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Interview ID Missing</h2>
                    <p className="text-gray-700 mb-4">
                        No interview ID was provided. Please return to the previous page and try again.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Handle the iframe load event
    const handleIframeLoad = () => {
        setLoading(false);
    };

    // Handle any errors with the iframe
    const handleIframeError = () => {
        setLoading(false);
        setError("Failed to load the video interview. Please check your connection and try again.");
    };

    return (
        <div className="w-full h-full relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
                    <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
                        <p className="mt-2 font-medium text-gray-700">Loading video interview...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
                    <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                        <p className="text-gray-700 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <iframe
                className="w-full h-full rounded-xl"
                src={`https://tavus.daily.co/${id}`}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
            />
        </div>
    );
};

export default VideoInterview;
