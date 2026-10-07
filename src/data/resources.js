import { autoFiles } from "./autoFiles.js";

// Manual entries: big files on Google Drive, YouTube, websites.
// Files inside public/files are added automatically (autoFiles).
const manual = [
  { title: "Calculus and Analytical Geometry (Thomas and Finney)", semester: 1, subject: "calculus", type: "books",
    url: "https://drive.google.com/file/d/17LiqupaZB_y15LmD2rs4AtS-iJExQuDN/view?usp=sharing", date: "2026-10-07" },
  { title: "Thomas Calculus, Fifteenth Edition", semester: 1, subject: "calculus", type: "books",
    url: "https://drive.google.com/file/d/1VnZsqrvWdFZvikOhEAfSQfnv_0FF4uKz/view?usp=sharing", date: "2026-10-07" },
  { title: "Pakistan Affairs", semester: 1, subject: "ideology", type: "books",
    url: "https://drive.google.com/file/d/1xjM-xQhtwIJxqYCtEjdopjHHG35dIzhc/view?usp=sharing", date: "2026-10-07" },
];

function driveId(url) {
  if (!url.includes("drive.google.com")) return null;
  const m = url.match(/\/d\/([^/?#]+)/) || url.match(/[?&]id=([^&]+)/);
  return m ? m[1] : null;
}

export const resources = [...autoFiles, ...manual].map((r) => {
  if (r.file) return { ...r, external: false };
  const id = driveId(r.url || "");
  if (id) {
    return {
      ...r,
      file: "https://drive.google.com/file/d/" + id + "/preview",
      download: "https://drive.google.com/uc?export=download&id=" + id,
      external: false,
    };
  }
  return { ...r, file: r.url, external: true };
});
