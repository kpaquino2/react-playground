import { useAuth } from "@/lib/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export function UserMenu({ onSignOut }: { onSignOut?: () => void }) {
  const { user, signOut } = useAuth();
  console.log(user?.user_metadata);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user?.user_metadata.avatar_url}
            alt={user?.user_metadata.user_name}
          />
          <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user?.user_metadata.avatar_url}
              alt={user?.user_metadata.user_name}
            />
            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="">{user?.user_metadata.user_name}</p>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/components">My Components</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async () => {
            await signOut();
            onSignOut?.();
          }}
          className="justify-between"
        >
          Sign out
          <LogOutIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
