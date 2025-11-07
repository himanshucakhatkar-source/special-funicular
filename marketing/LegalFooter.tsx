import React from 'react';
import { Shield, Lock, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '../ui/logo';

interface LegalFooterProps {
  onNavigate?: (page: 'terms' | 'privacy' | 'security' | 'contact') => void;
}

export function LegalFooter({ onNavigate }: LegalFooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    legal: [
      { label: 'Terms of Service', page: 'terms' as const, icon: FileText },
      { label: 'Privacy Policy', page: 'privacy' as const, icon: Lock },
      { label: 'Security & Compliance', page: 'security' as const, icon: Shield },
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press Kit', href: '#press' },
    ],
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Integrations', href: '#integrations' },
      { label: 'Documentation', href: '#docs' },
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'API Reference', href: '#api' },
      { label: 'Status', href: '#status' },
      { label: 'Contact', page: 'contact' as const },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Building a Culture of Trust through transparent employee recognition and credit management.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  {link.page ? (
                    <button
                      onClick={() => onNavigate?.(link.page!)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Legal & Compliance
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate?.(link.page)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <Icon className="h-3.5 w-3.5 group-hover:text-primary" />
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a
                  href="mailto:support@honourus.com"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  support@honourus.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a
                  href="tel:+1-800-HONOURUS"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  +1 (800) HONOURUS
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Headquarters</p>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Security Badges */}
        <div className="border-t border-border pt-8 mb-8">
          <p className="text-sm font-medium mb-4">Enterprise-Grade Security & Compliance</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-medium">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border">
              <Lock className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border">
              <Shield className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-medium">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border">
              <Lock className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-medium">256-bit Encryption</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Honourus. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button
              onClick={() => onNavigate?.('terms')}
              className="hover:text-primary transition-colors"
            >
              Terms
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate?.('privacy')}
              className="hover:text-primary transition-colors"
            >
              Privacy
            </button>
            <span>•</span>
            <a href="#cookies" className="hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
