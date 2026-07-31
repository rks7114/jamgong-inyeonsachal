import { defineConfig } from "vite";

// 이 저장소는 조금 특이하다. vercel.json 이 buildCommand 를 "echo skip" 으로
// 두고 outputDirectory 를 dist 로 잡는다 — 배포는 빌드를 돌리지 않고
// **깃에 올라간 dist/ 를 그대로** 내보낸다. 그래서 dist 는 산출물 폴더이면서
// 동시에 배포되는 실물이다.
//
// 기본값(emptyOutDir: true)이면 vite 가 dist 를 통째로 비운다. 그런데 vite 가
// 다시 만들어 주는 것은 index.html 과 assets 뿐이라, SPA 가 실행 중에 불러오는
// page-*.html 33개와 이미지·manifest 가 사라진다. 사이트가 깨진다.
//
// 그래서 비우지 않는다. 낡은 해시 파일이 쌓이는 대신 사이트가 안 깨진다.
// 쌓인 것은 가끔 손으로 정리하면 된다.
export default defineConfig({
  build: { emptyOutDir: false },
});
