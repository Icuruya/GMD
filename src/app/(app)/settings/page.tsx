import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and subscription preferences."
      />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">User Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="GMD User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="user@gmd.com" disabled />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Subscription</CardTitle>
              <CardDescription>Manage your billing and plan details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-sm text-muted-foreground">You are currently on the Professional tier.</p>
                    </div>
                    <Badge variant="default" className="bg-primary/90 text-primary-foreground">Professional</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Your plan renews on December 31, 2024.</p>
                    <Button variant="accent">Upgrade Plan</Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
