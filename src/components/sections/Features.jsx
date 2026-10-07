const items = [
  ["Preview in browser", "Open PDFs and slides instantly, no download needed."],
  ["One-click download", "Save any file to your phone or laptop for offline study."],
  ["Organised properly", "Semester, then subject, then type. Always the same structure."],
  ["Search everything", "Find a lecture or book by title in the Library page."],
  ["Works on phone", "Designed to be comfortable on small screens too."],
  ["Free for every student", "Built by a student, for students. No fees."],
];

export default function Features() {
  return (
    <section className="band dark">
      <h2 className="sec-title">Why UET Vault</h2>
      <p className="sec-sub">Everything a CS student needs, in one tidy place.</p>
      <div className="grid">
        {items.map(([t, d]) => (
          <div className="feat" key={t}><h3>{t}</h3><p>{d}</p></div>
        ))}
      </div>
    </section>
  );
}
