import type { ReactNode } from "react";
import Header from "./Header";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div>
      <Header />

      <main>
        {children}
      </main>
    </div>
  );
}