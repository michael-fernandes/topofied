import PageShell from "../components/page-shell";

const products = [
  { name: "Obsidian Contour Tee",    price: "$38",  tag: "Best seller", hue: 200 },
  { name: "Ridge Line Hoodie",       price: "$89",  tag: "New",         hue: 30  },
  { name: "Elevation Cap",           price: "$32",  tag: null,          hue: 160 },
  { name: "Isoline Field Jacket",    price: "$195", tag: "Limited",     hue: 280 },
  { name: "Plateau Merino Pullover", price: "$128", tag: null,          hue: 50  },
  { name: "Summit Cargo Pants",      price: "$145", tag: "New",         hue: 100 },
  { name: "Benchmark Fleece",        price: "$112", tag: null,          hue: 220 },
  { name: "Traverse Wind Shell",     price: "$168", tag: "Best seller", hue: 350 },
  { name: "Datum Socks 3-Pack",      price: "$24",  tag: null,          hue: 170 },
];

const filters = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];

export default function Store() {
  return (
    <PageShell current="/store">
      <div className="px-8 py-12 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#e8e4dc] mb-2">The Collection</h1>
          <p className="text-[#4a4840] text-sm">Gear shaped by the land. Spring 2026.</p>
        </div>

        {/* Filters + sort */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex gap-2">
            {filters.map((f, i) => (
              <button
                key={f}
                className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${
                  i === 0
                    ? "border-[#c8a96e]/50 text-[#c8a96e] bg-[#c8a96e]/10"
                    : "border-white/[0.07] text-[#5a5852] hover:text-[#8a8880] hover:border-white/[0.14]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select className="bg-transparent border border-white/[0.07] text-xs text-[#5a5852] rounded px-3 py-1.5 outline-none">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12">
          {products.map((p) => (
            <article key={p.name} className="group cursor-pointer">
              {/* Placeholder image */}
              <div
                className="w-full aspect-[3/4] rounded-xl mb-3 relative overflow-hidden"
                style={{ background: `hsla(${p.hue}, 18%, 12%, 1)` }}
              >
                {/* Faux topo pattern inside product image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-24 h-24 rounded-full opacity-20"
                    style={{
                      background: `radial-gradient(circle, hsla(${p.hue}, 60%, 60%, 0.6) 0%, transparent 70%)`,
                      boxShadow: `0 0 40px 20px hsla(${p.hue}, 40%, 40%, 0.15)`,
                    }}
                  />
                </div>
                {p.tag && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] bg-[#c8a96e] text-[#0d0d0d] font-semibold">
                    {p.tag}
                  </span>
                )}
                <button className="absolute bottom-3 left-3 right-3 py-2 rounded-lg bg-[#0d0d0d]/80 text-xs text-[#c8a96e] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-[#c8a96e]/20">
                  Quick add
                </button>
              </div>
              <h3 className="text-sm font-semibold text-[#d4d0c8] mb-1">{p.name}</h3>
              <p className="text-sm text-[#c8a96e]">{p.price}</p>
            </article>
          ))}
        </div>

        {/* Promo banner */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-10 text-center mb-12">
          <h2 className="text-3xl font-black text-[#e8e4dc] mb-3">Free shipping over $150</h2>
          <p className="text-[#5a5852] text-sm mb-6">On all domestic orders. Returns always free.</p>
          <button className="px-8 py-3 rounded-full bg-[#c8a96e] text-[#0d0d0d] text-sm font-semibold hover:bg-[#d4b87e] transition-colors">
            Shop the full range
          </button>
        </div>

        {/* Footer nav */}
        <footer className="flex flex-wrap gap-6 justify-center text-xs text-[#3a3830] pt-6 border-t border-white/[0.04]">
          <a href="#" className="hover:text-[#6a6860] transition-colors">Size Guide</a>
          <a href="#" className="hover:text-[#6a6860] transition-colors">Returns</a>
          <a href="#" className="hover:text-[#6a6860] transition-colors">Sustainability</a>
          <a href="#" className="hover:text-[#6a6860] transition-colors">Trade Program</a>
          <a href="#" className="hover:text-[#6a6860] transition-colors">Gift Cards</a>
        </footer>

      </div>
    </PageShell>
  );
}
