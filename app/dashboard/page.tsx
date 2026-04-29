import PageShell from "../components/page-shell";

const stats = [
  { label: "Total Revenue",   value: "$2,847,392", delta: "+12.4%", up: true  },
  { label: "Active Users",    value: "184,291",    delta: "+8.1%",  up: true  },
  { label: "Conversion Rate", value: "3.62%",      delta: "-0.4%",  up: false },
];

const tableRows = [
  { page: "/home",     views: "421,003", bounce: "34%", time: "3:12" },
  { page: "/products", views: "302,441", bounce: "41%", time: "4:55" },
  { page: "/pricing",  views: "198,302", bounce: "29%", time: "5:41" },
  { page: "/blog",     views: "154,009", bounce: "52%", time: "6:02" },
];

const channels = [
  { name: "Organic Search", pct: 42, value: "77,402" },
  { name: "Direct",         pct: 28, value: "51,601" },
  { name: "Referral",       pct: 16, value: "29,486" },
];

export default function Dashboard() {
  return (
    <PageShell current="/dashboard">
      <div className="px-12 py-16 max-w-6xl mx-auto">

        <div className="mb-16">
          <h1 className="text-3xl font-black text-[#ebe2d4] mb-2">Analytics Overview</h1>
          <p className="text-sm text-[#5a4f43]">Last 30 days · Updated just now</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-8 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="p-6 rounded-xl border border-[#5a4f43]/30 bg-[#ebe2d4]/[0.03]">
              <p className="text-xs text-[#5a4f43] uppercase tracking-wider mb-3">{s.label}</p>
              <p className="text-2xl font-black text-[#ebe2d4]">{s.value}</p>
              <p className={`text-xs mt-2 font-medium ${s.up ? "text-emerald-500/70" : "text-rose-500/70"}`}>
                {s.delta} vs prev period
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">

          {/* Bar chart */}
          <div className="lg:col-span-2 p-8 rounded-xl border border-[#5a4f43]/30 bg-[#ebe2d4]/[0.03]">
            <h2 className="text-base font-semibold text-[#ebe2d4] mb-2">Sessions over time</h2>
            <p className="text-xs text-[#5a4f43] mb-8">Daily unique sessions · Jan – Mar 2026</p>
            <div className="flex items-end gap-1.5 h-36">
              {[38,52,67,82,91,72,84,96,74,91,100,87,92,95,76,88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    background: `hsla(0, 0%, ${15 + h * 0.3}%, 0.7)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Channels */}
          <div className="p-8 rounded-xl border border-[#5a4f43]/30 bg-[#ebe2d4]/[0.03]">
            <h2 className="text-base font-semibold text-[#ebe2d4] mb-2">Traffic channels</h2>
            <p className="text-xs text-[#5a4f43] mb-8">Source attribution</p>
            <div className="space-y-6">
              {channels.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#ebe2d4]">{c.name}</span>
                    <span className="text-[#a89a86] font-mono">{c.value}</span>
                  </div>
                  <div className="h-1.5 bg-[#ebe2d4]/[0.03] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#686868]"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-[#5a4f43]/30 bg-[#ebe2d4]/[0.03] overflow-hidden mb-16">
          <div className="px-6 py-5 border-b border-[#5a4f43]/30">
            <h2 className="text-base font-semibold text-[#ebe2d4]">Top pages</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#5a4f43]/30">
                <th className="text-left px-6 py-4 text-xs text-[#5a4f43] font-medium uppercase tracking-wider">Page</th>
                <th className="text-right px-6 py-4 text-xs text-[#5a4f43] font-medium uppercase tracking-wider">Views</th>
                <th className="text-right px-6 py-4 text-xs text-[#5a4f43] font-medium uppercase tracking-wider">Bounce</th>
                <th className="text-right px-6 py-4 text-xs text-[#5a4f43] font-medium uppercase tracking-wider">Avg time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {tableRows.map((r) => (
                <tr key={r.page}>
                  <td className="px-6 py-4"><code className="text-xs text-[#a89a86]/80">{r.page}</code></td>
                  <td className="px-6 py-4 text-right text-[#ebe2d4] font-mono text-xs">{r.views}</td>
                  <td className="px-6 py-4 text-right text-[#ebe2d4] font-mono text-xs">{r.bounce}</td>
                  <td className="px-6 py-4 text-right text-[#ebe2d4] font-mono text-xs">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4">
          <button className="px-5 py-2.5 rounded-lg bg-[#ebe2d4] text-[#1f1a16] text-sm font-semibold hover:bg-[hsl(24_22%_70%)] transition-colors">
            Export CSV
          </button>
          <button className="px-5 py-2.5 rounded-lg border border-[#5a4f43]/30 text-[#a89a86] text-sm hover:border-[#5a4f43]/60 hover:text-[#ebe2d4] transition-colors">
            Share dashboard
          </button>
        </div>

      </div>
    </PageShell>
  );
}
