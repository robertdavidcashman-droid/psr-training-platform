import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CertificatePageProps {
  params: {
    id: string;
  };
}

export default async function CertificateDetailPage({ params }: CertificatePageProps) {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*, content_modules(title)')
    .eq('id', params.id)
    .eq('user_id', user?.id || '')
    .single();

  if (error || !certificate) {
    redirect('/certificates');
  }

  const moduleTitle = (certificate.content_modules as any)?.title || 'Training Certificate';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Certificate</h1>
        <p className="text-muted-foreground">View and download your certificate</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{moduleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-primary/20">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-navy-800 mb-2">Certificate of Completion</div>
              <div className="text-xl text-muted-foreground mb-6">This certifies that</div>
              <div className="text-3xl font-bold text-primary mb-6">
                {user?.profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-lg text-muted-foreground mb-6">
                has successfully completed
              </div>
              <div className="text-2xl font-semibold text-navy-800 mb-8">
                {moduleTitle}
              </div>
              <div className="text-sm text-muted-foreground">
                Issued: {new Date(certificate.issued_at).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="navy" 
              className="flex-1 gap-2"
              onClick={() => {
                window.print();
              }}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                window.history.back();
              }}
            >
              Back to Certificates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
