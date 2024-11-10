"use client";

import { useEffect, useState } from "react";
import style from "./likebutton.module.css";
import axios from "axios";

interface LikeButtonProps {
  articleId: number;
}

export default function LikeButton({ articleId }: LikeButtonProps) {
  // 좋아요 여부 상태
  const [isLike, setIsLike] = useState(false);

  // 로컬 스토리지에서 토큰을 가져오는 함수
  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  // 마운트 됐을 때 좋아요 하고 있는지 조회하는 요청
  const getIsLiked = async () => {
    const token = getToken();
    // console.log(token);
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/posts/read/${articleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        console.log("좋아요 여부 조회 성공", response.data.status.userLiked);
        setIsLike(response.data.status.userLiked);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 좋아요/좋아요취소 하는 요청
  const likeUnlike = async (likestatus: string) => {
    const token = getToken();
    // console.log(likestatus);
    const statusData = {
      action: likestatus,
    };
    console.log(token);
    console.log("dddddddd");
    try {
      console.log("ssssssss");
      const response = await axios.post(
        `https://k11b105.p.ssafy.io/wassu/posts/${articleId}/likes`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: statusData,
        }
      );

      if (response.data) {
        console.log("vvvvvvvvvv");
        console.log("좋아요/좋아요 취소 성공", response.data);
        setIsLike(!isLike);
      } else {
        console.log("bbbbbbbbbbbbbbb");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getIsLiked();
  }, []);

  return (
    <div>
      {!isLike ? (
        <div className={style.buttonbox}>
          <button className={style.button} onClick={() => likeUnlike("like")}>
            🤍
          </button>
        </div>
      ) : (
        <div className={style.buttonbox}>
          <button className={style.button} onClick={() => likeUnlike("unlike")}>
            ❤️
          </button>
        </div>
      )}
    </div>
  );
}
