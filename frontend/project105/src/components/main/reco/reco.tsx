import style from "./reco.module.css";

import RecoCard from "./recocard";

export default function Reco() {
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
