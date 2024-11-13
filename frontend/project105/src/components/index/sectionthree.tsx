"use client";

import { useRouter } from "next/navigation";
import style from "./sectionthree.module.css";

export default function SectionThree() {
  const router = useRouter();

  const toMain = () => {
    router.push("/main");
  };

  return (
    <div className={style.page}>
      <div className={style.left}>
        <div className={style.leftcontent}>
          <div className={style.text1}>관광지 코스 추천</div>
          <p className={style.text2}>프리셋 추천과,</p>
          <p className={style.text2}>인공지능 챗봇 추천으로</p>
          <p className={style.text2}>코스 추천 받자 !</p>
          <div className={style.buttonbox}>
            <button className={style.button} onClick={toMain}>
              코스 추천받기
            </button>
          </div>
        </div>
      </div>
      <div className={style.right}>
        <div className={style.rightcontent}>
          <div className={style.righttitlebox}>
            <p className={style.righttitle}>대전 전문가가 만들어둔</p>
            <p className={style.righttitle}>
              대전 <span className={style.g}>프리셋 코스 추천</span>
            </p>
          </div>
          <div className={style.rightdescbox}>
            <p className={style.rightdesc}>
              대전 현지인, 대전 전문가들이 선정한 대전의 고나광 명소
            </p>
            <p className={style.rightdesc}>
              대전 여행 데이터를 활용하여 최고의 코스를 추천해드립니다
            </p>
            <p className={style.rightdesc}>
              다양한 테마별 코스를 추천받고 즐거운 대전여행을 즐기세요
            </p>
          </div>
          <div className={style.imgbox}>
            <div className={style.img1}>이미지 대용1</div>
            <div className={style.img2}>이미지 대용2</div>
            <div className={style.img3}>이미지 대용3</div>
          </div>
        </div>

        <div className={style.secondbox}>
          <div className={style.secondtitlebox}>
            <p className={style.righttitle}>인공지능을 활용한</p>
            <p className={style.righttitle2}>인공지능 챗봇 코스 추천</p>
          </div>
          <div className={style.seconddescbox}>
            <p className={style.rightdesc}>
              자신의 상황을 입력하고 그에 맞는 코스를
            </p>
            <p className={style.rightdesc}>인공지능을 통해 추천 받아보세요</p>
          </div>
          <div className={style.secondimgbox}>
            <div className={style.secondimg}>이미지 대용</div>
          </div>
        </div>
      </div>
    </div>
  );
}
