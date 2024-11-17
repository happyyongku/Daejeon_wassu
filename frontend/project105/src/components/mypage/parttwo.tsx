"use client";

import { useEffect, useState } from "react";
import style from "./parttwo.module.css";
import axios from "axios";

export default function PartTwo() {
  const [noStamp, setNoStamp] = useState([]);
  const [challenges, setChallenges] = useState(null);

  // 스탬프 조회
  const getStamp = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/tourist/stamp/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("스탬프 조회 성공", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getChallenge = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/fast_api/user/challenges`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("챌린지 조회 성공", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 챌린지 조회
  useEffect(() => {
    getStamp();
    getChallenge();
  }, []);

  return <div>part two</div>;
}
