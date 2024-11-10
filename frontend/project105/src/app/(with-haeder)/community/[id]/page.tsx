// "use client";

import style from "./page.module.css";
import LikeButton from "../../../../components/community/likebutton";
import UpdateDelete from "@/components/community/updatedelete";
import axios from "axios";
import { ArticleData } from "@/types";

export default async function Page({
  params,
}: {
  params: { id: string | string[] };
}) {
  let article: ArticleData | null = null;
  // 게시글 상세 조회 요청 axios
  try {
    const response = await axios.get(
      `https://k11b105.p.ssafy.io/wassu/posts/read/${params.id}`
    );
    if (response.data) {
      console.log("커뮤니티 게시글 상세 조회 성공", response.data);
      article = response.data.status;
    }
  } catch (error) {
    console.error(error);
  }

  console.log(article);

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
        {/* 여기는 클라이언트 컴포넌트 */}
        <div>
          <UpdateDelete />
        </div>
      </div>
      <div>
        <img className={style.image} src={article?.images[0].url} alt="" />
      </div>
      <div className={style.descbox}>
        <div className={style.desctext}>설명</div>
        <p className={style.desc}>{article?.content}</p>
        {/* 클라이언트 컴포넌트로 작성 */}
        <div className={style.button}>
          <LikeButton articleId={article?.id ?? 0}></LikeButton>
        </div>
      </div>
    </div>
  );
}
