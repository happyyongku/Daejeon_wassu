import { useState } from "react";
import styles from "./carousel.module.css"; // CSS 파일 임포트

interface CarouselProps {
  touristSpotImages: { imageUrl: string; imageId: number }[] | undefined; // imageId를 number로 변경
}

export default function Carousel({ touristSpotImages }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(touristSpotImages);

  // images가 undefined 또는 빈 배열일 경우 렌더링하지 않도록 처리
  if (!touristSpotImages || touristSpotImages.length === 0) {
    return <div>이미지가 없습니다.</div>;
  }

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? touristSpotImages.length - 1 : prevIndex - 1
    );
  };

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === touristSpotImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.carousel}>
      {/* 이전 버튼 */}
      {/* 조건 처리 해야한다 */}
      {touristSpotImages.length > 1 ? (
        <button
          className={`${styles.carouselButton} ${styles.carouselButtonPrev}`}
          onClick={prevSlide}
        >
          &#10094; {/* 왼쪽 화살표 */}
        </button>
      ) : (
        <></>
      )}

      {/* 슬라이드 내용 */}
      <div className={styles.carouselContent}>
        <img
          src={touristSpotImages[currentIndex].imageUrl}
          alt="dds"
          className={styles.carouselImage}
        />
      </div>

      {/* 다음 버튼 */}
      {/* 조건 처리 해야한다 */}
      {touristSpotImages.length > 1 ? (
        <button
          className={`${styles.carouselButton} ${styles.carouselButtonNext}`}
          onClick={nextSlide}
        >
          &#10095; {/* 오른쪽 화살표 */}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
