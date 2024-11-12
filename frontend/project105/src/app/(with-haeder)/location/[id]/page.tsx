"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LocationData } from "@/types";
import axios from "axios";
import style from "./page.module.css";
import Comment from "@/components/location/comment";
import UseApp from "@/components/useapp";

export default function Page() {
  const { id } = useParams();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setLocation(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 장소 찜하기 axios 요청
  const jjimLoca = async () => {
    const token = localStorage.getItem("authToken");
    const idid = 1138;
    console.log(token);
    try {
      const response = await axios.post(
        `https://k11b105.p.ssafy.io/wassu/tourist/${idid}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("찜하기 성공", response.data);
        getDetail();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 장소 찜하기 취소 axios 요청
  const unJjimLoca = async () => {
    const token = localStorage.getItem("authToken");
    const idid = 1138;
    try {
      const response = await axios.delete(
        // `https://k11b105.p.ssafy.io/wassu/tourist/${id}/favorite`,
        `https://k11b105.p.ssafy.io/wassu/tourist/${idid}/favorite`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("찜 취소하기 성공", response.data);
        getDetail();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  // 모달 열기 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={style.header}>
        <div className={style.title}>{location?.spotName}</div>
        <div className={style.iconbox}>
          <img className={style.icon} src="/images/pencil.png" alt="" />
          <div className={style.icontext}>{location?.reviewCount}</div>
          <img className={style.icon} src="/images/heart.png" alt="" />
          <div className={style.icontext}>{location?.favoritesCount}</div>
        </div>
        <div className={style.locationbox}>
          <img
            className={style.locationicon}
            src="/images/location.png"
            alt=""
          />
          <div className={style.location}>{location?.spotAddress}</div>
        </div>
      </div>
      <div>
        <img className={style.locaimg} src="/images/building.png" alt="" />
      </div>
      {/* 여기에 상호작용 들어가자 클라이언트 컴포넌트 */}
      <div>
        <div className={style.container1}>
          {/* 찜하기 조건 처리 해서 좋아요 기능 구현 */}
          <div className={style.box1}>
            {location?.favorite ? (
              <div onClick={unJjimLoca}>
                <img
                  className={style.icon1}
                  src="/images/jjimed.png"
                  alt="jjim"
                />
                <p className={style.text1}>찜취소</p>
              </div>
            ) : (
              <div onClick={jjimLoca}>
                <img
                  className={style.icon1}
                  src="/images/jjim.png"
                  alt="jjim"
                />
                <p className={style.text1}>찜하기</p>
              </div>
            )}
          </div>
          <div className={style.box1}>
            <img
              className={style.icon1}
              src="/images/calin.png"
              alt="calin"
              onClick={openModal}
            />
            <p className={style.text1}>일정추가</p>
          </div>
          <div className={style.box1} onClick={openModal}>
            <img className={style.icon1} src="/images/star.png" alt="star" />
            <p className={style.text1}>리뷰쓰기</p>
          </div>
          <div className={style.box1} onClick={openModal}>
            <img className={style.icon1} src="/images/stamp.png" alt="stamp" />
            <p className={style.text1}>스탬프</p>
          </div>
        </div>
      </div>
      <div className={style.br}></div>

      {isModalOpen && <UseApp onClose={closeModal} />}

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
              {location?.businessHours !== "정보 없음" ? (
                <div>
                  {" "}
                  {location?.businessHours.split("|").map((day, index) => (
                    <p key={index} className={style.catedesctext}>
                      {day}
                    </p>
                  ))}
                </div>
              ) : (
                <div className={style.catedesctext}>정보 없음</div>
              )}
            </div>
          </div>
          <div>
            <div className={style.catetitle}>
              <img className={style.cateicon} src="/images/tele.png" alt="" />
              <p className={style.catetext}>전화번호</p>
            </div>
            <div className={style.catedesc}>
              {location?.phone !== "정보 없음" ? (
                <p className={style.catedesctext}>{location?.phone}</p>
              ) : (
                <p className={style.catedesctext}>정보 없음</p>
              )}
            </div>
          </div>
          <div>
            <div className={style.catetitle}>
              <img className={style.cateicon} src="/images/loca.png" alt="" />
              <p className={style.catetext}>위치</p>
            </div>
            <div className={style.catedesc}>
              <p className={style.catedesctext}>{location?.spotAddress}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={style.maindesccontainer}>
        <div>
          <div className={style.detailtext}>설명</div>
        </div>
        <p className={style.catedesctext1}>{location?.spotDescription}</p>
      </div>
      <div>
        <div className={style.detailcontainer}>
          <div>
            <div className={style.detailtext}>방문후기</div>
          </div>
          <div className={style.commentcontainer}>
            {location?.reviews.map((review, index) => (
              <Comment key={review.reviewId} {...review} />
            ))}
            <button className={style.more}>더보기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
