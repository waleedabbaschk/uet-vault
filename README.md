# UET Vault

Notes, slides, books, assignments and past papers for UET Taxila CS students.
Built with React + Vite, GSAP, Lenis and React Router.

## Run locally

    npm install
    npm run dev

## Add a new file

1. Put the PDF in public/files/semester-N/subject-name/type/
   (type = notes, slides, books, assignments, past-papers)
2. Add one entry in src/data/resources.js:

    {
      title: "Lecture 1 - Introduction",
      semester: 1,
      subject: "programming-fundamentals",
      type: "slides",
      file: "/files/semester-1/programming-fundamentals/slides/lecture-1.pdf",
      date: "2026-10-07",
    }

3. Save, commit and push. Vercel redeploys automatically.

## Add a new semester or subject

Edit src/data/semesters.js and create the matching folders under public/files.

## Deploy

Push to GitHub, import the repo on vercel.com, and click Deploy.
Keep each file under 100 MB. For bigger files use Google Drive links.
