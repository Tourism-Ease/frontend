interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="w-full p-4 md:p-6 lg:p-8 max-w-7xl mx-auto pt-20 md:pt-20">
      {children}
    </div>
  );
}
