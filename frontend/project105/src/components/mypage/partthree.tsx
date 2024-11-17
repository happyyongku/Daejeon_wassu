"use client";

import { useEffect, useState } from "react";
import { ArticleData } from "@/types";
import style from "./partthree.module.css";
import axios from "axios";

export default function PartThree() {
  // 내가 작성한 게시글
  const [articles, setArticles] = useState<ArticleData[]>([]);

  const getMyArticle = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/user/article`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("내 게시글 조회 성공", response.data);
        setArticles(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyArticle();
  }, []);

  return (
    <div>
      <h2>내가 작성한 게시글</h2>
      {/* 조건부 렌더링 */}
      {articles.length > 0 ? (
        <div>
          {articles.map((item, index) => (
            <div key={index}>
              {item.images.length > 0 ? (
                <img src={item.images[0].url} alt="" />
              ) : (
                <></>
              )}

              <div>{item.title}</div>
              <div>{item.createdAt}</div>
              <div>{item.liked}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>게시글이 없습니다.</p> // 배열이 비어있을 경우 메시지 출력
      )}
    </div>
  );
}
