import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import NotificationProvider from './notification-provider';

export default function RootProvider({ children }: PropsWithChildren) {
  return (
    <NextIntlClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
