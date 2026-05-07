declare module 'react-image-magnify' {
    import * as React from 'react';

    export interface SmallImageProps {
        alt: string;
        isFluidWidth?: boolean;
        src: string;
        srcSet?: string;
        sizes?: string;
    }

    export interface LargeImageProps {
        src: string;
        width: number;
        height: number;
    }

    export interface ReactImageMagnifyProps {
        smallImage: SmallImageProps;
        largeImage: LargeImageProps;
        enlargedImageContainerDimensions?: {
            width: string | number;
            height: string | number;
        };
        enlargedImageContainerClassName?: string;
        enlargedImagePosition?: 'over' | 'beside';
        shouldUsePositiveSpaceLens?: boolean;
        isHintEnabled?: boolean;
        lensStyle?: React.CSSProperties;
        style?: React.CSSProperties;
        smallImageClassName?: string;
    }

    const ReactImageMagnify: React.ComponentType<ReactImageMagnifyProps>;
    export default ReactImageMagnify;
}
