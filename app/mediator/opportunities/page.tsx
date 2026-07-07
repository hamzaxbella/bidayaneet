const items = [
  ['Développement Web Full Stack', 'Formation certifiante à Agadir avec stage inclus.'],
  ['Stage Marketing Digital', 'Trois mois pour pratiquer le contenu, les campagnes et l’analyse.'],
  ['Conseiller Client', 'Poste en CDI avec accompagnement pendant les premières semaines.'],
];

export default function OpportunitiesPage() {
  return (
    <main className="portal-lite-page">
      <section className="portal-lite-shell">
        <a href="/mediator">← Retour au portail</a>
        <h1>Mes opportunités</h1>
        <p>Les opportunités recommandées selon ton profil, tes intérêts et ta disponibilité.</p>
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
