const items = [
  ['Centre d’aide', 'Trouver une réponse rapide sur ton parcours et tes démarches.'],
  ['Contacter l’équipe', 'Demander un appel ou un rendez-vous avec un médiateur.'],
  ['Confidentialité', 'Comprendre comment tes données sont protégées.'],
];

export default function HelpPage() {
  return (
    <main className="portal-lite-page">
      <section className="portal-lite-shell">
        <a href="/mediator">← Retour au portail</a>
        <h1>Aide</h1>
        <p>Un espace simple pour obtenir de l’aide et garder ton accompagnement clair.</p>
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
