import { notFound } from 'next/navigation';
import { currentUser } from '@/lib/server/auth';
import { loadPlatform } from '@/lib/server/platform';
import { OpportunityDetail } from '@/components/workspace/YouthPages';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const user=await currentUser();if(!user||!(await loadPlatform(user)).offers.some(o=>o.id===id))notFound();return <OpportunityDetail id={id}/>;}
