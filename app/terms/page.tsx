import { TermsPageContent } from "@/components/terms/terms-page";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE.name}`,
  description: `Legal Terms for Writidian LLC. The agreement governing your access to and use of Writidian.`,
};

export default function TermsPage() {
  return (
    <SiteShell>
      <TermsPageContent />
    </SiteShell>
  );
}
