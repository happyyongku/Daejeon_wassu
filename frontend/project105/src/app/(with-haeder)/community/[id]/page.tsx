"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleData } from "@/types";
import axios from "axios";
import style from "./page.module.css";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [forLoading, setForLoading] = useState(false);

  // 모달 상태 관리
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toFix = () => {
    router.push(`/community/fix/${id}`);
  };

  // 게시글 상세 조회 요청
  const getArticle = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/posts/read/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("게시글 상세 요청 성공", response.data);
        setArticle(response.data.status);
        setForLoading(true);
      }
    } catch (error) {
      console.error("게시글 상세 조회 실패", error);
    }
  };

  // 좋아요/좋아요 취소 요청
  const likeUnlike = async (likestatus: string) => {
    const token = localStorage.getItem("authToken");
    const statusData = {
      action: likestatus,
    };

    try {
      const response = await axios.post(
        `https://k11b105.p.ssafy.io/wassu/posts/${article?.id}/likes`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: statusData,
        }
      );
      if (response.data) {
        console.log("좋아요/좋아요 취소 성공", response.data);
        getArticle();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 게시글 삭제 요청
  const remove = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `https://k11b105.p.ssafy.io/wassu/posts/${article?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("게시글 삭제 성공", response.data);
        router.push("/community"); // 삭제 후 목록 페이지로 이동
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 마운트 됐을 때 게시글 상세 조회
  useEffect(() => {
    getArticle();
  }, []);

  // 로딩중일 때
  if (!forLoading) {
    return <div>게시글 정보를 로딩하는 중입니다...</div>;
  }

  // 모달 열기
  const openModal = () => {
    setIsModalVisible(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className={style.userbox}>
        <img
          className={style.profileimagae}
          src={article?.profileImage}
          alt="profileimage"
        />
        <p className={style.username}>{article?.nickName}</p>
      </div>
      <div className={style.contentbox}>
        <div className={style.title}>{article?.title}</div>
        <p className={style.date}>{article?.createdAt}</p>
      </div>
      <div className={style.ectbox}>
        <div className={style.likenumber}>
          <p className={style.heartimg}>❤️</p>
          <p className={style.heartnumber}>{article?.liked}</p>
        </div>
        <div>
          {article?.matched ? (
            <div className={style.imgbox}>
              <img
                className={style.img1}
                src="/images/update.png"
                alt="update"
                onClick={toFix}
              />
              <img
                className={style.img2}
                src="/images/delete.png"
                alt="delete"
                onClick={openModal} // 삭제 아이콘 클릭 시 모달 열기
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>
        {/* 이미지 없으면 디폴트 이미지 출력하고, 아니면 캐러셀로 출력 */}
        <img className={style.image} src={article?.images[0].url} alt="" />
      </div>
      <div className={style.descbox}>
        <div className={style.desctext}>설명</div>
        <p className={style.desc}>{article?.content}</p>
        <div className={style.button}>
          <div>
            {!article?.userLiked ? (
              <div className={style.buttonbox}>
                <button
                  className={style.button1}
                  onClick={() => likeUnlike("like")}
                >
                  🤍
                </button>
              </div>
            ) : (
              <div className={style.buttonbox}>
                <button
                  className={style.button1}
                  onClick={() => likeUnlike("unlike")}
                >
                  ❤️
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalVisible && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <p>정말로 이 게시글을 삭제하시겠습니까?</p>
            <div className={style.modalButtons}>
              <button
                className={style.modalButton}
                onClick={remove} // 삭제 확인 시 게시글 삭제
              >
                확인
              </button>
              <button
                className={style.modalButton}
                onClick={closeModal} // 취소 시 모달 닫기
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
