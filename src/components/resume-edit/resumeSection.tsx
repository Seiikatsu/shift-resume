import type { TablerIcon } from '@tabler/icons-react';
import { IconChevronDown } from '@tabler/icons-react';
import type { FC, PropsWithChildren } from 'react';

import { cn } from '~/common/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/shadcn/ui/collapsible';
import { Typography } from '~/components/typographqy';

type ResumeSectionProps = PropsWithChildren<{
  titleMessageId: string;
  icon: TablerIcon;
}>;

export const ResumeSection: FC<ResumeSectionProps> = ({ titleMessageId, icon: Icon, children }) => {
  return (
    <Collapsible className="w-full rounded-md border border-secondary">
      <CollapsibleTrigger className="group flex w-full items-center gap-4 p-4">
        <div className="relative border border-transparent group-data-[state=open]:hover:border-secondary">
          <Icon size={32} />
        </div>
        <Typography className="flex-1" tag="h2" messageId={titleMessageId} />
        <div className="opacity-0 transition-opacity duration-300 group-data-[state=open]:opacity-100">
          <IconChevronDown
            className="stroke-neutral-400 transition-transform duration-300 group-data-[state=open]:rotate-180"
            size={32}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          'outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        )}
      >
        <div className="flex flex-col gap-4 p-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
