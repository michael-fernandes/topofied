import PageShell from "../components/page-shell";

const products = [
  { name: "Obsidian Contour Tee",  price: "$38",  tag: "Best seller", hue: 200 },
  { name: "Ridge Line Hoodie",     price: "$89",  tag: "New",         hue: 30  },
  { name: "Isoline Field Jacket",  price: "$195", tag: "Limited",     hue: 280 },
  { name: "Summit Cargo Pants",    price: "$145", tag: null,          hue: 100 },
];

export default function Store() {
  return (
    <PageShell current="/store">
      <div className="px-12 py-20 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-black text-[#e8e8e8] mb-3">The Collection</h1>
          <p className="text-[#484848] text-sm">Gear shaped by the land. Spring 2026.</p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-12 mb-24">
          {products.map((p) => (
            <article key={p.name} className="group cursor-pointer">
              <div
                className="w-full aspect-[3/4] rounded-xl mb-5 relative overflow-hidden"
                style={{ background: `hsla(${p.hue}, 18%, 12%, 1)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-24 h-24 rounded-full opacity-20"
                    style={{
                      background: `radial-gradient(circle, hsla(${p.hue}, 60%, 60%, 0.6) 0%, transparent 70%)`,
                    }}
                  />
                </div>
                {p.tag && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] bg-[#a0a0a0] text-[#000000] font-semibold">
                    {p.tag}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-[#d0d0d0] mb-2">{p.name}</h3>
              <p className="text-sm text-[#a0a0a0]">{p.price}</p>
            </article>
          ))}
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap gap-8 justify-center text-xs text-[#383838] pt-8 border-t border-white/[0.04]">
          <a href="#" className="hover:text-[#686868] transition-colors">Size Guide</a>
          <a href="#" className="hover:text-[#686868] transition-colors">Returns</a>
          <a href="#" className="hover:text-[#686868] transition-colors">Sustainability</a>
        </footer>

      </div>
    </PageShell>
  );
}
