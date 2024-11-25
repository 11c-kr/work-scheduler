const fs = require("fs");

// Netlify 환경변수를 읽어오는 스크립트
const envContent = `
window.ENV = {
  ACCESS_KEY: "${process.env.ACCESS_KEY}"
};
`;

// dist/env.js 파일로 저장
fs.writeFileSync("./dist/env.js", envContent, "utf8");
console.log("Netlify 환경변수 기반으로 env.js 생성 완료!");