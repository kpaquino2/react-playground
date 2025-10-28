import ComponentsList from "@/components/components/ComponentsList";
import UserMenu from "@/components/shared/UserMenu";

export default function ComponentsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="h-12 border-b border-white/20 bg-zinc-900/20 px-4">
        <div className="flex h-full items-center justify-between">
          <p>React Playground</p>
          <UserMenu />
        </div>
      </div>
      <div className="flex-1">
        <div className="mx-auto flex max-w-7xl flex-col px-5">
          <ComponentsList />
        </div>
      </div>
    </div>
  );
}
