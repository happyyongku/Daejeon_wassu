"use client";

import { useEffect, useState } from "react";
import style from "./reco.module.css";
import RecoCard from "./recocard";
import axios from "axios";

export default function Reco() {
  const [reco, setReco] = useState();

  // 대전 관광지 추천 axios 요청
  const getRecs = async () => {
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/fast_api/random_bakeries`
      );
      if (response.data) {
        console.log("추천 조회 성공", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRecs();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>
          실시간 <span className={style.green}>대전 관광지</span> 추천 🔥
        </div>
        <p className={style.desc}>인기 대전 관광지를 추천합니다</p>
      </div>
      <div className={style.recocardcontainer}>
        <RecoCard />
        <RecoCard />
        <RecoCard />
        <RecoCard />
        <RecoCard />
        <RecoCard />
        <RecoCard />
        <RecoCard />
        <RecoCard />
        <RecoCard />
      </div>
    </div>
  );
}
