import { type ChangeEvent, type MouseEvent, useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CameraIcon } from '@/assets/svgIconComponents/CameraIcon';
import { Button } from '@/components/atom/Button';
import { Skeleton } from '@/components/atom/Skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atom/Avatar';

interface AvatarUploadProps {
  src?: string;
  fallback: string;
  fallbackColor: string;
  fallbackBackground: string;
  onImageUpload?: (file: File) => void;
  onImageDelete?: () => void;
  loading?: boolean;
}

export default function AvatarUpload({
  src,
  fallback,
  onImageUpload,
  onImageDelete,
  fallbackColor,
  fallbackBackground,
  loading,
}: AvatarUploadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayedSrc, setDisplayedSrc] = useState<string | undefined | null>(src);
  const [isLoadingNewImage, setIsLoadingNewImage] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload?.(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageDelete?.();
  };

  useEffect(() => {
    if (src && src !== displayedSrc) {
      setIsLoadingNewImage(true);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setDisplayedSrc(src);
        setIsLoadingNewImage(false);
        setIsHovered(false);
      };
      img.onerror = () => {
        setIsLoadingNewImage(false);
        setDisplayedSrc(src);
      };
    } else if (!src && displayedSrc) {
      setDisplayedSrc(null);
      setIsLoadingNewImage(false);
    }
  }, [src, displayedSrc]);

  useEffect(() => {
    if (src !== undefined && displayedSrc === undefined) {
      setDisplayedSrc(src);
    }
  }, []);

  return (
    <div
      className={`relative group w-[126px] h-[126px] ${loading || isLoadingNewImage ? 'pointer-events-none' : 'cursor-pointer'}`}
      onMouseEnter={() => !loading && !isLoadingNewImage && setIsHovered(true)}
      onMouseLeave={() => !loading && !isLoadingNewImage && setIsHovered(false)}
    >
      {displayedSrc && !loading && !isLoadingNewImage && (
        <div
          className={`absolute right-3 transition-all duration-200 z-1 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <Button variant="secondary" className="w-4 h-4 p-0 flex items-center justify-center" onClick={handleDelete}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      {loading || isLoadingNewImage ? (
        <Skeleton className="w-[126px] h-[126px] rounded-full" />
      ) : (
        <Avatar
          className="w-[126px] h-[126px] rounded-[50%] flex justify-center items-center"
          style={{ backgroundColor: fallbackBackground }}
        >
          <AvatarImage className="object-cover" src={displayedSrc || undefined} alt="User Avatar" />
          <AvatarFallback
            className="font-medium text-4xl"
            style={{ backgroundColor: 'transparent', color: fallbackColor }}
          >
            {fallback}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2 transition-all duration-200 ${
          isHovered && !loading && !isLoadingNewImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <Button
          className="bg-white px-1.5 py-1 text-[10px] text-primary font-medium rounded flex items-center gap-1"
          onClick={handleUploadClick}
        >
          <CameraIcon />
          {displayedSrc ? 'Edit' : 'Add'}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
