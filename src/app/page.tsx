import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-main p-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Your Therapy Diary</h1>
        <p className="text-lg md:text-xl text-text-light mb-8">A safe space to reflect and grow.</p>
        <Link href="/new">
          <button className="bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-lg">
            Create New Diary
          </button>
        </Link>
      </div>
    </main>
  );
}
