const items = [
  ['Atelier CV', 'Construire un CV clair en moins de deux heures.'],
  ['Révision CV', 'Recevoir une correction rapide avant de postuler.'],
  ['Journée recrutement', 'Rencontrer des partenaires et employeurs locaux.'],
];

export default function MicroActionsPage() {
  return (
    <main className="portal-lite-page">
      <section className="portal-lite-shell">
        <a href="/mediator">← Retour au portail</a>
        <h1>Micro-actions</h1>
        <p>Des actions courtes qui débloquent les prochaines étapes de ton parcours.</p>
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
