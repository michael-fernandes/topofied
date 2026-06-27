// The app shell (TopoScene, nav, gradient, bottom strip) now lives in the
// persistent root-layout component `TerrainShell`, so it survives navigation
// and the active-tab summit can glide between pages.
//
// PageShell is kept as a thin passthrough so existing pages can keep calling
// <PageShell current=… seed=…>…</PageShell> unchanged. The `current` and
// `seed` props are now derived in TerrainShell (from the URL) and ignored here.

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
  current: string;
  seed?: string;
}) {
  return <>{children}</>;
}
