import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-lg font-bold">Chat App</Link>
        <div className="flex space-x-4">
          <Link href="/signup" className="hover:underline">Signup</Link>
          <Link href="/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
