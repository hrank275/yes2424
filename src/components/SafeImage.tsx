import React, { useState } from 'react';
import { Truck } from 'lucide-react';

interface SafeImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [failedCompletely, setFailedCompletely] = useState<boolean>(false);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setFailedCompletely(true);
    }
  };

  if (failedCompletely) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high text-slate-text-muted p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Truck className="w-8 h-8 text-primary/60 mb-2" />
        <span className="text-xs font-semibold text-on-surface-variant">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};
