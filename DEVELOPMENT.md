# DEVELOPMENT.md — Workbench 진행상황

> 두 PC(예: 집/학교) 사이 작업 동기화용 기록 파일입니다.
> **작업을 끝낼 때마다 이 파일을 업데이트**하고 커밋하세요.

## 현재 상태
- 다크 테마로 전면 리디자인 완료. 프로젝트 상세페이지에 데모(iframe) + 개발 후기(devlog) 구조 추가.
- 프로젝트 6개 등록: 픽셀아트(외부 링크), 릴레이뽑기, 속닥속닥, 자리바꾸기, ROCK ATLAS(외부 링크), 끝말잇기(Firebase 대결 모드 포함) — 전부 실제 데모/후기 있음.
- GitHub 원격 저장소 연결 완료: https://github.com/kinggodyoung5/kinggodsoft (branch: main)
- Vercel 배포 완료 및 실사용 확인: https://kinggodsoft-kinggodyoung.vercel.app (Deployment Protection 해제해서 로그인 없이 접속 가능)
- **브라우저 devlog 편집 기능 정상 작동 확인됨**: 상세페이지 "편집" 버튼 → 비밀번호 입력 → 저장하면 GitHub에 직접 커밋됨 (`api/save-post.js`). `EDIT_PASSWORD`/`GITHUB_TOKEN` 환경변수 설정 완료 상태 (실제 커밋 이력으로 확인됨).

## 완료 항목
- [x] 폴더 구조 생성 (edu-hub/, assets/, projects/, web/)
- [x] 다크 테마 리디자인 (이모지 제거, 넘버링/얇은 보더/포인트 컬러 기반, rockatlas 스타일 참고)
- [x] assets/projects.js 로 카드 데이터 분리 (카테고리/이름/설명/난이도 관리 용이)
- [x] 프로젝트 상세페이지 구조 (`projects/<id>/index.html` + `demo.html` + `post.md`)
  - `index.html` : 공용 스크립트(assets/project-page.js)가 자동으로 내용을 채움 (건드릴 필요 없음)
  - `demo.html`  : 실제 결과물(시연용 HTML) — iframe으로 상세페이지에 임베드됨
  - `post.md`    : 개발 후기 글 (마크다운, 텍스트 에디터로 바로 편집 가능)
- [x] `projects/_template/` 새 프로젝트 만들 때 복사해서 쓰는 템플릿
- [x] .gitignore, git init
- [x] 로컬 서버 실행 확인 (Python 미설치 환경이라 PowerShell 임시 서버로 대체 확인, 실제로는 `python -m http.server` 사용)

## 진행 중
- (여기에 지금 작업 중인 항목을 적으세요)

## 다음 할 일
- [ ] web/ 폴더에 큰 웹 프로젝트 추가 (또는 필요 없다면 폴더 정리)
- [ ] 새 프로젝트가 계속 늘어나면 아래 "구조 논의" 섹션의 `type` 필드 도입 검토

## 주의사항
- 카드 내용(제목/설명/난이도/카테고리/경로) 수정은 **`assets/projects.js`만 편집**하면 됩니다. `index.html`은 데이터를 읽어서 자동으로 렌더링하므로 건드릴 필요 없음.
- 새 프로젝트 추가 절차:
  1. `assets/projects.js`의 `PROJECTS` 배열에 항목 추가 (id는 폴더명과 동일하게)
  2. `projects/_template/` 폴더를 `projects/<id>/`로 복사
  3. 복사한 `index.html`의 `PROJECT_ID` 값을 새 id로 변경
  4. `demo.html`을 실제 결과물로 교체 (또는 그대로 두면 "데모 준비중" 표시)
  5. `post.md`에 개발 후기 작성
- 카테고리 순서를 바꾸고 싶으면 `assets/projects.js`의 `CATEGORY_ORDER` 배열만 수정.
- `post.md`는 `fetch`로 불러오기 때문에 `file://`로 직접 열면 안 보일 수 있음 — 로컬 확인은 반드시 `python -m http.server` 등 로컬 서버를 통해서 할 것. Vercel/GitHub Pages처럼 실제 서버로 배포하면 정상 동작.
- 두 PC에서 작업할 때는 시작 전 `git pull`, 끝날 때 `git push` 습관화.
- 다른 PC에서 처음 이어받을 때: `git clone https://github.com/kinggodyoung5/kinggodsoft.git` 후 이 파일(DEVELOPMENT.md)의 "다음 할 일"부터 확인.

## 배포 (Vercel)
- 배포 URL: **https://kinggodsoft-kinggodyoung.vercel.app**
- 정적 사이트라 빌드 설정 없음 (Framework Preset: Other).
- `main` 브랜치에 `git push`할 때마다 Vercel이 자동으로 재배포함.
- Deployment Protection을 껐기 때문에 로그인 없이 누구나 접속 가능 — 완전히 비공개로 두고 싶다면 Vercel 대시보드(Settings → Deployment Protection)에서 다시 켤 것.

## 브라우저 편집 기능 설정 (devlog 직접 수정)
상세페이지에서 "편집" 버튼으로 post.md를 코드 없이 바로 고칠 수 있는 기능. 동작 원리:
비밀번호와 GitHub 토큰은 브라우저로 절대 전달되지 않고, `api/save-post.js`(Vercel 서버리스 함수) 안에서만 사용됨.

**최초 1회, 사람이 직접 해야 하는 설정 (Claude가 대신 못 함 — 계정/시크릿 관련):**
1. GitHub에서 Fine-grained Personal Access Token 발급
   - github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token
   - Repository access: **kinggodsoft 저장소만 선택** (전체 저장소 접근 금지)
   - Permissions: **Contents = Read and write** 만 체크
2. Vercel 프로젝트 → Settings → Environment Variables 에 추가
   - `GITHUB_TOKEN` = 위에서 발급받은 토큰
   - `EDIT_PASSWORD` = 편집 시 사용할 비밀번호 (원하는 걸로 직접 설정)
   - 저장 후 Deployments 탭에서 Redeploy 한 번 해줘야 반영됨
3. 이후 상세페이지 devlog의 "편집" 버튼 → 내용 수정 → 비밀번호 입력 → 저장을 누르면 GitHub에 커밋되고 Vercel이 자동 재배포함.

주의: 비밀번호는 평문 비교 방식이라 아주 강력한 보안은 아님 — 개인용 사이트 수준에서만 사용할 것. 더 강한 보안이 필요하면 GitHub OAuth 로그인 방식(예: Decap CMS)으로 교체 고려.

## 구조 논의 — 범용 개인 허브로 확장 시 재검토할 것

**목표**: 이 사이트를 "앞으로 할 모든 개발·외부활동을 링크·삽입하는 개인 포트폴리오 허브"로 키울 예정. 지금(교육용 도구 4개 + 취미용 개발 1개) 구조가 그 목표에 맞는지 점검한 기록. **지금 당장 손대지 않고, 항목이 계속 늘어나거나 아래 증상이 실제로 아파올 때 다시 이 섹션을 보고 판단할 것.**

**지금 구조가 이미 전제하고 있는 것** (`assets/projects.js`의 `PROJECTS` 배열 하나가 전부를 담당):
- 모든 항목은 "내가 만든 도구"라고 가정 → `difficulty`(초급/중급/고급) 필드가 강제됨. 발표·수상·외부 기고 같은 "활동"에는 난이도 개념 자체가 없어서 억지로 채워야 함.
- 모든 항목은 `projects/<id>/index.html + demo.html + post.md` 세 파일 세트를 강제함. 외부 링크 하나만 걸면 되는 항목에도 폴더 풀세트가 필요함.
- "임베드된 실제 도구"(릴레이뽑기·속닥속닥·자리바꾸기)와 "외부 링크만 거는 항목"(픽셀아트·ROCK ATLAS)을 구분하는 데이터 필드가 없음 — `demo.html` 안에 뭐가 들었는지 열어봐야 구분됨.
- 오버뷰 카드 + 라이브 미리보기(iframe 스케일) 패턴이 `projects/pixelart/demo.html`, `projects/rockatlas/demo.html` 두 곳에 그대로 복붙돼 있음. 같은 패턴을 쓰는 3번째 항목이 생기면 중복이 더 늘어남.

**필요해지면 할 것 (우선순위 순)**:
1. `projects.js` 각 항목에 `type` 필드 추가 (`"tool"` | `"link"` | `"activity"` 등). `project-page.js`가 이 값을 보고 레이아웃을 분기하도록.
2. 오버뷰 카드+라이브 미리보기 CSS/JS를 공용 스크립트로 추출 (지금처럼 파일마다 복붙 금지).
3. 폴더 3종 세트 없이 `projects.js`에 `{ type: "activity", title, description, externalUrl }` 정도만으로 카드가 뜨는 가벼운 항목 타입 추가 (발표·수상·외부 기고용).
4. `difficulty`를 선택 필드로 바꿔서, 도구가 아닌 항목엔 안 보이게.

**아직 안 해도 되는 것**: 11ty/Astro 같은 정적 사이트 생성기 도입. 항목이 수십 개를 넘어가서 필터/검색이 필요해지거나 템플릿 복붙이 5곳 넘게 쌓이기 전까지는 지금의 vanilla JS + 빌드 없음 구조를 유지하는 게 "서버 비용 0원, 파일 하나로 배포" 철학과 더 맞음.

## 수정 이력
| 날짜 | PC | 내용 |
|------|----|----|
| 2026-08-14 | - | 프로젝트 초기 생성 (폴더 구조, index.html, projects.js, style.css, DEVELOPMENT.md) |
| 2026-08-14 | - | 다크 테마 리디자인 + 프로젝트 상세페이지(데모/devlog) 구조 도입 |
| 2026-08-14 | - | GitHub 원격 저장소(kinggodsoft) 연결 및 초기 push 완료 |
| 2026-08-14 | - | Vercel 배포 완료, Deployment Protection 해제, 실사용(Demo/Devlog 렌더링) 확인 |
| 2026-08-14 | - | 브라우저 devlog 편집 기능 추가 (api/save-post.js + 편집 버튼), 릴레이뽑기 데모/후기 실제 콘텐츠로 교체 |
| 2026-08-14 | - | 끝말잇기(wordchain) 프로젝트 추가; 다른 PC 세션에서 push한 자리바꾸기/ROCK ATLAS/externalUrl 스키마 변경과 병합 |
