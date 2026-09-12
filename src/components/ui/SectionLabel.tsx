export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-[1px] text-lime uppercase">
      {children}
    </p>
  );
}
