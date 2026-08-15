// ============================================================
// 프로젝트 데이터
// 새 프로젝트를 추가/수정/삭제/순서변경/카테고리 이동은
// 이 파일의 PROJECTS 배열만 편집하면 됩니다. (index.html, 각 상세페이지는 건드릴 필요 없음)
//
// 필드 설명:
//   id         : 고유 식별자 (영문, 공백 없이) = projects/<id>/ 폴더명과 동일해야 함
//   title      : 카드/상세페이지에 표시될 제목
//   description: 카드에 표시될 한 줄 설명
//   difficulty : "초급" | "중급" | "고급" 중 하나
//   category   : 카드를 묶을 그룹 이름 (자유롭게 새 카테고리 추가 가능)
//   path       : 클릭 시 이동할 상세페이지 경로
//   status     : "ready" | "empty" (empty면 "PLANNED" 표시 및 클릭 비활성화)
//
// 새 프로젝트 추가 절차 (DEVELOPMENT.md 참고):
//   1. 아래 배열에 항목 추가
//   2. projects/<id>/ 폴더 생성 (projects/_template/ 복사해서 시작하면 편함)
//      - index.html : 그대로 두면 됨 (공용 스크립트가 자동으로 내용을 채움)
//      - demo.html  : 실제 데모(결과물) 페이지
//      - post.md    : 개발 후기/설명 글 (마크다운으로 자유롭게 작성)
// ============================================================

const PROJECTS = [
  {
    id: "pixelart",
    title: "픽셀아트 스튜디오",
    description: "이미지를 번호 색칠 학습지로 자동 변환하는 도구",
    difficulty: "고급",
    category: "교육용 도구",
    path: "projects/pixelart/",
    status: "ready",
  },
  {
    id: "relay",
    title: "학급 릴레이뽑기",
    description: "웹 기반 랜덤 선택 프로그램",
    difficulty: "중급",
    category: "교육용 도구",
    path: "projects/relay/",
    status: "ready",
  },
  {
    id: "wellness",
    title: "속닥속닥",
    description: "감정 표현을 돕는 대화형 앱",
    difficulty: "중급",
    category: "교육용 도구",
    path: "projects/wellness/",
    status: "ready",
  },
  {
    id: "rockatlas",
    title: "ROCK ATLAS",
    description: "장르·분위기 기반 록 밴드 탐색 아카이브",
    difficulty: "고급",
    category: "업무용 프로그램",
    path: "projects/rockatlas/",
    status: "ready",
  },
];

// 카테고리 표시 순서를 바꾸고 싶으면 이 배열을 수정하세요.
// 여기에 없는 카테고리는 등장 순서대로 뒤에 자동으로 추가됩니다.
const CATEGORY_ORDER = ["교육용 도구", "업무용 프로그램", "취미 프로젝트"];
