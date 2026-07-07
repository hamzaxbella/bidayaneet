const items = [
  ['Imane R.', 'Ton médiateur est disponible pour un rendez-vous cette semaine.'],
  ['Orientation', 'Ta session du mercredi est confirmée à 15h00.'],
  ['Opportunité', 'Un stage marketing correspond à ton profil.'],
];

export default function MessagesPage() {
  return (
    <main className="portal-lite-page">
      <section className="portal-lite-shell">
        <a href="/mediator">← Retour au portail</a>
        <h1>Messages</h1>
        <p>Les notifications importantes et les échanges avec ton médiateur.</p>
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
