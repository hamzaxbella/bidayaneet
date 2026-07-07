const items = [
  ['Identifié', 'Ton profil est connu par la plateforme.'],
  ['Activé', 'Tu as commencé ton accompagnement.'],
  ['Classé', 'Tes besoins et intérêts sont clarifiés.'],
  ['Intégré', 'Tu avances vers une formation, un stage ou un emploi.'],
];

export default function JourneyPage() {
  return (
    <main className="portal-lite-page">
      <section className="portal-lite-shell">
        <a href="/mediator">← Retour au portail</a>
        <h1>Mon parcours</h1>
        <p>Une vue simple de tes étapes vers l’intégration professionnelle durable.</p>
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
