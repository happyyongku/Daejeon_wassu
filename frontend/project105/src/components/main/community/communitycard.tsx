"use client";

import style from "./communitycard.module.css";
import { useRouter } from "next/navigation";

export default function CommunityCard() {
  // 일단 여기는 props로 이미 데이터를 받은 상태이다.
  const router = useRouter();
  const toDetail = () => {
    router.push(`/community/${1}`);
  };

  const image = [1, 1, 1];

  const renderImage = () => {
    switch (image.length) {
      case 0:
        return (
          <div>
            <img
              className={style.defaultimage}
              src="/images/default.png"
              alt="defaultimage"
            />
          </div>
        );
      case 1:
        return (
          <div>
            <img
              className={style.defaultimage}
              src="/images/promimage.png"
              alt="defaultimage"
            />
          </div>
        );
      case 2:
        return (
          <div className={style.imagecontainer2}>
            <img
              className={style.image2}
              src="/images/promimage.png"
              alt="defaultimage"
            />
            <img
              className={style.image2}
              src="/images/promimage.png"
              alt="defaultimage"
            />
          </div>
        );
      case 3:
        return (
          <div className={style.image34container}>
            <img
              className={style.image3}
              src="/images/promimage.png"
              alt="defaultimage"
            />
            <div className={style.image4container}>
              <img
                className={style.image4}
                src="/images/promimage.png"
                alt="defaultimage"
              />
              <img
                className={style.image4}
                src="/images/promimage.png"
                alt="defaultimage"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={style.card_container}>
      <div className={style.piccontainer}>{renderImage()}</div>
      <div className={style.profilepic}>프사</div>
      <div onClick={toDetail}>
        <div className={style.username}>노은맨</div>
        <div className={style.placename}>한밭 수목원</div>
        <div className={style.placedesc}>
          한밭 수목원 이번에 주말에 다녀왔는데 정말 재밌네요. 여러분들도 나중에
          시간 나면 친구들이랑 한번 들려보세요~ 한밭 수목원 이번에 주말에
          다녀왔는데 정말 재밌네요. 여러분들도 나중에 시간 나면 친구들이랑 한번
          들려보세요~
        </div>
      </div>
    </div>
  );
}
