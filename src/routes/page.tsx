export default function Page() {
  return (
    <main className="vlearn-shell">
      <iframe
        className="vlearn-frame"
        src="/app.html"
        title="今天吃点什么？"
        allow="clipboard-read; clipboard-write"
      />
    </main>
  );
}
