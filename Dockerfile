# Node.js ExpressアプリをDockerで動かすためのDockerfile
# ベースイメージはnode:20-alpine、作業ディレクトリは/app
FROM node:20-alpine
WORKDIR /app

# package.jsonとindex.jsをコピー
COPY package.json .
COPY package-lock.json .
COPY index.js .

# 依存パッケージをインストール
RUN npm install

# アプリを起動
EXPOSE 3000
CMD ["node", "index.js"]

