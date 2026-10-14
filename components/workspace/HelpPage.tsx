"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { EmptyState, PageIntro } from "./UI";

export default function HelpPage({ role }: { role: "neet" | "mediator" }) {
  const { text: uiText } = useUiTranslation();

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
            "Dans Mon profil, tu peux revoir tes informations et sélectionner ton CV. Les informations sont enregistrées dans la base de données et ton CV PDF est conservé dans ton espace privé.",
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
            "Ouvre Opportunités & orientations, choisis une offre puis un jeune. La sélection prépare une orientation. Depuis le dossier, confirme les étapes d’activation et l’accord du jeune avant de transmettre au partenaire.",
          ],
          [
            "Comment organiser un rendez-vous ?",
            "Depuis Mon agenda, ajoute un rendez-vous en indiquant le jeune, la date, l’heure, le lieu et le type de rencontre. Le rendez-vous est enregistré dans l’agenda du dossier.",
          ],
          [
            "Que contiennent les rapports ?",
            "Mon activité présente les suivis, les actions de terrain et les orientations de la période sélectionnée. Le téléchargement CSV contient ces données enregistrées.",
          ],
          [
            "Comment enregistrer une note de suivi ?",
            "Ouvre le dossier d’un jeune, puis saisis une note dans le formulaire de suivi. La note est enregistrée dans le dossier et visible par les professionnels autorisés.",
          ],
          [
            "Les comptes et données sont-ils réels ?",
            "Les comptes utilisent une authentification réelle. Les dossiers ajoutés depuis le mobile sont enregistrés dans la base, à côté des profils fictifs du catalogue de démonstration.",
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
        eyebrow={uiText("ON EST LÀ POUR TOI")}
        title={uiText("Comment peut-on t’aider ?")}
        description={uiText(
          "Des réponses simples pour avancer sereinement dans ton espace.",
        )}
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
            aria-label={uiText("Rechercher dans l’aide")}
            placeholder={uiText("Une question sur ton espace…")}
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
          title={uiText("Essayons autrement")}
          description={uiText(
            "Utilise un autre mot-clé ou ouvre une conversation pour demander de l’aide.",
          )}
        />
      )}
    </>
  );
}
