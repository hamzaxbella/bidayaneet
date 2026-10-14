import type { FormStep } from "./AdminUI";
import { communes } from "@/lib/admin-demo";
export const programSteps: FormStep[] = [
  {title:"Program",fields:[{name:"name",label:"Program name",required:true},{name:"desc",label:"Description",type:"textarea",required:true}]},
  {title:"Delivery",fields:[{name:"commune",label:"Commune",options:communes,required:true},{name:"capacity",label:"Enrollment capacity",type:"number",min:1,max:100000,required:true},{name:"status",label:"Status",options:["active","planned","paused"],required:true},{name:"duration",label:"Duration / rhythm"},{name:"eligibility",label:"Eligibility / participant needs",type:"textarea"}]},
];
