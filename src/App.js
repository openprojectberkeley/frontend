import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import About from './components/About';
import Contact from './components/Contact';
import Apply from './components/Apply';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Resources from './components/Resources';
import CoffeeChats from "./components/CoffeeChats";
import Projects from "./components/Projects";

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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/coffeechats" element={<CoffeeChats />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </ScrollToTop>
        <Footer />
    </BrowserRouter>
  );
}

export default App;
