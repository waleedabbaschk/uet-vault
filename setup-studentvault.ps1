# UET Taxila CS Resource Website - folder structure
# Run INSIDE your Vite React project folder.

# ---- EDIT THIS: your Semester 1 subjects (folder names, lowercase, no spaces) ----
$semester1 = @(
  "programming-fundamentals",
  "applied-physics",
  "calculus",
  "functional-english",
  "islamic-studies",
  "ict"
)
$types = @("notes", "slides", "books", "assignments", "past-papers")

# ---- public/files : where all PDFs/slides go ----
for ($s = 1; $s -le 8; $s++) {
  $sem = "public/files/semester-$s"
  New-Item -ItemType Directory -Force -Path $sem | Out-Null
  New-Item -ItemType File -Force -Path "$sem/.gitkeep" | Out-Null
}
foreach ($sub in $semester1) {
  foreach ($t in $types) {
    $p = "public/files/semester-1/$sub/$t"
    New-Item -ItemType Directory -Force -Path $p | Out-Null
    New-Item -ItemType File -Force -Path "$p/.gitkeep" | Out-Null
  }
}

# ---- source code folders ----
$dirs = @(
  "src/pages",
  "src/components/layout",
  "src/components/ui",
  "src/components/sections",
  "src/components/effects",
  "src/data",
  "src/hooks",
  "src/styles",
  "src/assets/images",
  "public/images"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

$files = @(
  "src/pages/Home.jsx",
  "src/pages/Semesters.jsx",
  "src/pages/Subject.jsx",
  "src/pages/Library.jsx",
  "src/pages/About.jsx",
  "src/pages/Contribute.jsx",
  "src/components/layout/Navbar.jsx",
  "src/components/layout/Footer.jsx",
  "src/components/ui/FileCard.jsx",
  "src/components/ui/SearchBar.jsx",
  "src/components/ui/SemesterCard.jsx",
  "src/components/ui/SubjectTabs.jsx",
  "src/components/sections/Hero.jsx",
  "src/components/sections/RecentFiles.jsx",
  "src/components/effects/RainCanvas.jsx",
  "src/components/effects/SmoothScroll.jsx",
  "src/hooks/useSearch.js",
  "src/styles/globals.css"
)
foreach ($f in $files) { New-Item -ItemType File -Force -Path $f | Out-Null }

# ---- data files ----
@'
export const profile = {
  name: "Waleed Abbas",
  role: "BS Computer Science, Semester 1",
  university: "UET Taxila",
  email: "waleedabbas.dev@gmail.com",
  phone: "03719455944",
  whatsapp: "https://wa.me/923719455944",
  github: "https://github.com/waleedabbaschk",
};
'@ | Set-Content -Encoding UTF8 "src/data/profile.js"

@'
export const semesters = [
  {
    id: 1,
    subjects: [
      { slug: "programming-fundamentals", name: "Programming Fundamentals" },
      { slug: "applied-physics", name: "Applied Physics" },
      { slug: "calculus", name: "Calculus" },
      { slug: "functional-english", name: "Functional English" },
      { slug: "islamic-studies", name: "Islamic Studies" },
      { slug: "ict", name: "ICT" },
    ],
  },
  { id: 2, subjects: [] },
  { id: 3, subjects: [] },
  { id: 4, subjects: [] },
  { id: 5, subjects: [] },
  { id: 6, subjects: [] },
  { id: 7, subjects: [] },
  { id: 8, subjects: [] },
];
'@ | Set-Content -Encoding UTF8 "src/data/semesters.js"

@'
// Add one entry per uploaded file.
// type: notes | slides | books | assignments | past-papers
export const resources = [
  // {
  //   title: "Lecture 1 - Introduction",
  //   semester: 1,
  //   subject: "programming-fundamentals",
  //   type: "slides",
  //   file: "/files/semester-1/programming-fundamentals/slides/lecture-1.pdf",
  //   date: "2026-10-07",
  // },
];
'@ | Set-Content -Encoding UTF8 "src/data/resources.js"

Write-Host ""
Write-Host "Structure created." -ForegroundColor Green
Write-Host "Put your hero image at: src/assets/images/waleed-cutout.png" -ForegroundColor Cyan
