import style from "./recocard.module.css";

export default function RecoCard() {
  return (
    <div className={style.card}>
      <div className={style.number}>1</div>
      <div>
        <div className={style.title}>성심당</div>
        <div className={style.desc}>
          대전의 유명한 빵집. 다들 와서 한입 맛보고 즐기...
        </div>
        <div className={style.iconbox}>
          <img className={style.icon} src="/images/pencil.png" alt="" />
          <p className={style.icontext}>105</p>
          <img className={style.icon} src="/images/heart.png" alt="" />
          <p className={style.icontext}>534</p>
        </div>
        <div className={style.address}>대전 노은동 463-3</div>
      </div>
      <img className={style.img} src="/images/bread.png" alt="" />
    </div>
  );
}
