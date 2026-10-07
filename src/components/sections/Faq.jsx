import { useState } from "react";

const faqs = [
  ["Is it really free?", "Yes. No login and no payment, you can preview and download everything."],
  ["Who uploads the material?", "I upload it for now. Other students can send theirs through the Contribute page."],
  ["Is the material official?", "It is shared by students. Always double-check with your teacher and official course material."],
  ["What about other semesters?", "Semester 1 comes first. More semesters will be added step by step."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="band">
      <h2 className="sec-title">FAQ</h2>
      <div style={{ marginTop: 24 }}>
        {faqs.map(([q, a], i) => (
          <div className="faq-item" key={q}>
            <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span><span>{open === i ? "-" : "+"}</span>
            </button>
            {open === i && <p className="faq-a">{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
