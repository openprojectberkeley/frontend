import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from '../css/HomePage.module.css';

export default function ClientsCarousel({ images = [], altPrefix = 'Client' }) {
  const prevSel = `.${styles.clientsPrev}`;
  const nextSel = `.${styles.clientsNext}`;

  return (
    <section className={styles.clientsSection}>
      <div className="limitWidth">
        <h2 className={styles.clientsHeading}>Our Clients</h2>

        <div className={styles.clientsWrap}>
          <button className={styles.clientsPrev} aria-label="Previous">‹</button>

          <Swiper
            modules={[Navigation, Autoplay, A11y]}
            className={styles.clientsSwiper}
            navigation={{ prevEl: prevSel, nextEl: nextSel }}
            loop={images.length > 4}
            watchOverflow
            autoplay={{ delay: 3500, pauseOnMouseEnter: true, disableOnInteraction: true }}
            centeredSlides={false}
            slidesPerView={4}
            spaceBetween={80}
            breakpoints={{
            0:    { slidesPerView: 1.8, spaceBetween: 20 },
            560:  { slidesPerView: 2,   spaceBetween: 32 },
            860:  { slidesPerView: 3,   spaceBetween: 48 },
            1100: { slidesPerView: 4,   spaceBetween: 72 },
            1400: { slidesPerView: 4,   spaceBetween: 96 },
            }}
          >
            {images.map((src, i) => (
              <SwiperSlide key={i} className={styles.clientSlide}>
                <img className={styles.clientLogo} src={src} alt={`${altPrefix} ${i + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button className={styles.clientsNext} aria-label="Next">›</button>
        </div>
      </div>
    </section>
  );
}
