import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'BidayaNeet - Super Admin Dashboard',
  description: 'Regional monitoring and management platform for NEET youth integration in Souss-Massa',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}
