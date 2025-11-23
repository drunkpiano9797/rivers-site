# Rivers 个人站点（前后端分离安全版）

新方案：前端 React + Vite，后端 NestJS + Prisma + PostgreSQL，文件模块可扩展为 MinIO/S3。旧的 Express 静态版仍在根目录（public/ + server.js）可参考，但推荐使用 `frontend/` + `backend/`。

## 目录
- `frontend/`：React/Vite（含页面：home/read/think/act/guest/owner/tools）
- `backend/`：NestJS + Prisma，模块：auth/posts/guest/files
- `prisma/schema.prisma`：数据模型（User、Post、GuestEntry、FileAsset）

## 后端启动
1) 进入 backend 安装依赖：
```bash
cd backend
npm install
```
2) 配置环境变量：复制 `.env.example` 为 `.env`，修改 `DATABASE_URL`、`JWT_SECRET`、`ALLOWED_ORIGINS` 等。
3) 初始化数据库：
```bash
npx prisma migrate dev --name init
npx prisma generate
```
4) 开发启动：
```bash
npm run dev
```
默认端口 `4000`。

## 前端启动
```bash
cd frontend
npm install
npm run dev
```
默认端口 `5173`，代理 `/api` 与 `/auth` 到后端 `http://localhost:4000`。

## 文件/工具页
- 后端 API（受 JWT+cookie 保护）：
  - `POST /files` 记录文件元数据（name/size/mime/checksum/isPublic）
  - `GET /files?q=` 列表
  - `DELETE /files/:id` 删除
- 需要对接对象存储：在后端新增签名上传/下载逻辑，并用 `FileAsset.bucket/objectKey` 存储。

## 安全基线
- `httpOnly` cookie JWT + JWT_SECRET
- Helmet、CSRF、中间件验证
- DTO 校验（class-validator）
- Postgres（建议开启备份），对象存储替代本地文件

## 部署提示（Linux）
- 后端：`npm run build` 后 `node dist/main.js`（或 pm2/systemd）
- 前端：`npm run build`，Nginx 静态托管 `frontend/dist`，反代 `/api`、`/auth` 到后端
- 环境变量：`DATABASE_URL`、`JWT_SECRET`、`STORAGE_*`（如使用 MinIO/S3）
