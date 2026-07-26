import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-case-black w-full max-w-full relative">
      <Navbar />
      <main className="flex-1 w-full max-w-full relative">{children}</main>
      <Footer />
    </div>
  );
}
