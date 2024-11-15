// 아마 클라이언트 컴포넌트
"use client";

import { useState } from "react";
// import { useEffect } from "react";
// import axios from "axios";
import style from "./page.module.css";
import PartOne from "@/components/mypage/partone";

export default function Page() {
  const [activeButton, setActiveButton] = useState<number | null>(1);

  // 버튼 클릭 시 활성화 상태 변경
  const handleButtonClick = (buttonNumber: number) => {
    setActiveButton(buttonNumber);
  };

  const renderImage1 = () => {
    switch (activeButton) {
      case 1:
        return (
          <div className={style.img1}>
            <PartOne />
          </div>
        );
      case 2:
        return <div className={style.img1}>이미지 2</div>;
      case 3:
        return <div className={style.img1}>이미지 3</div>;
      case 4:
        return <div className={style.img1}>이미지 4</div>;
      default:
        return <div className={style.img1}>기본 이미지</div>; // 기본 이미지
    }
  };

  return (
    <div>
      <div className={style.navbox}>
        <div className={style.nav} onClick={() => handleButtonClick(1)}>
          나의 여행
        </div>
        <div className={style.nav} onClick={() => handleButtonClick(2)}>
          나의 기록
        </div>
        <div className={style.nav} onClick={() => handleButtonClick(3)}>
          여행기
        </div>
      </div>
      <div>{renderImage1()}</div>
    </div>
  );
}
