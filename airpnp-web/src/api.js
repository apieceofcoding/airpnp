// 화면과 서버가 따로 배포되므로 서버 주소를 환경마다 지정합니다.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
