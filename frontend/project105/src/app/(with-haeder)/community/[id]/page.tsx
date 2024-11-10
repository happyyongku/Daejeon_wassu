"use client";

import { useParams } from "next/navigation"; // next/navigation에서 useParams 사용
import axios from "axios";
import { useEffect } from "react";

export default function Page() {
  const { id } = useParams();

  const getArticle = async () => {
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/posts/read/${id}`
      );
      if (response.data) {
        console.log("게시글 상세 요청 성공", response.data);
      }
    } catch (error) {
      console.error("게시글 상세 조회 실패", error);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  if (!id) {
    return <div>게시글 정보를 로딩하는 중입니다...</div>;
  }

  return (
    <div>
      <h1>게시글 상세 페이지</h1>
      <p>게시글 ID: {id}</p>
    </div>
  );
}
