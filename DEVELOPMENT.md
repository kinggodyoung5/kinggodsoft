# DEVELOPMENT.md — Workbench 진행상황

> 두 PC(예: 집/학교) 사이 작업 동기화용 기록 파일입니다.
> **작업을 끝낼 때마다 이 파일을 업데이트**하고 커밋하세요.

## 현재 상태
- 다크 테마로 전면 리디자인 완료. 프로젝트 상세페이지에 데모(iframe) + 개발 후기(devlog) 구조 추가.
- 카드 3개(픽셀아트, 릴레이뽑기, 속닥속닥)는 데모/글 모두 아직 placeholder 상태.
- GitHub 원격 저장소 연결 완료: https://github.com/kinggodyoung5/kinggodsoft (branch: main)
- 배포는 Vercel 사용 예정 (아래 "배포 (Vercel)" 섹션 참고, 계정 연동은 사람이 직접 해야 함)

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
- [ ] Vercel 계정 생성 + GitHub(kinggodsoft) 연동 및 배포 (사람이 직접: vercel.com → Add New Project → import)
- [ ] 픽셀아트 스튜디오 실제 구현 → `projects/pixelart/demo.html` 교체 + `post.md` 작성
- [ ] 학급 릴레이뽑기 실제 구현 → `projects/relay/demo.html` 교체 + `post.md` 작성
- [ ] 속닥속닥 실제 구현 → `projects/wellness/demo.html` 교체 + `post.md` 작성
- [ ] web/ 폴더에 큰 웹 프로젝트 추가

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
- 정적 사이트라 빌드 설정 없이 그대로 배포 가능 (Framework Preset: Other / 빌드 커맨드 없음 / 아웃풋 디렉토리 비워둠).
- 최초 1회는 사람이 직접: [vercel.com](https://vercel.com) 로그인 → New Project → `kinggodsoft` 저장소 Import → Deploy.
- 이후에는 `main` 브랜치에 `git push`할 때마다 Vercel이 자동으로 재배포함.
- 배포 URL은 연결 후 이 섹션에 적어둘 것 (예: `https://kinggodsoft.vercel.app`).

## 수정 이력
| 날짜 | PC | 내용 |
|------|----|----|
| 2026-08-14 | - | 프로젝트 초기 생성 (폴더 구조, index.html, projects.js, style.css, DEVELOPMENT.md) |
| 2026-08-14 | - | 다크 테마 리디자인 + 프로젝트 상세페이지(데모/devlog) 구조 도입 |
| 2026-08-14 | - | GitHub 원격 저장소(kinggodsoft) 연결 및 초기 push 완료 |
| 2026-08-14 | - | Vercel 배포 예정으로 결정, DEVELOPMENT.md에 배포 절차 기록 |
