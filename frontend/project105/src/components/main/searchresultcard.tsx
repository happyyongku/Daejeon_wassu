import style from "./searchresultcard.module.css";

export default function SearchResultCard() {
  return (
    <div className={style.cardcontainer}>
      <div className={style.contentbox}>
        <img className={style.img} src="/images/mainimage.png" alt="" />
        <div className={style.textcontainer}>
          <p className={style.placetitle}>성심당 케익부띠끄</p>
          <p className={style.placedesc}>
            성심당(聖心堂)은 대전광역시의 향토기업인 로쏘 주식회사가
            운영하는 제과점으로, 대전광역시 중구 은행동에 본점을 두고 있다.
            업종은 빵류 제조업, 대표이사는 임영진(세례명 요셉)[5]이며, 그의
            배우자 김미진 이사(세례명 아녜스)[6]와 함께 경영한다.
          </p>
          <div className={style.iconbox}>
            <img className={style.icon} src="/images/pencil.png" alt="" />
            <div className={style.iconnumber}>105</div>
            <img className={style.icon} src="/images/heart.png" alt="" />
            <div className={style.iconnumber}>534</div>
          </div>
          <div className={style.location}>대전 노은동 483-9</div>
        </div>
      </div>
      <div className={style.br}></div>
    </div>
  );
}
