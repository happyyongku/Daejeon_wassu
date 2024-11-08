import style from "./community.module.css";

import CommunityCard from "./communitycard";
import CommunityHeader from "./communityheader";

export default function Community() {
  return (
    <div>
      <div className={style.margin_side}>
        <CommunityHeader />
        <p className={style.text}>
          다양한 관광지에 대한 사용자들의 후기를 접하고,
        </p>
        <p className={style.text}>다양한 방법으로 관광지를 즐겨보세요.</p>
      </div>
      <div className={style.card_container}>
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
      </div>
    </div>
  );
}
