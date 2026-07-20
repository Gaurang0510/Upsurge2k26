import MainLayout from './layouts/MainLayout.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import SmoothScroll from './components/common/SmoothScroll.jsx';

export default function App() {
  return (
    <SmoothScroll>
      <MainLayout>
        <ScrollToTop />
        <AppRoutes />
      </MainLayout>
    </SmoothScroll>
  );
}
