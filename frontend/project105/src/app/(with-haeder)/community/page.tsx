// "use client";

import style from "./page.module.css";
import CommunityCard from "../../../components/main/community/communitycard";
import axios from "axios";
import { ArticleData } from "@/types";

export default async function Page() {
  // 게시글 변수
  let articles: ArticleData[] = [];

  // 게시글 호출 axios
  try {
    const response = await axios.get(
      `https://k11b105.p.ssafy.io/wassu/posts/filter`
    );

    if (response.data) {
      console.log("게시글 조회 성공", response.data);
      articles = response.data.content;
    }
  } catch (error) {
    console.error(error);
  }

  // console.log(articles);

  return (
    <div>
      <div className={style.title}>다양한 관광지에 대한 소감,</div>
      <div className={style.title_green}>커뮤니티 🧑‍🤝‍</div>
      <p className={style.desc}>
        다양한 관광지에 대한 사용자들의 후기를 접하고,
      </p>
      <p className={style.desc}>다양한 방법으로 관광지를 즐겨보세요.</p>

      <div className={style.card_container}>
        {articles.map((article) => (
          <CommunityCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
}
