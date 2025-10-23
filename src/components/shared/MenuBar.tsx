import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface MenuBarProps {
  name: string;
  backButtonLink: string;
  children: React.ReactNode;
}

const MenuBar = ({ name, backButtonLink, children }: MenuBarProps) => {
  return (
    <div className="flex h-12 items-center justify-between border-b border-neutral-400 px-3">
      <div className="flex gap-3">
        <Link
          href={backButtonLink}
          className="cursor-pointer rounded-full bg-white/0 p-1 transition hover:bg-neutral-600"
        >
          <ArrowLeftIcon className="stroke-1.5 size-4 stroke-white" />
        </Link>
        <p className="font-semibold">{name}</p>
      </div>
      {children}
    </div>
  );
};

export default MenuBar;
