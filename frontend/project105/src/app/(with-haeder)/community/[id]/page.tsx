"use client";

import { useParams } from "next/navigation"; // next/navigation에서 useParams 사용
import { useEffect, useState } from "react";
import { ArticleData } from "@/types";
import axios from "axios";
import style from "./page.module.css";

export default function Page() {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleData | null>(null);

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
      }
    } catch (error) {
      console.error("게시글 상세 조회 실패", error);
    }
  };

  // 좋아요/좋아요취소 하는 요청
  const likeUnlike = async (likestatus: string) => {
    const token = localStorage.getItem("authToken");
    const statusData = {
      action: likestatus,
    };
    console.log(token);
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

  // 마운트 됐을 때 게시글 상세 조회
  useEffect(() => {
    getArticle();
  }, []);

  // 로딩중일 때
  if (!id) {
    return <div>게시글 정보를 로딩하는 중입니다...</div>;
  }

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
        <div>{/* <UpdateDelete /> */}</div>
      </div>
      <div>
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
    </div>
  );
}
