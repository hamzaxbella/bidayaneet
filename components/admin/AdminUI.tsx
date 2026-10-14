"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, HeartHandshake, MapPin, ShieldAlert, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export type FormField = { name: string; label: string; type?: string; options?: string[]; required?: boolean; min?: number; max?: number };
export type FormStep = { title: string; fields: FormField[] };
export function Choice({ value, onChange, options, label, id, invalid, describedBy }: { value: string; onChange: (value: string) => void; options: string[]; label: string; id?: string; invalid?: boolean; describedBy?: string }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger id={id} aria-label={label} aria-invalid={invalid} aria-describedby={describedBy}><SelectValue placeholder={label}>{value || label}</SelectValue></SelectTrigger><SelectContent><SelectGroup>{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectGroup></SelectContent></Select>;
}

export function MultiStepForm({ title, steps, trigger, initial = {}, onSave, submitLabel = "Create", open: controlledOpen, onOpenChange }: { title: string; steps: FormStep[]; trigger?: ReactNode; initial?: Record<string, string>; onSave: (values: Record<string, string>) => void; submitLabel?: string; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [localOpen, setLocalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initial);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState("");
  const open = controlledOpen ?? localOpen;
  function changeOpen(next: boolean) { setLocalOpen(next); onOpenChange?.(next); if (next) { setStep(0); setError(""); setErrorField(""); setValues(initial); } }
  function invalidField(fields: FormField[]) {
    return fields.find(field => {
      const value = values[field.name]?.trim() ?? "";
      if (field.required && !value) return true;
      if (!value) return false;
      if (field.options && !field.options.includes(value)) return true;
      if (field.type === "email") return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (field.type === "date") return !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value));
      if (field.type === "number") return !Number.isInteger(Number(value)) || (field.min !== undefined && Number(value) < field.min) || (field.max !== undefined && Number(value) > field.max);
      return false;
    });
  }
  function reportInvalid(field: FormField) {
    setErrorField(field.name); setError(`Please enter a valid ${field.label.toLowerCase()}.`);
    requestAnimationFrame(() => document.getElementById(`${formId}-${field.name}`)?.focus());
  }
  function advance() { const invalid = invalidField(steps[step]?.fields ?? []); if (invalid) { reportInvalid(invalid); return; } setError(""); setErrorField(""); setStep(step + 1); }
  return <Dialog open={open} onOpenChange={changeOpen}>{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}<DialogContent className="admin-dialog"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Complete the details and review. Changes are saved on this device.</DialogDescription></DialogHeader><div className="admin-stepper" aria-label={`Step ${step + 1} of ${steps.length + 1}`}>{[...steps.map(item => item.title), "Review"].map((name,index) => <div key={name} data-active={index === step} data-complete={index < step} aria-current={index === step ? "step" : undefined}><span>{index < step ? <Check size={14} aria-hidden="true" /> : index + 1}</span>{name}</div>)}</div><form ref={formRef} noValidate onSubmit={event => {
    event.preventDefault();
    if (step < steps.length) advance();
    else { const invalid = invalidField(steps.flatMap(item => item.fields)); if (invalid) { setStep(steps.findIndex(item => item.fields.some(field => field.name === invalid.name))); reportInvalid(invalid); return; } onSave(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]))); changeOpen(false); }
  }}><FieldGroup>{step < steps.length ? steps[step].fields.map(field => {
    const invalid = errorField === field.name;
    const controlId = `${formId}-${field.name}`;
    const errorId = invalid ? `${formId}-error` : undefined;
    function change(value: string) { setValues(previous => ({ ...previous, [field.name]: value })); if (invalid) { setError(""); setErrorField(""); } }
    return <Field key={field.name} data-invalid={invalid}><FieldLabel htmlFor={controlId}>{field.label}{field.required ? " *" : ""}</FieldLabel>{field.options ? <Choice id={controlId} value={values[field.name] || ""} options={field.options} label={field.label} invalid={invalid} describedBy={errorId} onChange={change} /> : field.type === "textarea" ? <Textarea id={controlId} aria-invalid={invalid} aria-describedby={errorId} value={values[field.name] || ""} maxLength={3000} rows={3} onChange={event => change(event.target.value)} /> : <Input id={controlId} type={field.type || "text"} min={field.min} max={field.max} maxLength={field.type === "number" ? undefined : 300} aria-invalid={invalid} aria-describedby={errorId} value={values[field.name] || ""} onChange={event => change(event.target.value)} />}</Field>;
  }) : <dl className="admin-review">{steps.flatMap(item => item.fields).map(field => <div key={field.name}><dt>{field.label}</dt><dd>{values[field.name] || "—"}</dd></div>)}</dl>}</FieldGroup>{error && <Alert id={`${formId}-error`} variant="destructive" className="mt-3"><AlertDescription>{error}</AlertDescription></Alert>}<div className="admin-form-footer"><Button type="button" variant="outline" onClick={() => { setError(""); setErrorField(""); if (step) setStep(step - 1); else changeOpen(false); }}>{step ? "Back" : "Cancel"}</Button><Button type="submit">{step < steps.length ? "Next" : submitLabel}<ArrowRight data-icon="inline-end" /></Button></div></form></DialogContent></Dialog>;
}

export function ViewAll({ title, children, label = "View all" }: { title: string; children: ReactNode; label?: string }) {
  return <Dialog><DialogTrigger asChild><Button variant="ghost" size="sm">{label}<ArrowRight data-icon="inline-end"/></Button></DialogTrigger><DialogContent className="admin-dialog admin-list-dialog"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Browse the full list in this reporting period.</DialogDescription></DialogHeader><div className="admin-modal-list">{children}</div></DialogContent></Dialog>;
}

const pipeline = [
  {stage:"Identification",count:1842,pct:100}, {stage:"Activation",count:1102,pct:59.8}, {stage:"Classification",count:892,pct:48.4}, {stage:"Integration",count:682,pct:37}, {stage:"Stabilization (90d)",count:321,pct:17.4},
];
const blockers = [
  {name:"Trust & Engagement",desc:"Low trust in institutions, previous bad experiences",count:428,icon:HeartHandshake},
  {name:"Transport & Mobility",desc:"Distance, cost, limited public transport",count:362,icon:Truck},
  {name:"Family Constraints",desc:"Care responsibilities and family obligations",count:287,icon:Users},
  {name:"Dropout Risk",desc:"At risk of disengagement or returning to inactivity",count:213,icon:ShieldAlert},
  {name:"Skills & Training",desc:"Training access and skills gaps",count:186,icon:Users},
  {name:"Economic Constraints",desc:"Income and household financial pressure",count:142,icon:ShieldAlert},
];
export function PipelineCard() { return <section className="card admin-insight-card"><h2 className="section-title">NEET Journey Funnel</h2><p className="admin-muted">Progress from identification to lasting integration</p><div className="admin-pipeline">{pipeline.map((item,index) => <div key={item.stage}><div className="admin-row"><span><b className="admin-stage-number">{index+1}</b>{item.stage}</span><strong>{item.count.toLocaleString()} <small>{item.pct}%</small></strong></div><div className="admin-progress"><div style={{width:`${item.pct}%`}}/></div></div>)}</div></section>; }
export function BlockerList({ full = false }: {full?:boolean}) { return <div className="admin-blocker-list">{blockers.slice(0,full ? blockers.length : 4).map(item => <div className="admin-blocker" key={item.name}><span className="admin-icon-tile"><item.icon size={19}/></span><div><strong>{item.name}</strong><p>{item.desc}</p></div><Badge variant="secondary">{item.count} NEETs</Badge></div>)}</div>; }
export function BlockersCard() { return <section className="card admin-insight-card"><div className="admin-row"><h2 className="section-title">Top Blockers</h2><ViewAll title="All active blockers"><BlockerList full/></ViewAll></div><BlockerList/></section>; }
export function AdminHeader({ title, description, action }: {title:string;description:string;action?:ReactNode}) { return <header className="admin-header"><div className="admin-header-main"><div><h1>{title}</h1><p>{description}</p></div>{action}</div></header>; }
export function Summary({ items }: {items:{label:string;value:string|number}[]}) { return <div className="admin-summary">{items.map(item => <div className="kpi-card" key={item.label}><span className="admin-muted">{item.label}</span><strong>{item.value}</strong></div>)}</div>; }
export function RecordRow({ name, detail, aside }: {name:string;detail?:string;aside?:ReactNode}) { return <div className="admin-record-row"><div><strong>{name}</strong>{detail && <p className="admin-muted">{detail}</p>}</div>{aside}</div>; }
export function Location({ name }: {name:string}) { return <span className="admin-location"><MapPin size={14}/>{name}</span>; }
