"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import style from "./page.module.css";
import Buttons from "../../../../components/location/buttons";
import Review from "../../../../components/location/review";

export default function Page() {
  const { id } = useParams();

  // 장소 디테일 호출 axios 함수
  const getDetail = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/tourist/details/d60696b9-aa39-4449-ade7-dfa520d70cec`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("장소 상세 조회 성공", response.data);
      } else {
        console.log("dddd");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <div>
      <div className={style.header}>
        <div className={style.title}>성심당 케잌부띠끄</div>
        <div className={style.iconbox}>
          <img className={style.icon} src="/images/pencil.png" alt="" />
          <div className={style.icontext}>105</div>
          <img className={style.icon} src="/images/heart.png" alt="" />
          <div className={style.icontext}>534</div>
        </div>
        <div className={style.locationbox}>
          <img
            className={style.locationicon}
            src="/images/location.png"
            alt=""
          />
          <div className={style.location}>대전 중구 대종로 480</div>
        </div>
      </div>
      <div>
        <img className={style.locaimg} src="/images/building.png" alt="" />
      </div>
      {/* 여기에 상호작용 들어가자 클라이언트 컴포넌트 */}
      <div>
        <Buttons />
      </div>
      <div className={style.br}></div>

      {/* 상세 정보 영역 */}
      <div>
        <div className={style.detailcontainer}>
          <div className={style.detailtext}>상세정보</div>
          <div>
            <div className={style.catetitle}>
              <img className={style.cateicon} src="/images/clock.png" alt="" />
              <p className={style.catetext}>영업시간</p>
            </div>
            <div className={style.catedesc}>
              <p className={style.catedesctext}>월 : 09:00 ~ 20:00</p>
              <p className={style.catedesctext}>화 : 휴무</p>
              <p className={style.catedesctext}>수 : 09:00 ~ 20:30</p>
              <p className={style.catedesctext}>목 : 09:00 ~ 20:30</p>
              <p className={style.catedesctext}>금 : 09:00 ~ 20:30</p>
              <p className={style.catedesctext}>토 : 09:00 ~ 21:00</p>
              <p className={style.catedesctext}>일 : 09:00 ~ 21:00</p>
            </div>
          </div>
          <div>
            <div className={style.catetitle}>
              <img className={style.cateicon} src="/images/tele.png" alt="" />
              <p className={style.catetext}>전화번호</p>
            </div>
            <div className={style.catedesc}>
              <p className={style.catedesctext}>042-123-9876</p>
            </div>
          </div>
          <div>
            <div className={style.catetitle}>
              <img className={style.cateicon} src="/images/loca.png" alt="" />
              <p className={style.catetext}>위치</p>
            </div>
            <div className={style.catedesc}>
              <p className={style.catedesctext}>대전 중구 대종로 480</p>
            </div>
          </div>
        </div>
      </div>
      <div className={style.maindesccontainer}>
        <div>
          <div className={style.detailtext}>설명</div>
        </div>
        <p className={style.catedesctext1}>
          한밭 수목원입니다. 이곳은 자연 카테고리에 속하며 모든 사람들이
          편안하게 와서 휴식하다가 가면 되는 대전의 유명 관광 코스 중
          하나입니다. 편하게 와서 쉬다가 가면 될 것 같습니다. 한밭 수목원입니다.
          이곳은 자연 카테고리에 속하며 모든 사람들이 편안하게 와서 휴식하다가
          가면 되는 대전의 유명 관광 코스 중 하나입니다. 편하게 와서 쉬다가 가면
          될 것 같습니다.한밭 수목원입니다. 이곳은 자연 카테고리에 속하며 모든
          사람들이 편안하게 와서 휴식하다가 가면 되는 대전의 유명 관광 코스 중
          하나입니다. 편하게 와서 쉬다가 가면 될 것 같습니다. 한밭 수목원입니다.
          이곳은 자연 카테고리에 속하며 모든 사람들이 편안하게 와서 휴식하다가
          가면 되는 대전의 유명 관광 코스 중 하나입니다. 편하게 와서 쉬다가 가면
          될 것 같습니다.
        </p>
      </div>
      <div>
        <div className={style.detailcontainer}>
          <div>
            <div className={style.detailtext}>방문후기</div>
          </div>
          <div>
            <Review />
          </div>
        </div>
      </div>
    </div>
  );
}
