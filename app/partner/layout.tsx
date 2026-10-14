import { ProtectedWorkspace } from '@/components/workspace/ProtectedWorkspace';
export default function Layout({children}:{children:React.ReactNode}){return <ProtectedWorkspace role='partner'>{children}</ProtectedWorkspace>;}
