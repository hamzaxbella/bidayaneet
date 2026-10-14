"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { EmptyState, PageIntro } from "./UI";
import { normalizeArabicSearch } from "@/lib/youth-ar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function HelpPage({ role }: { role: "neet" | "mediator" }) {
  const text = (fr: string, ar: string) => (role === "neet" ? ar : fr);
  const [query, setQuery] = useState("");
  const questions =
    role === "neet"
      ? [
          [
            "كيف تتم مواكبتي؟",
            "تتعرّف وسيطتك على مسارك وتساعدك على تحديد طموحاتك وتقترح خطوات تناسبك. تقدّم حسب إيقاعك واطلب المساعدة في كل مرحلة.",
          ],
          [
            "كيف أجد تكويناً أو عملاً؟",
            "في صفحة الفرص، اختر النوع والمدينة. افتح فرصة لمعرفة شروطها واحفظها في المفضلة وتحدّث عنها مع وسيطتك.",
          ],
          [
            "كيف أستعد لموعدي؟",
            "دوّن المهن التي تهمّك وأسئلتك والصعوبات التي تواجهها. أحضر سيرتك الذاتية إن توفّرت. لا تحتاج إلى كل الإجابات مسبقاً.",
          ],
          [
            "ما المقصود بخطوة صغيرة؟",
            "نشاط قصير وعملي، مثل ورشة سيرة ذاتية أو اكتشاف مهنة أو مقابلة مواكبة. اختر نشاطاً من صفحة الخطوات الصغيرة لتبدأ.",
          ],
          [
            "كيف أعدّل معلوماتي؟",
            "في ملفي، يمكنك تعديل معلوماتك واختيار سيرتك الذاتية. في النسخة التجريبية تبقى التعديلات في متصفحك ولا يُرسل أي ملف.",
          ],
          [
            "هل يمكنني استخدام الموقع من الهاتف؟",
            "نعم. افتح القائمة في أعلى اليمين لتجد فرصك ورسائلك ومسارك.",
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
  const normalize = role === "neet" ? normalizeArabicSearch : (value: string) => value.toLocaleLowerCase("fr");
  const filtered = questions.filter(([title, text]) => normalize(`${title} ${text}`).includes(normalize(query)));
  return (
    <>
      <PageIntro
        eyebrow={text("ON EST LÀ POUR TOI", "نحن إلى جانبك")}
        title={text("Comment peut-on t’aider ?", "كيف يمكننا مساعدتك؟")}
        description={text(
          "Des réponses simples pour avancer sereinement dans ton espace.",
          "إجابات بسيطة لتتقدّم بثقة في فضائك.",
        )}
      />
      <section className="help-header">
        <h2>
          {role === "neet"
            ? "يمكنك التحدّث دائماً."
            : "L’accompagnement commence par l’écoute."}
        </h2>
        <p>
          {role === "neet"
            ? "وسيطتك هي أول من تتواصل معه بشأن الفرص والورشات والخطوات المقبلة."
            : "Retrouve les échanges avec les jeunes et les partenaires dans ton espace messages."}
        </p>
        <Link href={`/${role}/messages`} className="button button-primary">
          <MessageCircle size={16} />
          {role === "neet" ? "تواصل مع وسيطتي" : "Ouvrir mes conversations"}
          <ArrowRight className={role === "neet" ? "youth-forward-arrow" : undefined} size={15} />
        </Link>
      </section>
      <div className="filter-bar">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            aria-label={text("Rechercher dans l’aide", "البحث في المساعدة")}
            placeholder={text(
              "Une question sur ton espace…",
              "سؤال حول فضائك…",
            )}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
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
          title={text("Essayons autrement", "لنجرّب طريقة أخرى")}
          description={text(
            "Utilise un autre mot-clé ou ouvre une conversation pour demander de l’aide.",
            "جرّب كلمة أخرى أو افتح محادثة لطلب المساعدة.",
          )}
        />
      )}
    </>
  );
}
