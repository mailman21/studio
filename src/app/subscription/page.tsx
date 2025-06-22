
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const includedFeatures = [
  'Unlimited match logging',
  'Advanced dashboard analytics',
  'Coach feedback and reports',
  'Direct Xero integration',
];

export default function SubscriptionPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Subscription" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col items-center">
        <div className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing Plans</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that's right for your refereeing journey. Unlock powerful features to elevate your game.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          
          {/* Free Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Hobbyist</CardTitle>
              <CardDescription>For referees getting started and logging a few matches.</CardDescription>
              <div className="flex items-baseline gap-x-2 pt-4">
                <span className="text-4xl font-bold tracking-tight">$0</span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm leading-6">
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                  Up to 3 past matches
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                  Basic dashboard
                </li>
                 <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                  Community support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="flex flex-col ring-2 ring-primary">
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>For the dedicated referee who wants to unlock their full potential.</CardDescription>
               <div className="flex items-baseline gap-x-2 pt-4">
                <span className="text-4xl font-bold tracking-tight">$15</span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
               <ul className="space-y-3 text-sm leading-6">
                {includedFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Upgrade to Professional
              </Button>
            </CardFooter>
          </Card>
          
          {/* Enterprise Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Association</CardTitle>
              <CardDescription>For referee societies and organizations managing multiple referees.</CardDescription>
               <div className="flex items-baseline gap-x-2 pt-4">
                 <span className="text-4xl font-bold tracking-tight">Custom</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
               <ul className="space-y-3 text-sm leading-6">
                 <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    Everything in Professional, plus:
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    Centralized billing
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    Admin & Coach accounts
                  </li>
                   <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    Dedicated support
                  </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </CardFooter>
          </Card>

        </div>
      </main>
    </div>
  );
}
