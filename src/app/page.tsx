import Link from "next/link";

export default function Home() {
  return (
    <div className="grid h-screen w-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Welcome to React Playground</h1>
        <p>Edit and play with your own React components!</p>
        <Link href="/projects">
          <button className="cursor-pointer rounded bg-teal-600 px-4 py-2 text-white transition hover:bg-teal-700">
            Go to Projects
          </button>
        </Link>
      </div>
    </div>
  );
}
