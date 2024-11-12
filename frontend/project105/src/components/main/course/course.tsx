import style from "./course.module.css";
import Carousel from "./carousel";

export default function Course() {
  // 추천하는 코스들 요청하는 axios

  const images = ["1", "2", "3", "4"];

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>
          <p className={style.text1}>
            <span className={style.gtext}>대전왓슈</span> 제공
          </p>
          <p className={style.text2}>대전 여행 코스 추천 👍</p>
        </div>
        <div className={style.desc}>
          대전 인기 관광지를 기반으로 코스를 추천합니다
        </div>
      </div>
      <div className={style.carousel}>
        <div>캐러셀 들어가자</div>
        {/* <Carousel images={images} /> */}
      </div>
    </div>
  );
}
