import type { PropsWithChildren } from 'react';

export type TypographyTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export type TypographyVariant = 'hero' | 'section-headline' | 'title-headline' | 'paragraph';

export type TypographyWeight = 'light' | 'normal' | 'semi-bold' | 'bold';

export type TypographyLinePlacement = 'underline' | 'strike-through';

export type TypographyAlign = 'left' | 'center' | 'right';

export type TypographyProps = PropsWithChildren<{
  tag: TypographyTag;

  /**
   * @default depends on the {@link #tag}
   */
  variant?: TypographyVariant;

  /**
   * @default normal
   */
  fontWeight?: TypographyWeight;

  /**
   * @default left
   */
  align?: TypographyAlign;

  linePlacement?: TypographyLinePlacement;

  italic?: boolean;

  muted?: boolean;

  /**
   * Optional message id which is resolved using i18next.
   * If provided, will replace the children when loaded.
   */
  messageId?: string;

  className?: string;
}>;
