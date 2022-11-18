import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import About from './components/About';
import Contact from './components/Contact';
import Apply from './components/Apply';
import Footer from './components/Footer';

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <div className={styles.content}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
