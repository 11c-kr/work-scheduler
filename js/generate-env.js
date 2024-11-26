const fs = require("fs");

// Netlify 환경변수를 읽어오는 스크립트
const envContent = `
window.ENV = {
  ACCESS_KEY: "${process.env.ACCESS_KEY}",
  LOCAL_END_POINT: "${process.env.LOCAL_END_POINT}",
  PROD_END_POINT: "${process.env.PROD_END_POINT}"
};
`;

// dist/env.js 파일로 저장
fs.writeFileSync("./js/env.js", envContent, "utf8");
console.log("env.js 파일이 생성되었습니다!");