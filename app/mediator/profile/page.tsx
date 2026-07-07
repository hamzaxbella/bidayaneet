const items = [
  ['Compétences', 'Marketing digital, relation client, outils bureautiques.'],
  ['Préférences', 'Agadir, horaires matin, formation courte ou stage.'],
  ['Documents', 'CV à finaliser, pièce d’identité validée.'],
];

export default function ProfilePage() {
  return (
    <main className="portal-lite-page">
      <section className="portal-lite-shell">
        <a href="/mediator">← Retour au portail</a>
        <h1>Mon profil</h1>
        <p>Les informations utilisées pour recommander les meilleures opportunités.</p>
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
