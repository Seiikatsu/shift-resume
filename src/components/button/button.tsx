import {FC} from 'react';
import {ButtonProps, ButtonVariant} from '~/components/button/types';
import {Button as BaseButton, type ButtonProps as BaseButtonProps} from '~/components/shadcn/button';

const VARIANT_MAP: Record<ButtonVariant, BaseButtonProps['variant']> = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive'
};

export const Button: FC<ButtonProps> = ({variant = 'secondary', ...props}) => {
  return (
    <BaseButton {...props} variant={VARIANT_MAP[variant]}/>
  );
};
