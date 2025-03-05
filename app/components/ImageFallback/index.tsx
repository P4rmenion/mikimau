import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
  fallback: string;
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { src, fallback, alt, ...rest } = props;
  const [imageSource, setImageSource] = useState(src);

  return (
    <Image
      {...rest}
      alt={alt}
      src={imageSource}
      onError={() => {
        setImageSource(fallback);
      }}
    />
  );
};

export default ImageWithFallback;
