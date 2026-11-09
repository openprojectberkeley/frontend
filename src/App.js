import { BrowserRouter, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnimatedRoutes from './components/AnimatedRoutes';
import { isLite } from './components/liteMode';

function SnapshotRouteMarker() {
  const location = useLocation();

  return (
    <div
      data-snapshot-route={location.pathname}
      data-snapshot-lite={isLite ? '1' : '0'}
      style={{ display: 'none' }}
      aria-hidden="true"
    />
  );
}

function App() {
  return (
    <BrowserRouter>
        <SnapshotRouteMarker />
        <Header />
        <ScrollToTop>
          <AnimatedRoutes />
        </ScrollToTop>
        <Footer />
    </BrowserRouter>
  );
}

export default App;
