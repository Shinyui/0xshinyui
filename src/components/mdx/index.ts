import BunnyImage from './BunnyImage';
import BunnyVideo from './BunnyVideo';
import CodeBlock from './CodeBlock';

export { BunnyImage, BunnyVideo, CodeBlock };

export function getMDXComponents() {
  return {
    img: BunnyImage,
    pre: CodeBlock,
    Video: BunnyVideo,
  };
}
