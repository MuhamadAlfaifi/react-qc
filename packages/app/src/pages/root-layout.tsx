import { Outlet } from 'react-router-dom';

export default function RootLayoutPage() {
  return (
    <div className="grid grid-cols-12 w-full max-w-4xl mx-auto py-10 gap-10">
      <nav className="col-span-3 border-r">
        <h1 className="font-bold text-xl">🟠 React QC</h1>
        <ul className="mt-8">
          <li>
            <a href="/">Home</a>
          </li>
        </ul>
      </nav>
      <main className="col-span-9">
        <Outlet />
      </main>
    </div>
  );
}