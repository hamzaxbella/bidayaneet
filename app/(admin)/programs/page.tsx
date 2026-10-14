"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { programSteps } from "@/components/admin/program-form";
import { Plus, ArrowUpRight, Search, MapPin } from "lucide-react";
import PartnerLogo from "@/components/PartnerLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { AdminHeader, MultiStepForm, Summary, ViewAll, RecordRow, Choice } from "@/components/admin/AdminUI";
import { programSeed, programVisual, normalizeAdminSearch, communes } from "@/lib/admin-demo";
import { useSimulatedState } from "@/lib/simulated-backend";

export default function ProgramsPage() {
  const [programs, setPrograms] = useSimulatedState("admin.programs", programSeed);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [commune, setCommune] = useState("All communes");
  const totalEnrolled = programs.reduce((total, program) => total + program.enrolled, 0);
  const completed = programs.reduce((total, program) => total + program.completed, 0);
  const filtered = programs.filter((program) => (status === "All statuses" || status === program.status) && (commune === "All communes" || commune === program.commune) && normalizeAdminSearch(`${program.name} ${program.desc}`).includes(normalizeAdminSearch(query)));
  return <div className="admin-page"><AdminHeader title="Programs" description="Collaborating programs and pathways into employment" action={<MultiStepForm title="Add Program" steps={programSteps} initial={{ status: "active", capacity: "30", commune: "Agadir" }} trigger={<Button><Plus data-icon="inline-start" />Add Program</Button>} submitLabel="Create program" onSave={(values) => setPrograms((current) => [{ id: crypto.randomUUID(), name: values.name, desc: values.desc, commune: values.commune, capacity: Number(values.capacity), status: values.status, duration: values.duration || "Flexible pathway", eligibility: values.eligibility || "Discuss participant needs with the program coordinator.", enrolled: 0, completed: 0, dropout: 0, color: "#008477" }, ...current])} />} />
    <div className="admin-content"><Summary items={[{ label: "Total programs", value: programs.length }, { label: "Active programs", value: programs.filter((program) => program.status === "active").length }, { label: "NEETs enrolled", value: totalEnrolled.toLocaleString() }, { label: "Completion rate", value: totalEnrolled ? `${Math.round(completed / totalEnrolled * 100)}%` : "0%" }]} />
      <div className="admin-section-header"><h2 className="section-title">Collaborating Programs</h2><ViewAll title="All collaborating programs">{programs.map((program) => <RecordRow key={program.id} name={program.name} detail={program.desc} aside={<Button asChild variant="outline" size="sm"><Link href={`/programs/${program.id}`}>View program</Link></Button>} />)}</ViewAll></div>
      <div className="admin-toolbar"><InputGroup><InputGroupInput aria-label="Search programs" placeholder="Search partner or pathway…" value={query} onChange={(event) => setQuery(event.target.value)} /><InputGroupAddon><Search /></InputGroupAddon></InputGroup><Choice label="Program status" value={status} onChange={setStatus} options={["All statuses", "active", "planned", "paused"]} /><Choice label="Program commune" value={commune} onChange={setCommune} options={["All communes", ...communes]} /><Button variant="outline" onClick={() => { setQuery(""); setStatus("All statuses"); setCommune("All communes"); }}>Reset filters</Button></div>
      <p className="admin-muted" aria-live="polite">{filtered.length} programs found</p>
      <div className="admin-card-grid">{filtered.map((program) => { const image = programVisual(program.name); return <Card className="admin-program-card" key={program.id}><Image className="admin-program-cover" src={image.src} alt={image.alt} width={640} height={360} sizes="(max-width: 760px) 94vw, (max-width: 1200px) 45vw, 28vw" style={{ objectPosition: image.position }} /><CardHeader><PartnerLogo name={program.name} size={44} /><div><CardTitle><h3>{program.name}</h3></CardTitle><Badge variant="secondary">{program.status}</Badge></div></CardHeader><CardContent><CardDescription>{program.desc}</CardDescription><span className="admin-location"><MapPin size={14} />{program.commune}</span><div><div className="admin-row"><span className="admin-muted">Enrollment</span><strong>{program.enrolled} / {program.capacity}</strong></div><div className="admin-progress"><div style={{ width: `${Math.min(100, program.enrolled / program.capacity * 100)}%` }} /></div></div><div className="admin-row"><span className="admin-muted">{program.completed} completed</span><span className="admin-muted">{program.dropout}% dropout</span></div></CardContent><CardFooter><Button asChild variant="outline"><Link href={`/programs/${program.id}`}>View program<ArrowUpRight data-icon="inline-end" /></Link></Button></CardFooter></Card>; })}</div>
      {!filtered.length && <Empty><EmptyHeader><EmptyTitle>No matching programs</EmptyTitle><EmptyDescription>Try a broader search or reset the filters.</EmptyDescription></EmptyHeader></Empty>}
    </div>
  </div>;
}
