## Tiger Sound Pad
<img width="656" height="869" alt="스크린샷 2026-02-14 오전 11 24 53" src="https://github.com/user-attachments/assets/536d6515-a515-4932-9866-3976674f4cf5" />

간단한 사운드 패드를 제공하는 React + Vite 기반 앱입니다. 각 패드에는 라벨과 아이콘, 오디오를 연결할 수 있으며, 드래그해서 순서를 바꾸거나 삭제할 수 있습니다.

## 개발 서버 실행

```bash
npm install
npm run dev
```

기본적으로 `http://localhost:3000` 에서 앱을 확인할 수 있습니다(일반적인 Vite 기본 포트).

## Playwright E2E 테스트

```bash
npm install
npm run test:e2e:install
npm run test:e2e
```

- Playwright는 `vite build` 결과물을 `vite preview`로 띄운 뒤 `http://127.0.0.1:4173/tiger-sound-pad/` 경로에서 테스트를 실행합니다.
- 기본 시나리오는 앱 로드, 패드 추가, 패드 재생 상태, 패드 삭제, 패드 재정렬입니다.
- 일부 Linux 환경에서는 브라우저 시스템 라이브러리가 없어서 `npm run test:e2e` 가 바로 실패할 수 있습니다.
- 실패 시 로컬에서는 `playwright-report/`, `test-results/` 에 리포트와 디버그 산출물이 생성됩니다.

### Ubuntu 24.04 로컬 의존성 설치

Ubuntu 최소 설치 환경에서는 Chromium 실행에 필요한 시스템 라이브러리가 빠져 있을 수 있습니다. 이 경우 아래 둘 중 하나를 사용합니다.

1. Playwright가 시스템 패키지까지 함께 설치하도록 실행

```bash
sudo npm run test:e2e:install:full
```

2. 시스템 라이브러리만 먼저 설치한 뒤 브라우저 설치

```bash
sudo npm run test:e2e:install:deps
npm run test:e2e:install
```

Playwright가 Ubuntu 24.04에서 요구한 패키지 목록은 아래와 같습니다.

```bash
sudo apt-get update && sudo apt-get install -y --no-install-recommends \
  libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64 libatspi2.0-0t64 \
  libcairo2 libcups2t64 libdbus-1-3 libdrm2 libgbm1 libglib2.0-0t64 \
  libnspr4 libnss3 libpango-1.0-0 libx11-6 libxcb1 libxcomposite1 \
  libxdamage1 libxext6 libxfixes3 libxkbcommon0 libxrandr2 xvfb \
  fonts-noto-color-emoji fonts-unifont libfontconfig1 libfreetype6 \
  xfonts-cyrillic xfonts-scalable fonts-liberation fonts-ipafont-gothic \
  fonts-wqy-zenhei fonts-tlwg-loma-otf fonts-freefont-ttf
```

현재 CI는 GitHub 호스티드 Ubuntu 러너에서 `npx playwright install --with-deps chromium` 를 사용하므로, 로컬의 sudo 제한과 별개로 시스템 의존성까지 포함해 검증을 수행합니다.

## 주요 기능

- **패드 추가**: `Add New Pad` 버튼으로 새 패드를 추가합니다.
- **드래그로 순서 변경**: 패드를 드래그하여 가로로 정렬된 리스트의 순서를 바꿀 수 있습니다.
- **패드 삭제 (휴지통 드롭)**:
  - 화면 우상단에 둥근 **휴지통 아이콘**이 표시됩니다.
  - 삭제하고 싶은 패드를 드래그해서 휴지통 위로 가져가면, 브라우저의 기본 **확인/취소 다이얼로그**가 뜹니다.
  - `확인`을 누르면:
    - 해당 패드가 화면과 상태(Zustand 스토어)에서 제거되고,
    - 패드에 연결되어 있던 IndexedDB의 오디오 Blob도 함께 삭제됩니다.

## 기술 스택

- React
- Vite
- Zustand (상태 관리)
- @dnd-kit (드래그 앤 드롭)
- Howler (오디오 재생)
- idb-keyval (IndexedDB 접근)

## 배포

          +--------------------+
          | PR / main 브랜치    |  ← 개발자 코드 push
          +--------------------+
                     |
                     | GitHub Actions
                     v
          +--------------------+
          | Validate job       |
          | npm ci             |
          | npm run build      |
          | playwright test    |
          +--------------------+
                     |
                     | 성공 시에만 dist 아티팩트 전달
                     v
          +--------------------+
          | Deploy job         |
          | gh-pages 브랜치     |
          +--------------------+
                     |
                     | GitHub Pages 설정
                     | (Source: gh-pages / root)
                     v
          +--------------------+
          |   실제 웹사이트     |  ← 배포 완료
          +--------------------+

- `pull_request` 와 `main` push 모두 Playwright 검증을 실행합니다.
- `main` 브랜치 배포는 Playwright 검증이 통과한 경우에만 실행됩니다.
- GitHub Actions 실패 시 `playwright-artifacts` 아티팩트에서 HTML 리포트와 실패 디버그 파일을 확인할 수 있습니다.
