"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CommunityCard from "@/components/main/community/communitycard";
import style from "./page.module.css";
import { ArticleData } from "@/types";

export default function Page() {
  const [articles, setArticles] = useState<ArticleData[]>([]);

  const getArticles = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/posts/filter`
      );
      if (response.data) {
        console.log("게시글 전체 조회 성공", response.data.content);
        setArticles(response.data.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div>
      <div className={style.header}>
        <div className={style.title}>
          <div className={style.titletext1}>다양한 관광지에 대한 소감,</div>
          <div className={style.titletext2}>커뮤니티 ‍🤝‍🧑</div>
        </div>
        <p className={style.content}>
          다양한 관광지에 대한 사용자들의 후기를 접하고,
        </p>
        <p className={style.content}>다양한 방법으로 관광지를 즐겨보세요.</p>
      </div>
      <div className={style.cardcontainer}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <CommunityCard key={article.id} {...article} />
          ))
        ) : (
          <div>게시글을 불러오는 중입니다...</div>
        )}
      </div>
    </div>
  );
}
