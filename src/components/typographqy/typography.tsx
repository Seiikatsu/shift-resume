import {createElement, FC, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {cn} from '~/common/utils';
import {
  TypographyAlign,
  TypographyLinePlacement,
  TypographyProps,
  TypographyTag,
  TypographyVariant,
  TypographyWeight
} from '~/components/typographqy/types';

const TAG_VARIANT: Record<TypographyTag, TypographyVariant> = {
  h1: 'hero',
  h2: 'section-headline',
  h3: 'title-headline',
  p: 'paragraph',
  span: 'paragraph',
};

const VARIANT_STYLES: Record<TypographyVariant, string> = {
  'hero': 'text-4xl tracking-tight',
  'section-headline': 'text-3xl tracking-tight',
  'title-headline': 'text-2xl tracking-tight',
  'paragraph': 'leading-7',
};

const FONT_WEIGHT_STYLES: Record<TypographyWeight, string> = {
  light: 'font-light',
  'normal': 'font-normal',
  'semi-bold': 'font-semibold',
  'bold': 'font-bold',
};

const LINE_PLACEMENT: Record<TypographyLinePlacement, string> = {
  'underline': 'underline',
  'strike-through': 'line-through',
};

const ALIGNMENT: Record<TypographyAlign, string> = {
  'left': 'text-left',
  'center': 'text-center',
  'right': 'text-right',
};

export const Typography: FC<TypographyProps> = ({
                                                  tag,
                                                  variant,
                                                  fontWeight = 'normal',
                                                  italic = false,
                                                  align = 'left',
                                                  linePlacement,
                                                  muted,
                                                  messageId,
                                                  className,
                                                  children,
                                                }) => {
  let {t} = useTranslation(undefined);

  const memorizedClassName = useMemo(() => {
    return cn(
      ALIGNMENT[align],
      variant ? VARIANT_STYLES[variant] : tag !== 'span' && VARIANT_STYLES[TAG_VARIANT[tag]],
      FONT_WEIGHT_STYLES[fontWeight],
      italic && 'italic',
      linePlacement && LINE_PLACEMENT[linePlacement],
      muted && 'text-muted',
      className
    );
  }, [tag, variant, fontWeight, italic, linePlacement, className]);

  const content = useMemo(() => {
    return messageId ? t(messageId, {defaultValue: children}) : children;
  }, [messageId, children]);

  return createElement(tag, {
    className: memorizedClassName,
  }, content);
};
