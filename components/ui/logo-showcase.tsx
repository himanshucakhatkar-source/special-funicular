import React from 'react';
import { Logo } from './logo';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export function LogoShowcase() {
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Logo Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Different sizes */}
        <div className="space-y-4">
          <h3 className="font-medium">Sizes</h3>
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <Logo size="md" />
            <Logo size="lg" />
          </div>
        </div>

        {/* Logo only variants */}
        <div className="space-y-4">
          <h3 className="font-medium">Logo Only</h3>
          <div className="flex items-center gap-6">
            <Logo size="sm" showText={false} />
            <Logo size="md" showText={false} />
            <Logo size="lg" showText={false} />
          </div>
        </div>

        {/* Dark background test */}
        <div className="space-y-4">
          <h3 className="font-medium">On Dark Background</h3>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center gap-6">
              <Logo size="sm" variant="dark" />
              <Logo size="md" variant="dark" />
              <Logo size="lg" variant="dark" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}