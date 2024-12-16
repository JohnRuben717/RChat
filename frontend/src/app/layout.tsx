import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Chat App',
  description: 'Secure Chat Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
