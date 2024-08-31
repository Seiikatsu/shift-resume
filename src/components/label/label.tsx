import type { FC } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { LabelProps } from '~/components/label/types';
import { Label as ShadcnLabel } from '~/components/shadcn/label';

export const Label: FC<LabelProps> = memo(({ messageId, ...rest }) => {
  const { t } = useTranslation();

  const message = t(messageId);

  return <ShadcnLabel {...rest}>{message}</ShadcnLabel>;
});

Label.displayName = 'Label';
