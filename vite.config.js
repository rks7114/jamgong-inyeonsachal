import { defineConfig } from "vite";

// dist/에는 빌드 산출물 외에 라이브 자산(page-*.html, 음원, dist/dist/ 등)이 커밋되어 있고
// Vercel이 dist/를 그대로 서빙한다 (CLAUDE.md 배포 모델 참고).
// 기본값(emptyOutDir: true)은 빌드 시 이 자산들을 전부 삭제하므로 반드시 꺼야 한다.
export default defineConfig({
  build: {
    emptyOutDir: false,
  },
});
