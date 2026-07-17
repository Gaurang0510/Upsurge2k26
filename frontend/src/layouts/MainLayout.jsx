import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-case-black">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
