import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, FreeMode } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from '../css/HomePage.module.css';

export default function ClientsCarousel({ images = [], altPrefix = 'Client' }) {
  const [activeBreakpoint, setActiveBreakpoint] = useState('base');
  const swiperRef = useRef(null);
  const frameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const directionRef = useRef(-1);
  const speedRef = useRef(80);
  const pausedRef = useRef(false);
  const manualSlides = images.length ? [...images, ...images, ...images] : [];
  const bandSize = images.length;
  const middleStartIndex = bandSize;

  const carouselBreakpoints = {
    300: { slidesPerView: 1, spaceBetween: -100 },
    400: { slidesPerView: 1, spaceBetween: -150 },
    500: { slidesPerView: 1, spaceBetween: -220 },
    600: { slidesPerView: 3, spaceBetween: 50 },
    800: { slidesPerView: 3, spaceBetween: -100 },
    1000: { slidesPerView: 4, spaceBetween: -100 },
    1200: { slidesPerView: 5, spaceBetween: 112 },
  };

  const syncActiveBreakpoint = (swiper) => {
    const bp = swiper?.currentBreakpoint;
    setActiveBreakpoint(bp && bp !== 'max' ? `${bp}px` : 'base');
  };

  const syncManualLoop = (swiper) => {
    if (!swiper || swiper.destroyed) {
      return;
    }

    swiper.updateSlidesOffset();

    if (!bandSize) {
      return;
    }

    const bandWidth = swiper.slidesGrid?.[bandSize] - swiper.slidesGrid?.[0];

    if (!bandWidth) {
      return;
    }

    if (swiper.activeIndex < bandSize) {
      swiper.setTranslate(swiper.getTranslate() - bandWidth);
    } else if (swiper.activeIndex >= bandSize * 2) {
      swiper.setTranslate(swiper.getTranslate() + bandWidth);
    }

    swiper.updateProgress();
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  };

  const stopFrame = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const stepFrame = (time) => {
    const swiper = swiperRef.current;

    if (!swiper || pausedRef.current || swiper.destroyed) {
      stopFrame();
      return;
    }

    const previousTime = lastTimeRef.current || time;
    const deltaTime = time - previousTime;
    lastTimeRef.current = time;

    const delta = directionRef.current * speedRef.current * (deltaTime / 1000);
    const nextTranslate = swiper.getTranslate() + delta;

    swiper.setTransition(0);
    swiper.setTranslate(nextTranslate);
    syncManualLoop(swiper);

    frameRef.current = requestAnimationFrame(stepFrame);
  };

  const startFrame = () => {
    if (!swiperRef.current || frameRef.current) {
      return;
    }

    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(stepFrame);
  };

  const pauseFrame = () => {
    pausedRef.current = true;
    stopFrame();
  };

  const resumeFrame = () => {
    pausedRef.current = false;
    lastTimeRef.current = performance.now();
    startFrame();
  };

  const setMotion = (nextDirection, nextSpeed) => {
    directionRef.current = nextDirection;
    speedRef.current = nextSpeed;
  };

  useEffect(() => {
    startFrame();

    return () => {
      stopFrame();
    };
  }, []);

  return (
    <div className="limitWidth">
      <h1 className={styles.clientsHeading}>Our Clients</h1>

      <div className={styles.clientsWrap}>
        <button
          className={styles.clientsPrev}
          aria-label="Previous"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setMotion(1, 500);
            resumeFrame();
          }}
          onPointerUp={() => {
            setMotion(-1, 80);
          }}
          onPointerLeave={() => {
            setMotion(-1, 80);
          }}
        >
          ‹
        </button>

        <Swiper
          modules={[A11y, FreeMode]}
          className={styles.clientsSwiper}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            syncActiveBreakpoint(swiper);
            resumeFrame();
          }}
          onBreakpoint={syncActiveBreakpoint}
          onTouchMove={() => syncManualLoop(swiperRef.current)}
          onSliderMove={() => syncManualLoop(swiperRef.current)}
          watchOverflow
          speed={0}
          freeMode={{ enabled: true, sticky: false, momentum: false, momentumBounce: false }}
          centeredSlides={true}
          slidesPerView={5}
          spaceBetween={80}
          breakpoints={carouselBreakpoints}
          initialSlide={middleStartIndex}
          onTouchStart={pauseFrame}
          onTouchEnd={resumeFrame}
          onTouchCancel={resumeFrame}
          touchEventsTarget='container'
        >
          {manualSlides.map((src, i) => (
            <SwiperSlide key={i} className={styles.clientSlide}>
              <img className={styles.clientLogo} src={src} alt={`${altPrefix} ${i + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className={styles.clientsNext}
          aria-label="Next"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setMotion(-1, 500);
            resumeFrame();
          }}
          onPointerUp={() => {
            setMotion(-1, 80);
          }}
          onPointerLeave={() => {
            setMotion(-1, 80);
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
