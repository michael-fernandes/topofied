import PageShell from "../components/page-shell";

const stats = [
  { label: "Total Revenue",   value: "$2,847,392", delta: "+12.4%", up: true  },
  { label: "Active Users",    value: "184,291",    delta: "+8.1%",  up: true  },
  { label: "Conversion Rate", value: "3.62%",      delta: "-0.4%",  up: false },
  { label: "Avg Session",     value: "4m 12s",     delta: "+22s",   up: true  },
];

const tableRows = [
  { page: "/home",        views: "421,003", bounce: "34%", time: "3:12" },
  { page: "/products",    views: "302,441", bounce: "41%", time: "4:55" },
  { page: "/pricing",     views: "198,302", bounce: "29%", time: "5:41" },
  { page: "/blog",        views: "154,009", bounce: "52%", time: "6:02" },
  { page: "/about",       views: "88,124",  bounce: "61%", time: "2:18" },
  { page: "/contact",     views: "62,441",  bounce: "48%", time: "3:44" },
  { page: "/docs",        views: "55,302",  bounce: "22%", time: "8:30" },
];

const channels = [
  { name: "Organic Search", pct: 42, value: "77,402" },
  { name: "Direct",         pct: 28, value: "51,601" },
  { name: "Referral",       pct: 16, value: "29,486" },
  { name: "Social",         pct: 9,  value: "16,586" },
  { name: "Email",          pct: 5,  value: "9,215"  },
];

export default function Dashboard() {
  return (
    <PageShell current="/dashboard">
      <div className="px-8 py-10 max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#e8e4dc] mb-1">Analytics Overview</h1>
          <p className="text-sm text-[#4a4840]">Last 30 days · Updated just now</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <p className="text-xs text-[#4a4840] uppercase tracking-wider mb-2">{s.label}</p>
              <p className="text-2xl font-black text-[#e8e4dc]">{s.value}</p>
              <p className={`text-xs mt-1 font-medium ${s.up ? "text-emerald-500/70" : "text-rose-500/70"}`}>
                {s.delta} vs prev period
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* Fake bar chart */}
          <div className="lg:col-span-2 p-6 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            <h2 className="text-base font-semibold text-[#e8e4dc] mb-1">Sessions over time</h2>
            <p className="text-xs text-[#4a4840] mb-6">Daily unique sessions · Jan – Mar 2026</p>
            <div className="flex items-end gap-1 h-32">
              {[38,52,41,67,73,58,82,79,91,88,72,65,84,96,88,74,91,83,100,94,87,79,92,88,95,83,76,91,88,96].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    background: `hsla(${160 - h * 0.8}, 55%, ${15 + h * 0.22}%, 0.7)`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#3a3830] mt-2">
              <span>Jan 1</span><span>Jan 15</span><span>Feb 1</span><span>Feb 15</span><span>Mar 1</span>
            </div>
          </div>

          {/* Channel breakdown */}
          <div className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            <h2 className="text-base font-semibold text-[#e8e4dc] mb-1">Traffic channels</h2>
            <p className="text-xs text-[#4a4840] mb-6">Source attribution</p>
            <div className="space-y-4">
              {channels.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8a8880]">{c.name}</span>
                    <span className="text-[#c8a96e] font-mono">{c.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.pct}%`, background: "hsla(38, 55%, 60%, 0.6)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top pages table */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <h2 className="text-base font-semibold text-[#e8e4dc]">Top pages</h2>
            <p className="text-xs text-[#4a4840] mt-0.5">By pageviews this period</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-6 py-3 text-xs text-[#4a4840] font-medium uppercase tracking-wider">Page</th>
                <th className="text-right px-6 py-3 text-xs text-[#4a4840] font-medium uppercase tracking-wider">Views</th>
                <th className="text-right px-6 py-3 text-xs text-[#4a4840] font-medium uppercase tracking-wider">Bounce</th>
                <th className="text-right px-6 py-3 text-xs text-[#4a4840] font-medium uppercase tracking-wider">Avg time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {tableRows.map((r) => (
                <tr key={r.page} className="hover:bg-white/[0.015] transition-colors">
                  <td className="px-6 py-3">
                    <code className="text-xs text-[#c8a96e]/80">{r.page}</code>
                  </td>
                  <td className="px-6 py-3 text-right text-[#8a8880] font-mono text-xs">{r.views}</td>
                  <td className="px-6 py-3 text-right text-[#8a8880] font-mono text-xs">{r.bounce}</td>
                  <td className="px-6 py-3 text-right text-[#8a8880] font-mono text-xs">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom action row */}
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-lg bg-[#c8a96e] text-[#0d0d0d] text-sm font-semibold hover:bg-[#d4b87e] transition-colors">
            Export CSV
          </button>
          <button className="px-5 py-2.5 rounded-lg border border-white/[0.08] text-[#6a6860] text-sm hover:border-white/[0.15] hover:text-[#8a8880] transition-colors">
            Schedule report
          </button>
          <button className="px-5 py-2.5 rounded-lg border border-white/[0.08] text-[#6a6860] text-sm hover:border-white/[0.15] hover:text-[#8a8880] transition-colors">
            Share dashboard
          </button>
        </div>

      </div>
    </PageShell>
  );
}
