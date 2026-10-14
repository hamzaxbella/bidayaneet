"use client";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, CheckCircle2, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PartnerLogo from "@/components/PartnerLogo";
import { AdminHeader, MultiStepForm, Summary } from "@/components/admin/AdminUI";
import { programSeed, programVisual } from "@/lib/admin-demo";
import { useSimulatedState } from "@/lib/simulated-backend";
import { programSteps } from "@/components/admin/program-form";
export default function ProgramDetail({params}:{params:Promise<{id:string}>}) {
 const {id}=use(params);
 const [programs,setPrograms]=useSimulatedState("admin.programs",programSeed);
 const program=programs.find(p=>p.id===id);
 const image=programVisual(program?.name ?? "");
 if(!program) return <div className="admin-page"><AdminHeader title="Program not found" description="This program is unavailable on this device."/><div className="admin-content"><Button asChild variant="outline"><Link href="/programs">Back to programs</Link></Button></div></div>;
 return <div className="admin-page"><AdminHeader title={program.name} description="Program overview and enrollment" action={<MultiStepForm title="Edit program" steps={programSteps.map(step=>({...step,fields:step.fields.map(field=>field.name==="capacity"?{...field,min:Math.max(1,program.enrolled)}:field)}))} initial={{name:program.name,desc:program.desc,capacity:String(program.capacity),status:program.status,commune:program.commune,duration:program.duration||"",eligibility:program.eligibility||""}} trigger={<Button><Pencil data-icon="inline-start"/>Edit program</Button>} submitLabel="Save changes" onSave={values=>setPrograms(current=>current.map(p=>p.id===id?{...p,name:values.name.trim(),desc:values.desc.trim(),commune:values.commune,capacity:Number(values.capacity),status:values.status,duration:values.duration||"Flexible pathway",eligibility:values.eligibility||"Discuss participant needs with the program coordinator."}:p))}/>}/><div className="admin-content"><Button asChild variant="ghost" className="self-start"><Link href="/programs"><ArrowLeft data-icon="inline-start"/>Back to programs</Link></Button><Image className="admin-detail-cover" src={image.src} alt={image.alt} style={{objectPosition:image.position}} sizes="(max-width:760px) 94vw, 80vw" width={1280} height={520}/><div className="admin-row"><div className="admin-profile-name"><PartnerLogo name={program.name} size={64}/><div><h2 className="section-title">{program.name}</h2><p className="admin-muted">{program.desc}</p></div></div><Badge variant="secondary">{program.status}</Badge></div><Summary items={[{label:"Enrolled",value:program.enrolled},{label:"Capacity",value:program.capacity},{label:"Completed",value:program.completed},{label:"Dropout",value:`${program.dropout}%`}]}/><section className="card admin-insight-card"><h2 className="section-title">Program pathway</h2><p className="admin-muted">Delivery commune: {program.commune}</p><p className="admin-muted" style={{marginTop:10}}>Duration: {program.duration || "Flexible pathway"}</p><p className="admin-muted" style={{marginTop:10}}>Participant needs: {program.eligibility || "Discuss eligibility and support with the coordinator."}</p><div className="admin-spotlight-details" style={{marginTop:20}}><div><Building2/><div><strong>Partner coordination</strong><p className="admin-muted">Coordinated referrals and access to local opportunities.</p></div></div><div><Users/><div><strong>Participant support</strong><p className="admin-muted">Mediators support enrollment and follow-up.</p></div></div><div><CheckCircle2/><div><strong>Capacity available</strong><p className="admin-muted">{Math.max(0,program.capacity-program.enrolled)} places available.</p></div></div></div></section></div></div>;
}
