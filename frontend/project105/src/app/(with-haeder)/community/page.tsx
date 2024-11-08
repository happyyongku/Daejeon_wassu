import style from "./page.module.css";
import CommunityCard from "../../../components/main/community/communitycard";
import axios from "axios";

// 타입도 가져와야 한다. import 해야한다.

export default async function Page() {
  // const response = await axios.get(
  //   `https://k11b105.p.ssafy.io/wassu/posts/filter`
  // );

  return (
    <div>
      <div className={style.title}>다양한 관광지에 대한 소감,</div>
      <div className={style.title_green}>커뮤니티 🧑‍🤝‍</div>
      <p className={style.desc}>
        다양한 관광지에 대한 사용자들의 후기를 접하고,
      </p>
      <p className={style.desc}>다양한 방법으로 관광지를 즐겨보세요.</p>

      <div className={style.card_container}>
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
      </div>
    </div>
  );
}
