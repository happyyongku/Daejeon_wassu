# 1. Node.js 이미지 사용
FROM node:14 as builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. 애플리케이션 빌드
RUN npm run build

# 6. 애플리케이션 시작
CMD ["npm", "start"]
