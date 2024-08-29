import {json, LoaderFunctionArgs} from '@remix-run/node';
import {Link, Outlet, useLoaderData} from '@remix-run/react';
import {IconChevronsLeft, IconSettings, IconUser} from '@tabler/icons-react';
import {ComponentType, FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {cn} from '~/common/utils';
import {Button} from '~/components/shadcn/button';
import {ScrollArea} from '~/components/shadcn/scroll-area';
import {useToast} from '~/components/shadcn/ui/use-toast';
import {Typography} from '~/components/typographqy';
import {notificationSessionStorage} from '~/session/notificationSession.server';

type NavigationItemProps = {
  href: string;
  messageId: string;
  Icon: ComponentType<{ size?: number | string }>;
  sidebarOpen: boolean;
}

const NavigationItem: FC<NavigationItemProps> = ({href, Icon, messageId, sidebarOpen}) => {
  return (
    <Button variant="ghost" className="justify-start gap-2" asChild>
      <Link to={href}>
        <Icon size={16}/>
        {sidebarOpen ? <Typography tag="span" messageId={messageId}>{messageId}</Typography> : null}
      </Link>
    </Button>
  );
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  const notificationSession = await notificationSessionStorage.getSession(
    request.headers.get('Cookie')
  );
  const message = notificationSession.get('notification');

  return json({
    message,
  }, {
    headers: {
      'Set-Cookie': await notificationSessionStorage.commitSession(notificationSession),
    },
  });
};

export default function AuthenticatedLayout() {
  const {message} = useLoaderData<typeof loader>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const {t} = useTranslation();
  const {toast} = useToast();
  useEffect(() => {
    if (message !== undefined) {
      toast({
        description: t(message.messageId),
        variant: message.type === 'error' ? 'destructive' : 'default',
      });
    }
  }, [t, toast, message]);

  return (
    <div className="w-full h-screen flex bg-background">
      <aside
        className={cn(
          'relative w-48 bg-secondary transition-all duration-300 ease-in-out',
          !isSidebarOpen && 'w-16'
        )}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            {isSidebarOpen ? (<h2 className="text-lg font-semibold">Shift Resume</h2>) : null}

            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <IconChevronsLeft className={cn(
                'transform transition-transform duration-600 ease-in-out',
                !isSidebarOpen && 'rotate-180'
              )}/>
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          {/* Scrollable top section */}
          <ScrollArea className="flex-1 px-4">
            <nav className="flex flex-col space-y-2">
              <NavigationItem href="/resumes" messageId="common:navigation.item.resumes" Icon={IconUser}
                              sidebarOpen={isSidebarOpen}/>
            </nav>
          </ScrollArea>
          {/* Fixed bottom section */}
          <div className="mt-auto border-t border-secondary-foreground/10 px-4 py-4">
            <nav className="flex flex-col space-y-2">
              <NavigationItem href="/profile" messageId="common:navigation.item.profile" Icon={IconUser}
                              sidebarOpen={isSidebarOpen}/>
              <NavigationItem href="/settings" messageId="common:navigation.item.settings" Icon={IconSettings}
                              sidebarOpen={isSidebarOpen}/>
            </nav>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <Outlet/>
      </main>
    </div>
  );
}
