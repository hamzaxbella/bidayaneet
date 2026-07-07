const items = [
  ['Salma E.', 'De formation courte à développeuse web junior.'],
  ['Omar T.', 'A transformé une idée locale en projet entrepreneurial.'],
  ['Amina K.', 'A commencé par une micro-action et travaille maintenant en communication.'],
];

export default function StoriesPage() {
  return (
    <main className="portal-lite-page">
      <section className="portal-lite-shell">
        <a href="/mediator">← Retour au portail</a>
        <h1>Histoires inspirantes</h1>
        <p>Des parcours réels et motivants pour aider chaque jeune à se projeter.</p>
        <div className="portal-lite-grid">
          {items.map(([title, text]) => (
            <article key={title}>
              <b>{title}</b>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
