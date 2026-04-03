import PageShell from "../components/page-shell";

const modules = [
  {
    title: "The Language of Maps",
    lessons: [
      { title: "What a Map Actually Is",                   duration: "6:12",  done: true  },
      { title: "Projections and the Shape of the World",   duration: "14:30", done: true  },
      { title: "Scale, Resolution, and Accuracy",          duration: "9:44",  done: true  },
      { title: "Reading Symbols and Legends",              duration: "8:05",  done: false },
    ],
  },
  {
    title: "Elevation and Terrain",
    lessons: [
      { title: "What Contour Lines Represent",             duration: "11:20", done: false },
      { title: "Index Contours and Interval",              duration: "7:55",  done: false },
      { title: "Identifying Ridges, Valleys, and Saddles", duration: "13:40", done: false },
      { title: "Digital Elevation Models (DEMs)",          duration: "18:02", done: false },
      { title: "Hillshading and Relief Visualisation",     duration: "10:15", done: false },
    ],
  },
  {
    title: "Modern Cartographic Tools",
    lessons: [
      { title: "Introduction to GIS",                      duration: "20:10", done: false },
      { title: "Working With Raster Data",                 duration: "15:33", done: false },
      { title: "Vector Data and Shapefiles",               duration: "12:48", done: false },
      { title: "The Marching Squares Algorithm",           duration: "22:05", done: false },
    ],
  },
  {
    title: "Field Techniques",
    lessons: [
      { title: "Compass and Bearing Navigation",           duration: "16:22", done: false },
      { title: "GPS: How It Works",                        duration: "9:18",  done: false },
      { title: "Sketching Terrain in the Field",           duration: "11:44", done: false },
    ],
  },
];

const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
const doneLessons  = modules.reduce((a, m) => a + m.lessons.filter(l => l.done).length, 0);
const pct = Math.round((doneLessons / totalLessons) * 100);

const instructors = [
  { name: "Dr. Amara Osei",    role: "Physical Geography, UCL",       initials: "AO" },
  { name: "Prof. Lin Wei",     role: "Geospatial Computing, MIT",     initials: "LW" },
  { name: "Sara Björk",        role: "Field Cartography, Expedition", initials: "SB" },
];

const reviews = [
  { name: "T. Nakamura", rating: 5, body: "Changed how I see every map I look at. The contour line section alone is worth it." },
  { name: "R. Santos",   rating: 5, body: "Dense but never overwhelming. Video quality and pacing are excellent." },
  { name: "K. Oduya",   rating: 4, body: "Module 3 gets quite technical. Budget extra time for the GIS lessons." },
];

export default function Learn() {
  return (
    <PageShell current="/learn">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14 pb-12 border-b border-white/[0.05]">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]/70 px-2 py-1 rounded border border-[#a0a0a0]/20">Intermediate</span>
              <span className="text-[10px] text-[#383838]">Cartography & GIS</span>
            </div>
            <h1 className="text-4xl font-black text-[#e8e8e8] leading-tight mb-4">
              Reading the Earth:<br />A Complete Course in Terrain and Maps
            </h1>
            <p className="text-[#686868] leading-relaxed mb-6">
              From contour lines to digital elevation models, this course builds a complete
              mental model of how terrain is measured, represented, and interpreted — whether
              you&apos;re navigating on foot or processing satellite data.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-[#585858] mb-6">
              <span><strong className="text-[#a0a0a0]">{totalLessons}</strong> lessons</span>
              <span><strong className="text-[#a0a0a0]">4</strong> modules</span>
              <span><strong className="text-[#a0a0a0]">3</strong> instructors</span>
              <span><strong className="text-[#a0a0a0]">6.5 hrs</strong> total</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-7 py-3 rounded-full bg-[#a0a0a0] text-[#000000] font-bold text-sm hover:bg-[#b8b8b8] transition-colors">
                Continue learning
              </button>
              <button className="px-6 py-3 rounded-full border border-white/[0.08] text-sm text-[#686868] hover:text-[#888888] hover:border-white/[0.15] transition-colors">
                Download resources
              </button>
            </div>
          </div>

          {/* Progress card */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#686868]">Your progress</span>
                <span className="text-[#a0a0a0] font-bold">{pct}%</span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#a0a0a0]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-[#383838] mt-2">{doneLessons} of {totalLessons} lessons complete</p>
            </div>

            <div className="pt-4 border-t border-white/[0.05]">
              <p className="text-xs text-[#484848] uppercase tracking-wider mb-3">Up next</p>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#a0a0a0]/10 border border-[#a0a0a0]/20 flex items-center justify-center text-[#a0a0a0] text-xs shrink-0">
                  ▶
                </div>
                <div>
                  <p className="text-xs font-medium text-[#d0d0d0]">Reading Symbols and Legends</p>
                  <p className="text-[10px] text-[#484848] mt-0.5">Module 1 · 8:05</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.05] space-y-2 text-xs text-[#585858]">
              <div className="flex justify-between"><span>Certificate on completion</span><span className="text-[#a0a0a0]/60">✓</span></div>
              <div className="flex justify-between"><span>Lifetime access</span><span className="text-[#a0a0a0]/60">✓</span></div>
              <div className="flex justify-between"><span>Downloadable resources</span><span className="text-[#a0a0a0]/60">✓</span></div>
              <div className="flex justify-between"><span>Community access</span><span className="text-[#a0a0a0]/60">✓</span></div>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#e8e8e8] mb-6">Curriculum</h2>
            <div className="space-y-4">
              {modules.map((mod, mi) => (
                <div key={mod.title} className="rounded-xl border border-white/[0.07] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#a0a0a0]/40 tabular-nums w-5">
                        {String(mi + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-sm font-semibold text-[#d0d0d0]">{mod.title}</h3>
                    </div>
                    <span className="text-xs text-[#383838]">{mod.lessons.length} lessons</span>
                  </div>
                  <ul className="divide-y divide-white/[0.04]">
                    {mod.lessons.map((lesson) => (
                      <li
                        key={lesson.title}
                        className={`flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02] ${
                          lesson.done ? "opacity-50" : ""
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[8px] ${
                          lesson.done
                            ? "bg-[#a0a0a0]/20 border-[#a0a0a0]/40 text-[#a0a0a0]"
                            : "border-white/[0.12]"
                        }`}>
                          {lesson.done ? "✓" : ""}
                        </span>
                        <span className="text-xs text-[#c0c0c0] flex-1">{lesson.title}</span>
                        <span className="text-[10px] text-[#383838] font-mono">{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Instructors */}
            <div>
              <h2 className="text-sm font-bold text-[#e8e8e8] mb-4">Instructors</h2>
              <div className="space-y-4">
                {instructors.map((ins) => (
                  <div key={ins.name} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#a0a0a0]/10 border border-[#a0a0a0]/20 flex items-center justify-center text-xs text-[#a0a0a0] shrink-0 font-bold">
                      {ins.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#d0d0d0]">{ins.name}</p>
                      <p className="text-xs text-[#484848]">{ins.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="pt-6 border-t border-white/[0.05]">
              <h2 className="text-sm font-bold text-[#e8e8e8] mb-4">Skills covered</h2>
              <div className="flex flex-wrap gap-2">
                {["Contour reading","GIS","Projection theory","DEM","Field navigation",
                  "Hillshading","Raster data","Marching squares","Compass","GPS"].map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full border border-white/[0.07] text-[10px] text-[#585858]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="pt-6 border-t border-white/[0.05]">
              <h2 className="text-sm font-bold text-[#e8e8e8] mb-4">Student reviews</h2>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.name} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#888888]">{r.name}</span>
                      <span className="text-[10px] text-[#a0a0a0]/60">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="text-xs text-[#585858] leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related courses */}
        <div className="pt-10 border-t border-white/[0.05]">
          <h2 className="text-sm font-bold text-[#e8e8e8] mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { title: "Remote Sensing Fundamentals",    lessons: 18, level: "Beginner"     },
              { title: "Wilderness Navigation Mastery",  lessons: 12, level: "Intermediate" },
              { title: "Data Visualisation with QGIS",   lessons: 24, level: "Advanced"     },
            ].map((c) => (
              <article key={c.title} className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02] cursor-pointer hover:border-white/[0.12] transition-colors">
                <div className="w-full h-24 rounded-lg bg-white/[0.03] mb-4" />
                <h3 className="text-sm font-semibold text-[#d0d0d0] mb-2">{c.title}</h3>
                <div className="flex justify-between text-xs text-[#484848]">
                  <span>{c.lessons} lessons</span>
                  <span>{c.level}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
