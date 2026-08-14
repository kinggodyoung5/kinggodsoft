// Vercel Serverless Function
// 브라우저에서 비밀번호와 함께 devlog(post.md) 내용을 보내면,
// 비밀번호를 서버에서 검증한 뒤 GitHub API로 해당 파일을 직접 커밋합니다.
// 비밀번호(EDIT_PASSWORD)와 GitHub 토큰(GITHUB_TOKEN)은 Vercel 프로젝트의
// 환경변수로만 저장되며 브라우저로는 절대 전달되지 않습니다.

const OWNER = "kinggodyoung5";
const REPO = "kinggodsoft";
const BRANCH = "main";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const { projectId, content, password } = req.body || {};

  if (!process.env.EDIT_PASSWORD) {
    res.status(500).json({ ok: false, error: "서버에 EDIT_PASSWORD가 설정되어 있지 않습니다." });
    return;
  }
  if (!password || password !== process.env.EDIT_PASSWORD) {
    res.status(401).json({ ok: false, error: "비밀번호가 올바르지 않습니다." });
    return;
  }
  if (typeof projectId !== "string" || !/^[a-z0-9_-]+$/.test(projectId)) {
    res.status(400).json({ ok: false, error: "잘못된 프로젝트 id입니다." });
    return;
  }
  if (typeof content !== "string") {
    res.status(400).json({ ok: false, error: "내용이 비어있습니다." });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({ ok: false, error: "서버에 GITHUB_TOKEN이 설정되어 있지 않습니다." });
    return;
  }

  const path = `projects/${projectId}/post.md`;
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  try {
    let sha;
    const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
    if (getRes.status === 404) {
      sha = undefined; // 새 파일 생성
    } else if (!getRes.ok) {
      const errText = await getRes.text();
      res.status(getRes.status).json({ ok: false, error: `파일 조회 실패: ${errText}` });
      return;
    } else {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    const putBody = {
      message: `Update ${path} via Workbench editor`,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: BRANCH,
    };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      res.status(putRes.status).json({ ok: false, error: `커밋 실패: ${errText}` });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
};
