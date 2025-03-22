import Image from 'next/image';
import './globals.css';

export const metadata = {
  title: 'Resulta - ACME',
  description: 'ACME Sports',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <header className="header">
          <div className="logoContainer">
            <Image
              src="/logo.png"
              alt="ACME Logo"
              width={80}
              height={35}
              priority // Ensures the logo is loaded as a priority
            />
            <p className="brandName">ACME</p>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}