import Header from "./Header";

export default function PageLayout({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main>
        {children}
      </main>
    </>
  );
}