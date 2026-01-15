import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Certificate {
  id: string;
  module_id: string | null;
  issued_at: string;
  content_modules?: {
    title: string;
  } | null;
}

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, content_modules(title)')
    .eq('user_id', user?.id || '')
    .order('issued_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-gray-600 mt-2">View and download your completion certificates</p>
      </div>

      {!certificates || certificates.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600 mb-4">You don't have any certificates yet.</p>
            <p className="text-gray-600 mb-4">Complete training modules to earn certificates.</p>
            <Link href="/modules">
              <Button>Browse Modules</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <CardTitle>
                  {(cert.content_modules as any)?.title || 'Training Certificate'}
                </CardTitle>
                <CardDescription>
                  Issued: {new Date(cert.issued_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/certificates/${cert.id}`}>
                  <Button className="w-full">View Certificate</Button>
                </Link>
                <Link href={`/certificates/${cert.id}`}>
                  <Button variant="outline" className="w-full">Download PDF</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
