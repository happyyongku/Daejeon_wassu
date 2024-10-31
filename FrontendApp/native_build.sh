#!/bin/bash

# 1. 이미지 이름과 Dockerfile 경로 설정
IMAGE_NAME="react-native"
DOCKERFILE_PATH="."

# 2. 기존 이미지가 있으면 삭제
if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" != "" ]]; then
  echo "기존 이미지 삭제 중: $IMAGE_NAME"
  docker rmi -f $IMAGE_NAME
fi

# 3. Docker 이미지 빌드
echo "Docker 이미지 빌드 시작: $IMAGE_NAME"
sudo docker build --no-cache -t $IMAGE_NAME $DOCKERFILE_PATH

# 4. 빌드 완료 메시지 출력
if [[ $? -eq 0 ]]; then
  echo "$IMAGE_NAME 빌드 성공"
else
  echo "$IMAGE_NAME 빌드 실패"
  exit 1
fi