const IMAGES = ["jpg", "jpeg", "png", "webp"];

export default function FileCard({ item }) {
  const isLink = item.external;
  const isDrive = (item.file || "").includes("drive.google.com");
  const ext = isDrive || isLink ? "" : (item.file.split("?")[0].split(".").pop() || "").toLowerCase();
  const canPreview = !isLink && (isDrive || ext === "pdf" || IMAGES.includes(ext));
  const dl = item.download || item.file;
  const fileName = decodeURIComponent((item.file || "").split("/").pop() || item.title);

  return (
    <article className="file-card">
      <div className="file-info">
        <h3>{item.title}</h3>
        <p className="file-meta">
          Sem {item.semester} | {item.subject.replace(/-/g, " ")} | {item.type.replace("-", " ")}
          {ext ? " | " + ext.toUpperCase() : ""} | {item.date}
        </p>
      </div>
      <div className="file-actions">
        {isLink && <a className="btn" href={item.file} target="_blank" rel="noreferrer">Open link</a>}
        {canPreview && <a className="btn" href={item.file} target="_blank" rel="noreferrer">Preview</a>}
        {!isLink && <a className="btn btn-dark" href={dl} download={isDrive ? undefined : fileName}>Download</a>}
      </div>
    </article>
  );
}
