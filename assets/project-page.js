// ============================================================
// 프로젝트 상세페이지 공용 스크립트
// projects/<id>/index.html 에서 아래처럼 PROJECT_ID만 지정하면
// projects.js의 데이터 + 같은 폴더의 post.md, demo.html을 읽어
// 상세페이지 전체(제목/설명/데모/devlog)를 자동으로 채웁니다.
//
//   <script>const PROJECT_ID = "pixelart";</script>
//   <script src="../../assets/projects.js"></script>
//   <script src="../../assets/project-page.js"></script>
//
// 즉, 프로젝트 정보/설명 수정  -> assets/projects.js
//     데모(결과물) 수정        -> projects/<id>/demo.html
//     개발 후기 글 작성/수정   -> projects/<id>/post.md
// ============================================================

// 아주 가벼운 마크다운 서브셋 파서 (외부 라이브러리 의존 없음, 오프라인/GitHub Pages 모두 동작)
// 지원: #/##/### 제목, **굵게**, *기울임*, `code`, [텍스트](링크), - 목록, 빈 줄 구분 문단
function renderMarkdown(md) {
  const escapeHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const inline = (s) =>
    escapeHtml(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listOpen = false;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      closeList();
      return;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      return;
    }

    const listItem = trimmed.match(/^[-*]\s+(.*)$/);
    if (listItem) {
      flushParagraph();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inline(listItem[1])}</li>`);
      return;
    }

    closeList();
    paragraph.push(trimmed);
  });

  flushParagraph();
  closeList();
  return html.join("\n");
}

(function init() {
  if (typeof PROJECT_ID === "undefined" || typeof PROJECTS === "undefined") return;

  const project = PROJECTS.find((p) => p.id === PROJECT_ID);
  const root = document.getElementById("project-detail-root");
  if (!root) return;

  if (!project) {
    root.innerHTML = `<div class="detail-body"><p class="devlog-empty">assets/projects.js 에서 id: "${PROJECT_ID}" 항목을 찾을 수 없습니다.</p></div>`;
    return;
  }

  document.title = `${project.title} — Workbench`;

  root.innerHTML = `
    <header class="detail-header">
      <div class="detail-meta">
        <span>${project.category}</span>
      </div>
      <h1>${project.title}</h1>
      <p class="detail-desc">${project.description}</p>
    </header>
    <div class="detail-body">
      <section>
        <p class="detail-section-title">Demo</p>
        <div class="demo-frame-chrome">
          <div class="demo-frame-bar">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="url">demo.html</span>
          </div>
          <div class="demo-frame-body">
            <iframe id="demo-iframe" src="./demo.html" title="${project.title} demo" loading="lazy"></iframe>
          </div>
        </div>
        <div class="demo-actions">
          ${
            project.externalUrl
              ? `<a class="btn" href="${project.externalUrl}" target="_blank" rel="noopener">도구 바로가기 →</a>`
              : `<a class="btn" href="./demo.html" target="_blank" rel="noopener">전체 화면으로 열기 →</a>`
          }
        </div>
      </section>
      <section>
        <div class="devlog-header">
          <p class="detail-section-title">Devlog</p>
          <button class="edit-toggle" id="devlog-edit-toggle" type="button">편집</button>
        </div>
        <div class="devlog" id="devlog-content">
          <p class="devlog-empty">불러오는 중...</p>
        </div>
      </section>
    </div>
  `;

  let rawMarkdown = "";

  function showDevlog(md) {
    rawMarkdown = md;
    const target = document.getElementById("devlog-content");
    if (md.trim() === "") {
      target.innerHTML = `<p class="devlog-empty">아직 작성된 글이 없습니다. 위의 "편집" 버튼을 눌러 개발 후기를 작성해보세요.</p>`;
    } else {
      target.innerHTML = renderMarkdown(md);
    }
  }

  function openEditor() {
    const container = document.getElementById("devlog-content");
    container.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "devlog-editor";

    const textarea = document.createElement("textarea");
    textarea.rows = 14;
    textarea.value = rawMarkdown;
    wrap.appendChild(textarea);

    const row = document.createElement("div");
    row.className = "devlog-editor-row";

    const pw = document.createElement("input");
    pw.type = "password";
    pw.placeholder = "비밀번호";
    pw.autocomplete = "off";
    row.appendChild(pw);

    const saveBtn = document.createElement("button");
    saveBtn.className = "btn";
    saveBtn.type = "button";
    saveBtn.textContent = "저장";
    row.appendChild(saveBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "btn";
    cancelBtn.type = "button";
    cancelBtn.textContent = "취소";
    row.appendChild(cancelBtn);

    wrap.appendChild(row);

    const msg = document.createElement("p");
    msg.className = "devlog-editor-msg";
    wrap.appendChild(msg);

    container.appendChild(wrap);

    cancelBtn.onclick = () => showDevlog(rawMarkdown);

    saveBtn.onclick = async () => {
      const content = textarea.value;
      const password = pw.value;
      if (!password) {
        msg.textContent = "비밀번호를 입력하세요.";
        return;
      }
      saveBtn.disabled = true;
      msg.textContent = "저장 중...";
      try {
        const res = await fetch("/api/save-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: PROJECT_ID, content, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          msg.textContent = data.error || "저장에 실패했습니다.";
          saveBtn.disabled = false;
          return;
        }
        msg.textContent = "저장되었습니다. 잠시 후 재배포되어 반영됩니다.";
        showDevlog(content);
      } catch (err) {
        msg.textContent = "저장 중 오류가 발생했습니다. (이 기능은 Vercel 배포 환경에서만 동작합니다)";
        saveBtn.disabled = false;
      }
    };
  }

  document.getElementById("devlog-edit-toggle").onclick = openEditor;

  // 캐시 버스팅: 매번 다른 쿼리스트링을 붙여서 브라우저/Vercel CDN 캐시에
  // 안 걸리고 항상 GitHub의 최신 커밋 내용을 받아오게 한다.
  fetch(`./post.md?t=${Date.now()}`)
    .then((res) => {
      if (!res.ok) throw new Error("not found");
      return res.text();
    })
    .then((text) => showDevlog(text))
    .catch(() => {
      rawMarkdown = "";
      document.getElementById("devlog-content").innerHTML =
        `<p class="devlog-empty">post.md를 불러올 수 없습니다.<br />로컬에서 볼 때는 서버를 통해 열어야 합니다 (예: <code>python -m http.server</code>).<br />Vercel에 배포하면 정상적으로 표시됩니다.<br />위의 "편집" 버튼으로 새로 작성할 수도 있습니다.</p>`;
    });
})();
