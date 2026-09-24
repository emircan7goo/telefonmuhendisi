export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex-1 flex flex-col transition-opacity duration-200">
      {children}
    </div>
  );
}
