"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { EmptyState, PageIntro } from "./UI";

export default function HelpPage({ role }: { role: "neet" | "mediator" }) {
  const [query, setQuery] = useState("");
  const questions =
    role === "neet"
      ? [
          [
            "Comment fonctionne mon accompagnement ?",
            "Ton médiateur apprend à te connaître, t’aide à clarifier tes envies et te propose des étapes adaptées. Tu peux avancer à ton rythme et demander de l’aide à chaque étape.",
          ],
          [
            "Comment trouver une formation ou un emploi ?",
            "Dans Opportunités, filtre les offres par type et par lieu. Ouvre une offre pour découvrir ses conditions, enregistre-la dans tes favoris et échange avec ton médiateur.",
          ],
          [
            "Comment préparer mon rendez-vous ?",
            "Note les métiers qui t’intéressent, les questions que tu veux poser et les difficultés que tu rencontres. Si tu as un CV, apporte-le. Tu n’as pas besoin d’avoir toutes les réponses.",
          ],
          [
            "Qu’est-ce qu’un petit pas ?",
            "C’est une action courte et concrète : un atelier CV, une découverte métier, un entretien de coaching. Choisis une activité dans Petits pas pour commencer.",
          ],
          [
            "Comment gérer mes informations ?",
            "Dans Mon profil, tu peux revoir tes informations et sélectionner ton CV. Dans cette version de démonstration, les changements restent dans ton navigateur et aucun fichier n’est transmis.",
          ],
          [
            "Puis-je utiliser le site sur mon téléphone ?",
            "Oui. Ouvre le menu en haut à gauche pour retrouver ton espace, tes opportunités et tes messages.",
          ],
        ]
      : [
          [
            "Comment prioriser les suivis ?",
            "Dans Jeunes accompagnés, utilise le filtre Prioritaire pour repérer les dossiers qui demandent un contact. Consulte le frein identifié et la prochaine action avant de préparer ton intervention.",
          ],
          [
            "Comment préparer une orientation ?",
            "Ouvre Opportunités & orientations, choisis une offre puis un jeune. La sélection est ajoutée au suivi de démonstration. La transmission à un partenaire nécessitera la connexion au service métier.",
          ],
          [
            "Comment organiser un rendez-vous ?",
            "Depuis Mon agenda, ajoute un rendez-vous en indiquant le jeune, la date, l’heure, le lieu et le type de rencontre. La confirmation est locale à la démonstration.",
          ],
          [
            "Que contiennent les rapports ?",
            "Mon activité présente les suivis, les actions de terrain et les orientations de la période de démonstration. Le téléchargement CSV permet de vérifier le format avant la connexion aux données réelles.",
          ],
          [
            "Comment enregistrer une note de suivi ?",
            "Ouvre le dossier d’un jeune, puis saisis une note dans le formulaire de suivi. Cette version ne sauvegarde pas de données sur un serveur.",
          ],
          [
            "Les comptes et données sont-ils réels ?",
            "Cet espace contient uniquement des exemples. Le service d’authentification et les données métier seront connectés séparément.",
          ],
        ];
  const filtered = questions.filter(([title, text]) =>
    `${title} ${text}`
      .toLocaleLowerCase("fr")
      .includes(query.toLocaleLowerCase("fr")),
  );
  return (
    <>
      <PageIntro
        eyebrow="ON EST LÀ POUR TOI"
        title="Comment peut-on t’aider ?"
        description="Des réponses simples pour avancer sereinement dans ton espace."
      />
      <section className="help-header">
        <h2>
          {role === "neet"
            ? "Tu peux toujours en parler."
            : "L’accompagnement commence par l’écoute."}
        </h2>
        <p>
          {role === "neet"
            ? "Ton médiateur est ton premier contact pour les opportunités, les ateliers et les prochaines étapes."
            : "Retrouve les échanges avec les jeunes et les partenaires dans ton espace messages."}
        </p>
        <Link href={`/${role}/messages`} className="button button-primary">
          <MessageCircle size={16} />
          {role === "neet"
            ? "Contacter ma médiatrice"
            : "Ouvrir mes conversations"}
          <ArrowRight size={15} />
        </Link>
      </section>
      <div className="filter-bar">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label="Rechercher dans l’aide"
            placeholder="Une question sur ton espace…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="faq-list">
        {filtered.map(([title, text]) => (
          <details key={title}>
            <summary>{title}</summary>
            <p>{text}</p>
          </details>
        ))}
      </div>
      {!filtered.length && (
        <EmptyState
          title="Essayons autrement"
          description="Utilise un autre mot-clé ou ouvre une conversation pour demander de l’aide."
        />
      )}
    </>
  );
}
