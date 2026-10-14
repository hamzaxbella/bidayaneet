"use client";
import Translated from "@/components/Translated";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useWorkspace } from "./LiveProvider";
import { useTranslation } from "@/components/LanguageProvider";
type Kind =
  | "program"
  | "offer"
  | "activity"
  | "membership"
  | "review"
  | "referral"
  | "link-account"
  | "followup"
  | "followup-result";
export default function BusinessAction({
  kind,
  id,
  children,
  className = "btn-primary",
}: {
  kind: Kind;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  const { data, command } = useWorkspace(),
    { locale } = useTranslation(),
    tr = (fr: string, ar: string) => (locale === "ar" ? ar : fr);
  const dialog = useRef<HTMLDialogElement>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const program = data.programs.find((p) => p.id === id),
    pd = program?.data as Record<string, unknown> | undefined,
    offer = data.offers.find((o) => o.id === id),
    youth = data.people.find((y) => y.id === id);
  const titles = {
    program: tr("Programme", "البرنامج"),
    offer: tr("Opportunité", "الفرصة"),
    activity: tr("Activité de terrain", "النشاط الميداني"),
    membership: tr("Participation au programme", "المشاركة في البرنامج"),
    review: tr("Validation du dossier", "التحقق من الملف"),
    referral: tr("Orientation avec accord du jeune", "التوجيه بموافقة الشاب"),
    "link-account": tr("Relier le compte jeune", "ربط حساب الشاب"),
    followup:tr("Planifier le suivi","برمجة المتابعة"),
    "followup-result":tr("Constat de suivi","نتيجة المتابعة"),
  };
  const style = { display: "grid", gap: 6, fontSize: 13 } as const,
    input = {
      padding: "10px 12px",
      border: "1px solid #DFE7E5",
      borderRadius: 8,
      width: "100%",
      background: "#F9FAFB",
    };
  const field = (
    name: string,
    label: string,
    value: string | number = "",
    type = "text",
  ) => (
    <label style={style}>
      {label}
      <input
        style={input}
        name={name}
        defaultValue={value}
        type={type}
        min={type === "number" ? 1 : undefined}
        maxLength={type === "text" ? 2000 : undefined}
        required
      />
    </label>
  );
  const select = (
    name: string,
    label: string,
    options: { id: string; label: string }[],
    value?: string,
  ) => (
    <label style={style}>
      {label}
      <select style={input} name={name} defaultValue={value} required>
        {!value && <option value="">{tr("Choisir…", "اختر…")}</option>}
        {options.map((o) => (
          <option value={o.id} key={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget),
      v = (n: string) => String(form.get(n) || ""),
      number = (n: string) => Number(v(n));
    setBusy(true);
    setError("");
    let action = "",
      payload: unknown;
    if (kind === "program") {
      if(Boolean(v('latitude'))!==Boolean(v('longitude'))){setBusy(false);setError(tr('Renseigne les deux coordonnées ou laisse-les vides.','أدخل الإحداثيين معاً أو اتركهما فارغين.'));return;}
      action = "editorial-save";
      payload = {
        id: id || crypto.randomUUID(),
        kind: "program",
        ownerId:v('ownerId')||undefined,
        published: form.has("published"),
        data: {
          title: v("title"),
          description: v("description"),
          organization: v("organization"),
          commune: v("commune"),
          capacity: number("capacity"),
          location:v('latitude')&&v('longitude')?{latitude:number('latitude'),longitude:number('longitude')}:undefined,
        },
      };
    }
    if (kind === "offer") {
      action = "save-offer";
      payload = {
        id,
        partnerId: !id&&v("partnerId") ? v("partnerId") : undefined,
        data: {
          title: v("title"),
          programId:v('programId')||undefined,
          organization: v("organization"),
          description: v("description"),
          commune: v("commune"),
          type: v("type"),
          capacity: number("capacity"),
          deadline: v("deadline"),
          minAge: number("minAge"),
          maxAge: number("maxAge"),
          education: v("education"),
          skills: v("skills"),
          partTime: form.has("partTime"),
          childcare: form.has("childcare"),
        },
      };
    }
    if (kind === "activity") {
      action = "activity";
      payload = {
        title: v("title"),
        commune: v("commune"),
        date: v("date"),
        category: v("category"),
        capacity: number("capacity"),
      };
    }
    if (kind === "membership") {
      action = "program-member";
      payload = { programId: id, youthId: v("youthId"), status: v("status") };
    }
    if (kind === "review") {
      action = "review";
      payload = { youthId: id, status: v("status"), note: v("note") };
    }
    if (kind === "link-account") {
      action = "link-account";
      payload = { youthId: id, userId: v("userId") };
    }
    if(kind==='followup'){action='followup';payload={youthId:id,dueDate:v('dueDate'),note:v('note'),outcome:'planned'};}
    if(kind==='followup-result'){action='complete-followup';payload={id,outcome:v('outcome'),note:v('note')};}
    if (kind === "referral") {
      action = "refer";
      payload = {
        youthId: id,
        offerId: v("offerId"),
        youthAgreed: form.has("agreed"),
      };
    }
    try {
      if (await command({ action, payload })) {
        dialog.current?.close();
      } else
        setError(
          tr(
            "Vérifie le message et les champs avant de réessayer.",
            "راجع الرسالة والحقول قبل المحاولة من جديد.",
          ),
        );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setError("");
          dialog.current?.showModal();
        }}
      >
        {children}
      </button>
      <dialog
        ref={dialog}
        className="business-dialog"
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
      >
        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{titles[kind]}</h2>
            <button
              type="button"
              className="icon-button"
              disabled={busy}
              aria-label={tr("Fermer", "إغلاق")}
              onClick={() => dialog.current?.close()}
            >
              <Translated value="×" />
            </button>
          </div>
          {error && (
            <p role="alert" style={{ color: "#AD2F2F" }}>
              {error}
            </p>
          )}
          {kind === "program" && (
            <>
              {data.user.role==='admin'&&select('ownerId',tr('Organisme responsable','المؤسسة المسؤولة'),[{id:data.user.id,label:tr('Administration','الإدارة')},...data.staff.filter(u=>u.role==='partner'&&u.active).map(u=>({id:String(u.id),label:String(u.name)}))],String(program?.owner_id||data.user.id))}
              {field("title", tr("Titre", "العنوان"), String(pd?.title || ""))}
              {field(
                "description",
                tr("Description", "الوصف"),
                String(pd?.description || ""),
              )}
              {field(
                "organization",
                tr("Organisme", "المؤسسة"),
                String(pd?.organization || ""),
              )}
              {field(
                "commune",
                tr("Commune", "الجماعة"),
                String(pd?.commune || ""),
              )}
              {field(
                "capacity",
                tr("Capacité", "الطاقة الاستيعابية"),
                Number(pd?.capacity || 20),
                "number",
              )}
              <details><summary>{tr('Emplacement du programme sur la carte (facultatif)','موقع البرنامج على الخريطة (اختياري)')}</summary><div style={{display:'grid',gap:12,marginTop:12}}>{(['latitude','longitude'] as const).map(key=><label style={style} key={key}>{key==='latitude'?tr('Latitude','خط العرض'):tr('Longitude','خط الطول')}<input style={input} name={key} type="number" step="any" min={key==='latitude'?-90:-180} max={key==='latitude'?90:180} defaultValue={(pd?.location as Record<string,number>|undefined)?.[key]??''} dir="ltr"/></label>)}</div></details>
              <label style={style}>
                <span>
                  <input
                    name="published"
                    type="checkbox"
                    defaultChecked={program ? !!program.published : true}
                  />{" "}
                  {tr("Publié", "منشور")}
                </span>
              </label>
            </>
          )}
          {kind === "offer" && (
            <><label style={style}>{tr('Programme associé (facultatif)','البرنامج المرتبط (اختياري)')}<select style={input} name="programId" defaultValue={offer?.data.programId||''}><option value="">{tr('Aucun programme','بدون برنامج')}</option>{data.programs.filter(p=>data.user.role==='admin'||p.owner_id===data.user.id).map(p=><option key={String(p.id)} value={String(p.id)}>{String((p.data as Record<string,unknown>).title)}</option>)}</select></label>
              {!id && data.user.role==='admin' &&
                select(
                  "partnerId",
                  tr("Partenaire responsable", "الشريك المسؤول"),
                  data.staff
                    .filter((u) => u.role === "partner" && u.active)
                    .map((u) => ({ id: String(u.id), label: String(u.name) })),
                )}
              {field("title", tr("Titre", "العنوان"), offer?.data.title || "")}
              {field(
                "organization",
                tr("Organisme", "المؤسسة"),
                offer?.data.organization || "",
              )}
              {field(
                "description",
                tr("Description", "الوصف"),
                offer?.data.description || "",
              )}
              {select(
                "type",
                tr("Type", "النوع"),
                ["Formation", "Emploi", "Stage", "Entrepreneuriat"].map(
                  (v) => ({ id: v, label: v }),
                ),
                offer?.data.type || "Formation",
              )}
              {field(
                "commune",
                tr("Commune", "الجماعة"),
                offer?.data.commune || "",
              )}
              {field(
                "capacity",
                tr("Capacité", "الطاقة الاستيعابية"),
                offer?.data.capacity || 10,
                "number",
              )}
              {field(
                "deadline",
                tr("Date limite", "آخر موعد"),
                offer?.data.deadline || "",
                "date",
              )}
              {field(
                "minAge",
                tr("Âge minimum", "الحد الأدنى للعمر"),
                offer?.data.minAge || 15,
                "number",
              )}
              {field(
                "maxAge",
                tr("Âge maximum", "الحد الأقصى للعمر"),
                offer?.data.maxAge || 29,
                "number",
              )}
              {select(
                "education",
                tr("Niveau requis", "المستوى المطلوب"),
                [
                  { id: "any", label: tr("Tous niveaux", "كل المستويات") },
                  { id: "bac", label: "Baccalauréat" },
                  { id: "qualified", label: tr("Qualification", "تأهيل") },
                ],
                offer?.data.education || "any",
              )}
              {field(
                "skills",
                tr("Compétences recherchées", "المهارات المطلوبة"),
                offer?.data.skills || "Tous profils",
              )}
              <label>
                <input
                  name="partTime"
                  type="checkbox"
                  defaultChecked={offer?.data.partTime}
                />{" "}
                {tr("Temps partiel possible", "إمكانية العمل الجزئي")}
              </label>
              <label>
                <input
                  name="childcare"
                  type="checkbox"
                  defaultChecked={offer?.data.childcare}
                />{" "}
                {tr("Solution de garde d’enfants", "حل لرعاية الأطفال")}
              </label>
            </>
          )}
          {kind === "activity" && (
            <>
              {field("title", tr("Titre", "العنوان"))}
              {field("commune", tr("Commune", "الجماعة"))}
              {field("date", tr("Date", "التاريخ"), "", "date")}
              {field(
                "capacity",
                tr("Capacité", "الطاقة الاستيعابية"),
                20,
                "number",
              )}
              {select(
                "category",
                tr("Catégorie", "الفئة"),
                ["Confiance", "Projet", "Compétences", "Orientation"].map(
                  (v) => ({ id: v, label: v }),
                ),
              )}
            </>
          )}
          {kind === "membership" && (
            <>
              {select(
                "youthId",
                tr("Dossier du jeune", "ملف الشاب"),
                data.people.map((p) => ({ id: p.id, label: p.data.name })),
              )}
              {select(
                "status",
                tr("État confirmé", "الحالة المؤكدة"),
                [
                  { id: "active", label: tr("Inscrit", "مسجل") },
                  {
                    id: "completed",
                    label: tr("Programme terminé", "البرنامج مكتمل"),
                  },
                  {
                    id: "interrupted",
                    label: tr("Participation interrompue", "المشاركة متوقفة"),
                  },
                ],
                "active",
              )}
            </>
          )}
          {(kind==='followup'||kind==='followup-result')&&<>{kind==='followup'?field('dueDate',tr('Date de suivi','موعد المتابعة'),'','date'):select('outcome',tr('Résultat constaté','النتيجة المثبتة'),[{id:'completed',label:tr('Contact effectué','تم التواصل')},{id:'unreachable',label:tr('Injoignable','تعذر التواصل')},{id:'dropout',label:tr('Interruption constatée','توقف مثبت')},{id:'inserted',label:tr('Entrée en activité constatée','بداية نشاط مثبتة')}],'completed')}<label style={style}>{tr('Note de suivi','ملاحظة المتابعة')}<textarea style={input} name="note" maxLength={1500} required/></label></>}
          {kind === "review" && (
            <>
              <strong>{youth?.data.name}</strong>
              {youth&&<dl className="diagnosis-review">{[[tr('Naissance','تاريخ الميلاد'),youth.data.birthDate],[tr('Téléphone','الهاتف'),youth.data.phone],[tr('Commune','الجماعة'),youth.data.commune],[tr('Niveau','المستوى'),({none:tr('Sans diplôme','بدون شهادة'),college:tr('Collège','إعدادي'),bac:tr('Baccalauréat','بكالوريا'),qualified:tr('Qualification','تأهيل')})[youth.data.education]],[tr('Situation','الوضع'),youth.data.situation==='inactive'?tr('Inactif','غير نشط'):tr('En recherche','يبحث عن فرصة')],[tr('Compétences','المهارات'),youth.data.skills],[tr('Intérêts','الاهتمامات'),youth.data.interests],[tr('Mobilité','التنقل'),youth.data.mobility==='local'?tr('Commune','الجماعة'):tr('Région','الجهة')],[tr('Garde d’enfants','رعاية الأطفال'),youth.data.childcare?tr('Oui','نعم'):tr('Non','لا')],[tr('Disponibilité','التفرغ'),youth.data.availability==='flexible'?tr('Flexible','مرن'):tr('Temps partiel','دوام جزئي')],[tr('Profil proposé','الفئة المقترحة'),youth.data.profile],[tr('Consentement recueilli','الموافقة المسجلة'),youth.data.consentAt],[tr('Représentant légal','الولي القانوني'),youth.data.guardianName||'—'],[tr('Transmission aux partenaires','الإرسال إلى الشركاء'),youth.data.partnerConsent?tr('Autorisée','مسموح'):tr('Non autorisée','غير مسموح')]].map(([label,value])=><div key={label}><dt>{label}</dt><dd dir="auto">{value}</dd></div>)}</dl>}

              {select(
                "status",
                tr("Décision", "القرار"),
                [
                  { id: "validated", label: tr("Valider", "التحقق") },
                  {
                    id: "revision",
                    label: tr("Demander une correction", "طلب تصحيح"),
                  },
                ],
                youth?.status === "revision" ? "revision" : "validated",
              )}
              <label style={style}>
                {tr(
                  "Note (obligatoire pour une correction)",
                  "ملاحظة (إلزامية لطلب التصحيح)",
                )}
                <textarea
                  name="note"
                  style={input}
                  maxLength={1000}
                  defaultValue={youth?.review_note}
                />
              </label>
            </>
          )}
          {kind === "link-account" && (
            <>
              <strong>{youth?.data.name}</strong>
              {select(
                "userId",
                tr("Compte jeune", "حساب الشاب"),
                data.contacts
                  .filter((c) => c.role === "neet")
                  .map((c) => ({ id: c.id, label: c.name + " · " + c.email })),
              )}
            </>
          )}
          {kind === "referral" && (
            <>
              <strong>{youth?.data.name}</strong>
              {select(
                "offerId",
                tr("Opportunité choisie", "الفرصة المختارة"),
                data.offers
                  .filter((o) => o.active)
                  .map((o) => ({
                    id: o.id,
                    label: o.data.title + " · " + o.data.organization,
                  })),
              )}
              <label>
                <input name="agreed" type="checkbox" required />{" "}
                {tr(
                  "Le jeune accepte cette orientation.",
                  "وافق الشاب على هذا التوجيه.",
                )}
              </label>
              <p style={{ color: "#7F8C9A", fontSize: 13 }}>
                {tr(
                  "La plateforme vérifie la validation du dossier, l’activation et les places disponibles avant la transmission.",
                  "تتحقق المنصة من اعتماد الملف والتفعيل والمقاعد المتاحة قبل الإرسال.",
                )}
              </p>
            </>
          )}
          <button className="btn-primary" disabled={busy}>
            {busy
              ? tr("Enregistrement…", "جارٍ الحفظ…")
              : tr("Enregistrer", "حفظ")}
          </button>
        </form>
      </dialog>
    </>
  );
}
