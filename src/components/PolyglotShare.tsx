"use client";

import React from "react";
import { Share2 } from "lucide-react";

/**
 * PolyglotShare – a Next.js/React client component that shares an image Blob using the Web Share API.
 *
 * Props:
 *  - imageBlob (Blob): the image Blob to be shared (e.g., created via canvas or other dynamic process)
 *  - filename? (string): optional filename for the shared image (default "shared-image.png")
 *  - text? (string): optional text to include with the shared image
 *  - url? (string): optional link to include with the share
 *
 * Example usage:
 * ```tsx
 * <PolyglotShare imageBlob={myBlob} text="Check out my creation!" url="https://example.com" />
 * ```
 */

export interface PolyglotShareProps {
  imageBlob: Blob;
  filename?: string;
  text?: string;
  url?: string;
}

const PolyglotShare: React.FC<PolyglotShareProps> = ({
  imageBlob,
  filename = "shared-image.png",
  text = "Check this out!",
  url,
}) => {
  const onShare = async () => {
    if (!navigator.share || !navigator.canShare) {
      alert("Web Share API with file support is not supported in this browser.");
      return;
    }

    const file = new File([imageBlob], filename, { type: imageBlob.type });

    if (!navigator.canShare({ files: [file] })) {
      alert("This browser cannot share the generated image file.");
      return;
    }

    const shareData: ShareData = {
      files: [file],
      title: text,
      text,
      url,
    };

    try {
      await navigator.share(shareData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      
    }
  };

  return (
    <button
      type="button"
      aria-label="Share image"
      onClick={onShare}
      className="w-10 h-10 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors active:scale-95"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
};

export default PolyglotShare;
