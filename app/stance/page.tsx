import { PageHero, Prose, ProseSection } from "@/components/page-chrome";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Our Stance on AI — ${SITE.name}`,
  description:
    "Writidian takes the other path. No generators. No rewrite buttons. A space that asks you to think.",
};

export default function StancePage() {
  return (
    <SiteShell>
      <section data-cursor-tone="light" className="bg-paper pt-6 sm:pt-10">
        <PageHero
          title="Our stance on AI"
          lead="For people who still want to think on the page."
        />
        <Prose>
          <ProseSection title="The short version">
            <p>
              Writidian does not include AI writing generators, autocomplete that
              finishes your sentences for you, or one-click rewrite tools. The
              craft stays with you.
            </p>
          </ProseSection>

          <ProseSection title="Why">
            <p>
              AI has thinned the art of writing and the wellbeing that comes
              with doing hard creative work yourself. When the blank page is
              always optional, the muscle for original thought atrophies.
            </p>
            <p>
              Writidian takes the other path. No generators. No rewrite buttons.
              A space that asks you to think — with soundscapes, prompts, and an
              editor built for immersion, not outsourcing.
            </p>
          </ProseSection>

          <ProseSection title="What we will and will not do">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                We will not train generative models on your private drafts.
              </li>
              <li>
                We will not ship features whose primary job is to write or
                rewrite your work for you.
              </li>
              <li>
                We may use ordinary software tooling (hosting, security,
                analytics, infrastructure) that happens to involve machine
                learning, without turning Writidian into an AI writing product.
              </li>
            </ul>
          </ProseSection>

          <ProseSection title="Who this is for">
            <p>
              If you want a sanctuary for intentional writing — journaling,
              fiction, essays, or daily practice — you are in the right place.
              If you want an AI co-author, there are many other tools. This one
              is for the human writer.
            </p>
          </ProseSection>
        </Prose>
      </section>
    </SiteShell>
  );
}
