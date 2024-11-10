"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleData } from "@/types";
import axios from "axios";

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
        // setForLoading(true);
      }
    } catch (error) {
      console.error("게시글 상세 조회 실패", error);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  return <div>수정 페이지 입니다.</div>;
}
