declare module 'react-katex' {
  import { ComponentType } from 'react';

  interface KatexProps {
    math: string;
    children?: never;
  }

  export const InlineMath: ComponentType<KatexProps>;
  export const BlockMath: ComponentType<KatexProps>;
}
