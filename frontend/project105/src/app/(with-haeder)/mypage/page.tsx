// 아마 클라이언트 컴포넌트
"use client";

// import { useEffect } from "react";
// import axios from "axios";
import style from "./page.module.css";

export default function Page() {
  return (
    <div>
      <div className={style.navbox}>
        <div className={style.nav}>나의 여행</div>
        <div className={style.nav}>나의 기록</div>
        <div className={style.nav}>여행기</div>
      </div>
    </div>
  );
}
