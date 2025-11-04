<h1>
  <img src="public/logo.svg" width="28" height="28">
  Nutshell
</h1>

A component-centric React playground for building, sharing, and remixing components instantly. No setup, no build process. Just code.

**Live at:** [https://nutshell.kyleaquino.dev](https://nutshell.kyleaquino.dev)

## Features

- **In-Browser React Editor** - Write React components directly in your browser with Monaco Editor
- **Component-Centric** - No project setup needed. Just create a component and start building
- **Easy Sharing** - Share components using their ID or `@username/slug` format
- **Import from Community** - Import any component using `import Button from "/@username/button"`
- **Live Preview** - See your changes instantly with hot reloading
- **Console Panel** - Debug with `console.log`, `console.warn`, `console.error`, and `console.info`
- **Circular Dependency Detection** - Automatically detects and prevents circular imports
- **Tailwind CSS** - Full Tailwind support out of the box
- **Auto-formatting** - Code is formatted with Prettier on run
- **Customizable Preview** - Adjust component positioning (center/top-left), padding, and background color
- **Keyboard Shortcuts** - Run code with `Ctrl+S` / `Cmd+S`

## Tech Stack

- **Framework:** Next.js
- **Database:** Supabase
- **Bundler:** esbuild-wasm
- **Code Editor:** Monaco Editor
- **Code Parsing:** @babel/parser & @babel/traverse
- **Formatting:** Prettier

## How It Works

### The `useESBuild` Hook

The core of Nutshell is the `useESBuild` hook, which handles component bundling through a sophisticated dependency resolution system:

1. **Dependency Resolution Process:**
   - Starting from the main component, recursively analyzes all imports
   - Enforces safety limits (max depth: 5, max total imports: 50)
   - Uses `@babel/parser` and `@babel/traverse` to extract import paths
   - Translates component slugs (`@username/slug`) to IDs via slug-to-ID mapping
   - Caches translations to minimize API calls

2. **Circular Dependency Detection:**
   - Tracks visited component IDs during traversal
   - Detects and prevents circular import chains
   - Provides clear error messages when cycles are found

3. **Virtual File System:**
   - Fetches remote components with caching
   - Builds a `Map<id, code>` of all dependencies
   - Creates a virtual file system for esbuild-wasm to bundle

4. **Bundling:**
   - Uses esbuild-wasm to bundle the component tree
   - Returns executable code ready for preview

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account

### Local Setup

1. Clone the repository:

```bash
git clone https://github.com/kpaquino2/react-playground.git
cd react-playground
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Component

1. Sign in
2. Click "Start Building" on the home page or "Create Component" on components page
3. Write your React component
4. Use `React.useState`, `React.useEffect`, etc. via the global `React` object
5. Click "Run" or press `Ctrl+S` to see your changes
6. Click "Share" to get the link or import string of your component

### Importing Components

Import any component from Nutshell using the slug format:

```typescript
import Button from "/@username/button-component";

export default function MyComponent() {
  return <Button>Click me!</Button>;
}
```

### Example Component

```typescript
import Card from "/@kpaquino2/card";

export default function Dashboard() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Card>
        <p>Count: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Increment
        </button>
      </Card>
    </div>
  );
}
```

## review Settings

Customize how your component appears in the preview:

- **Position:** Center or top-left alignment
- **Padding:** Adjust spacing around your component
- **Background:** Choose a background color for better visibility

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own learning and projects.

## Author

**Kyle Aquino**

- Website: [kyleaquino.dev](https://kyleaquino.dev)
- GitHub: [@kpaquino2](https://github.com/kpaquino2)
