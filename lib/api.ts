// 统一管理后端API地址，支持本地开发和线上部署自动切换
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

export default API_BASE_URL;
