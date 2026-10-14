import { notFound } from 'next/navigation';
import { currentUser } from '@/lib/server/auth';
import { loadPlatform } from '@/lib/server/platform';
import { CaseloadDetail } from '@/components/workspace/MediatorPages';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const user=await currentUser();if(!user||!(await loadPlatform(user)).people.some(p=>p.id===id))notFound();return <CaseloadDetail id={id}/>;}
