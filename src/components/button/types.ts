import {PropsWithChildren} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonProps = PropsWithChildren<{
  /**
   * @default secondary
   */
  variant?: ButtonVariant;

  disabled?: boolean;

  type?: 'submit' | 'reset' | 'button';
}>;
