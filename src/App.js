import { BrowserRouter, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnimatedRoutes from './components/AnimatedRoutes';

function SnapshotRouteMarker() {
  const location = useLocation();

  return <div data-snapshot-route={location.pathname} style={{ display: 'none' }} aria-hidden="true" />;
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
