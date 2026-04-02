import PageShell from "../components/page-shell";

export default function Form() {
  return (
    <PageShell current="/form">
      <div className="max-w-5xl mx-auto px-8 py-16">

        <div className="mb-12">
          <h1 className="text-4xl font-black text-[#e8e4dc] mb-2">Get in Touch</h1>
          <p className="text-[#4a4840] text-sm">We reply within one business day. Usually faster.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Form — wider column */}
          <form className="lg:col-span-3 space-y-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#6a6860] uppercase tracking-wider mb-2">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="Ada"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#d4d0c8] placeholder-[#3a3830] outline-none focus:border-[#c8a96e]/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6a6860] uppercase tracking-wider mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Lovelace"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#d4d0c8] placeholder-[#3a3830] outline-none focus:border-[#c8a96e]/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#6a6860] uppercase tracking-wider mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="ada@analyticengine.co"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#d4d0c8] placeholder-[#3a3830] outline-none focus:border-[#c8a96e]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6a6860] uppercase tracking-wider mb-2">
                Company
              </label>
              <input
                type="text"
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#d4d0c8] placeholder-[#3a3830] outline-none focus:border-[#c8a96e]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6a6860] uppercase tracking-wider mb-2">
                Topic
              </label>
              <select className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#6a6860] outline-none focus:border-[#c8a96e]/40 transition-colors appearance-none">
                <option value="">Select a topic</option>
                <option>General enquiry</option>
                <option>Partnership</option>
                <option>Press & media</option>
                <option>Technical support</option>
                <option>Billing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#6a6860] uppercase tracking-wider mb-2">
                Priority
              </label>
              <div className="flex gap-3">
                {["Low", "Normal", "High", "Urgent"].map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      className="accent-[#c8a96e]"
                      defaultChecked={p === "Normal"}
                    />
                    <span className="text-sm text-[#6a6860]">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#6a6860] uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                rows={6}
                placeholder="Tell us what's on your mind…"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#d4d0c8] placeholder-[#3a3830] outline-none focus:border-[#c8a96e]/40 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="consent" className="accent-[#c8a96e]" />
              <label htmlFor="consent" className="text-xs text-[#4a4840]">
                I agree to the privacy policy and consent to being contacted
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-[#c8a96e] text-[#0d0d0d] font-bold text-sm hover:bg-[#d4b87e] transition-colors"
            >
              Send message
            </button>

          </form>

          {/* Sidebar info */}
          <aside className="lg:col-span-2 space-y-8">

            <div>
              <h2 className="text-base font-semibold text-[#e8e4dc] mb-4">Other ways to reach us</h2>
              <div className="space-y-4">
                {[
                  { label: "Email",   value: "hello@topofied.io" },
                  { label: "Phone",   value: "+1 (415) 000-0000" },
                  { label: "Twitter", value: "@topofied"          },
                  { label: "Discord", value: "discord.gg/topofied" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-[#3a3830] uppercase tracking-widest mb-0.5">{label}</p>
                    <a href="#" className="text-sm text-[#8a8880] hover:text-[#c8a96e] transition-colors">{value}</a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.05]">
              <h2 className="text-base font-semibold text-[#e8e4dc] mb-4">Office</h2>
              <address className="not-italic text-sm text-[#5a5852] leading-loose">
                340 Pine Street, Suite 800<br />
                San Francisco, CA 94104<br />
                United States
              </address>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-[#e8e4dc] mb-2">Response time</h3>
              <p className="text-xs text-[#5a5852] leading-relaxed">
                We typically respond within 4 business hours. For urgent issues,
                use the priority selector above and we&apos;ll escalate accordingly.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#e8e4dc] mb-3">Frequently asked</h3>
              <ul className="space-y-2">
                {[
                  "Can I self-host Topofied?",
                  "Is there a free tier?",
                  "How do I add custom weights?",
                  "Does it work with React Native?",
                ].map((q) => (
                  <li key={q}>
                    <a href="#" className="text-xs text-[#5a5852] hover:text-[#c8a96e]/70 transition-colors flex items-start gap-1.5">
                      <span className="text-[#c8a96e]/30 mt-0.5">▸</span>
                      {q}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>
      </div>
    </PageShell>
  );
}
