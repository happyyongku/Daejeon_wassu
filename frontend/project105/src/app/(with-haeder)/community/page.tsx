"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CommunityCard from "@/components/main/community/communitycard";
import style from "./page.module.css";
import { ArticleData } from "@/types";

export default function Page() {
  const [articles, setArticles] = useState<ArticleData[]>([]);

  const getArticles = async () => {
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

  console.log(articles);

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div>
      <div>전체 게시글 조회 페이지</div>
      <div>반복문으로 community card 호출</div>
      <div>
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
