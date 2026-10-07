const steps = [
  ["01", "Pick your semester", "Start from your current semester. Everything is organised the same way."],
  ["02", "Choose a subject", "Open the subject and switch between notes, slides, books, assignments and past papers."],
  ["03", "Preview or download", "Read the PDF right in your browser, or download it with one click."],
];

export default function HowItWorks() {
  return (
    <section className="band">
      <h2 className="sec-title">How it works</h2>
      <p className="sec-sub">No login, no ads. Three steps to what you need.</p>
      <div className="steps">
        {steps.map(([n, t, d]) => (
          <div className="step" key={n}><i>{n}</i><h3>{t}</h3><p>{d}</p></div>
        ))}
      </div>
    </section>
  );
}
