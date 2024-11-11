"use client";

import style from "./page.module.css";

export default function Page() {
  const promArray = [1, 2, 3, 4];

  return (
    <div>
      <div className={style.header}>
        <div>대전 빵지순례 코스 챌린지</div>
        <div className={style.tagbox}>
          {/* 반복문 들어가야 한다. */}
          <div># 대전핫플</div>
          <div># 빵덕후</div>
          <div># 부지런한여행</div>
        </div>
      </div>
      <div className={style.imgbox}>
        <img className={style.img} src="/images/mainimage.png" alt="" />
      </div>
      <div className={style.contentbox}>
        <p className={style.content}>
          전국 팔도 빵순, 빵돌이를 위한 대전 빵지순례 코스 챌린지 입니다. 다들
          즐겁게 사용해보세용. 전국 팔도 빵순, 빵돌이를 위한 대전 빵지순례 코스
          챌린지 입니다. 다들 즐겁게 사용해보세용. 전국 팔도 빵순, 빵돌이를 위한
          대전 빵지순례 코스 챌린지 입니다. 다들 즐겁게 사용해보세용. 전국 팔도
          빵순, 빵돌이를 위한 대전 빵지순례 코스 챌린지 입니다. 다들 즐겁게
          사용해보세용.
        </p>
      </div>
      <div className={style.hr}></div>
      <div className={style.introcourse}>
        <p>코스 소개</p>
      </div>
      <div className={style.undercontainer}>
        <div className={style.backbox}>
          <img
            className={style.coursebackground}
            src="/images/coursebackground.png"
            alt=""
          />
        </div>
        <div className={style.cardcontainer}>
          <div className={style.greenline}></div>

          {/* 반복문을 돌아야 한다 */}
          {/* 코스에서 데이터를 받으면 그걸 반복 돌린다. */}
          {/* 인덱스를 기반으로 왼쪽에 출력하고 오른쪽에 출력하고 나누자. */}
          {promArray.map((item, index) => (
            // className={`${style.cardbox} ${index % 2 === 0 ? style.evenCard : style.oddCard}`}
            <div
              key={index}
              className={`${
                index % 2 === 0 ? style.leftcardbox : style.rightcardbox
              }`}
            >
              <div className={style.card}>
                <div className={style.cardheader}>
                  <div className={style.cardnumber}>{index + 1}</div>
                  <div className={style.cardtitle}>성심당</div>
                </div>
                <div>
                  <img
                    className={style.cardimg}
                    src="/images/mainimage.png"
                    alt=""
                  />
                </div>
                <div className={style.bottombox}>
                  <div>
                    <div className={style.cardtagbox}>
                      <div>#문화</div>
                      <div>#인기</div>
                    </div>
                    <div>대전광역시 대흥동 xxxxx</div>
                  </div>
                  <div className={style.monsterbox}>
                    <div className={style.wassudesc}>
                      출몰 <span className={style.gtext}>왓슈몬</span>
                    </div>
                    <img
                      className={style.wassu}
                      src="/images/wassu.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
