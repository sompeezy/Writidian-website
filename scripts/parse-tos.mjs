import fs from "node:fs";

const CONTACT = "info@writidian.com";
const PRIVACY_URL = "https://writidian.com/privacy";

let html = fs.readFileSync("tmp-tos.html", "utf8");
// Remove all style blocks (Termly appends a second one at the end)
html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
// Drop hidden Termly DSAR widget links
html = html.replace(/<div[^>]*style=["'][^"']*display:\s*none[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "");

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    );
}

function cleanText(s) {
  let t = decodeEntities(s)
    .replace(/\u00a0/g, " ")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/([.!?])([A-Z])/g, "$1 $2")
    .replace(/\s{2,}/g, " ")
    // Normalize quoted tokens: ' word ' -> 'word'
    .replace(/'\s*([^']+?)\s*'/g, (_, inner) => `'${inner.trim()}'`)
    .replace(/"\s*([^"]+?)\s*"/g, (_, inner) => `"${inner.trim()}"`)
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/',\s*'/g, "', '")
    .replace(/,\s*or\s+'/gi, ", or '")
    .replace(/\s{2,}/g, " ")
    .trim();

  t = t
    .replace(/_{3,}/g, CONTACT)
    .replace(/\b____\b/g, CONTACT)
    .replace(/\[\s*EMAIL\s*ADDRESS\s*\]/gi, CONTACT)
    .replace(/https?:\/\/writidian\.com\/privacy-policy\/?/gi, PRIVACY_URL)
    .replace(/\bwritidian\.com\/privacy\b/gi, PRIVACY_URL);

  return t;
}

function stripToText(s) {
  return cleanText(s.replace(/<[^>]+>/g, ""));
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

const lastUpdatedMatch = html.match(
  /Last updated<\/strong>\s*<bdt[^>]*>\s*<strong>([^<]+)<\/strong>/i,
);
const lastUpdated = lastUpdatedMatch?.[1]?.trim() ?? "April 16, 2026";

const ID_HINTS = {
  "our services": "services",
  "intellectual property rights": "ip",
  "user representations": "userreps",
  "user registration": "userreg",
  "purchases and payment": "purchases",
  subscriptions: "subscriptions",
  "prohibited activities": "prohibited",
  "user generated contributions": "ugc",
  "contribution licence": "license",
  "contribution license": "license",
  "mobile application licence": "mobile",
  "mobile application license": "mobile",
  "services management": "sitemanage",
  "privacy policy": "ppyes",
  "term and termination": "terms",
  "modifications and interruptions": "modifications",
  "governing law": "law",
  "dispute resolution": "disputes",
  corrections: "corrections",
  disclaimer: "disclaimer",
  "limitations of liability": "liability",
  indemnification: "indemnification",
  "user data": "userdata",
  "electronic communications, transactions, and signatures": "electronic",
  "california users and residents": "california",
  miscellaneous: "misc",
  "contact us": "contact",
};

function parseBlocks(chunk) {
  const blocks = [];
  let work = chunk
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Preserve links as readable text + URL when useful
  work = work.replace(
    /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, inner) => {
      const label = stripToText(inner);
      let url = href.trim();
      if (url.startsWith("#")) return label;
      if (url.startsWith("mailto:")) {
        return label || url.replace(/^mailto:/, "");
      }
      if (/writidian\.com\/privacy/i.test(url)) url = PRIVACY_URL;
      if (!label) return url;
      if (label === url || label.includes("writidian.com/privacy") || label.includes(PRIVACY_URL)) {
        return url;
      }
      if (/privacy policy|click here|^here$/i.test(label)) return `${label}: ${url}`;
      return label.includes("http") ? label : label;
    },
  );

  // Flatten soft wrapping from the Termly export before inserting markers
  work = work.replace(/[\r\n\t]+/g, " ");

  work = work.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => {
    const text = stripToText(t);
    return text ? `\n@@@H3@@@${text}\n` : "\n";
  });

  work = work.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => {
    const text = stripToText(t);
    return text ? `\n@@@LI@@@${text}` : "";
  });
  work = work.replace(/<\/?(?:ul|ol)[^>]*>/gi, "\n");

  work = work
    .replace(/<\/div>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    // Empty (not space) so tags mid-word like <strong>y</strong><strong>ou</strong> stay intact
    .replace(/<[^>]+>/g, "");

  const lines = work
    .split(/\n+/)
    .map((l) => cleanText(l))
    .filter(Boolean)
    // Drop CSS leftovers if any
    .filter((l) => !/[{};]/.test(l) || l.length > 80)
    .filter((l) => !/^(ul|ol|li)\b/.test(l) && !/list-style-type|font-family:/.test(l));

  let listBuf = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push({ type: "list", items: [...listBuf] });
      listBuf = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("@@@H3@@@")) {
      flushList();
      const text = line.slice(8).trim();
      if (text) blocks.push({ type: "h3", text });
      continue;
    }
    if (line.startsWith("@@@LI@@@")) {
      const text = line.slice(8).trim();
      if (text) listBuf.push(text);
      continue;
    }
    flushList();
    if (/^[\s•\-–—]+$/.test(line)) continue;
    blocks.push({ type: "p", text: line });
  }
  flushList();

  // Merge consecutive short fragments that clearly belong together
  const merged = [];
  for (const b of blocks) {
    const prev = merged[merged.length - 1];
    if (
      b.type === "p" &&
      prev?.type === "p" &&
      prev.text.length < 40 &&
      !/[.!?]"?$/.test(prev.text) &&
      /^[a-z]/.test(b.text) &&
      !/@/.test(b.text) &&
      !/^https?:/i.test(b.text)
    ) {
      prev.text = cleanText(`${prev.text} ${b.text}`);
    } else {
      merged.push(b);
    }
  }

  return merged
    .reduce((acc, b) => {
      if (b.type === "p" && /^[-•]\s+/.test(b.text)) {
        const item = b.text.replace(/^[-•]\s+/, "");
        const prev = acc[acc.length - 1];
        if (prev?.type === "list") {
          prev.items.push(item);
        } else {
          acc.push({ type: "list", items: [item] });
        }
        return acc;
      }
      acc.push(b);
      return acc;
    }, [])
    .filter((b) => {
      if (b.type === "p") return b.text.length > 1;
      if (b.type === "h3") return b.text.length > 1;
      if (b.type === "list") return b.items.length > 0;
      return true;
    });
}

const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
const h2Matches = [...html.matchAll(h2Re)];

const rawSections = [];
for (let i = 0; i < h2Matches.length; i++) {
  const title = stripToText(h2Matches[i][1]);
  const start = h2Matches[i].index + h2Matches[i][0].length;
  const end = i + 1 < h2Matches.length ? h2Matches[i + 1].index : html.length;
  rawSections.push({ title, chunk: html.slice(start, end) });
}

const SKIP = new Set(["TABLE OF CONTENTS", "TERMS OF SERVICE"]);

const sections = [];
let agreementBlocks = [];

for (const s of rawSections) {
  const upper = s.title.toUpperCase();
  if (SKIP.has(upper)) continue;
  const blocks = parseBlocks(s.chunk);

  if (upper.includes("AGREEMENT")) {
    agreementBlocks = blocks;
    continue;
  }

  const key = s.title.replace(/^\d+\.\s*/, "").toLowerCase();
  const id = ID_HINTS[key] || slugify(s.title);
  sections.push({ id, title: s.title, blocks });
}

for (const section of sections) {
  if (section.id !== "contact") continue;
  // Keep company + address + email; drop junk
  section.blocks = section.blocks.filter((b) => {
    if (b.type !== "p") return true;
    if (/termly\.io/i.test(b.text)) return false;
    if (/[{};]|list-style|font-family/.test(b.text)) return false;
    return true;
  });
  const hasEmail = section.blocks.some(
    (b) => b.type === "p" && /@/.test(b.text),
  );
  if (!hasEmail) {
    section.blocks.push({ type: "p", text: CONTACT });
  }
}

// Fix privacy section to point at /privacy
for (const section of sections) {
  if (section.id !== "ppyes") continue;
  section.blocks = section.blocks.map((b) => {
    if (b.type !== "p") return b;
    let text = b.text;
    if (/privacy/i.test(text) && !text.includes(PRIVACY_URL) && !text.includes("/privacy")) {
      text = text.replace(/writidian\.com\/privacy\/?/gi, PRIVACY_URL);
      if (!text.includes("http")) {
        text = text.replace(/:\s*$/, "") + `: ${PRIVACY_URL}`;
      }
    }
    return { ...b, text };
  });
}

const toc = sections.map((s) => ({ id: s.id, title: s.title }));

const out = {
  title: "Terms of Service",
  lastUpdated,
  agreementBlocks,
  toc,
  sections,
};

fs.writeFileSync("tmp-tos-parsed.json", JSON.stringify(out, null, 2));

function esc(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${")
    .replaceAll(CONTACT, "${CONTACT_EMAIL}");
}

function emitBlock(b, indent = "    ") {
  if (b.type === "p") {
    return `${indent}{ type: "p", text: \`${esc(b.text)}\` }`;
  }
  if (b.type === "h3") {
    return `${indent}{ type: "h3", text: \`${esc(b.text)}\` }`;
  }
  if (b.type === "list") {
    const items = b.items
      .map((item) => `${indent}  \`${esc(item)}\``)
      .join(",\n");
    return `${indent}{ type: "list", items: [\n${items}\n${indent}] }`;
  }
  return `${indent}{ type: "p", text: \`\` }`;
}

const ts = `import { CONTACT_EMAIL } from "@/lib/constants";

export type TermsBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] };

export type TermsSection = {
  id: string;
  title: string;
  blocks: TermsBlock[];
};

export type TermsTocItem = {
  id: string;
  title: string;
};

export const TERMS = {
  title: "Terms of Service",
  lastUpdated: "${esc(lastUpdated)}",
  agreementBlocks: [
${agreementBlocks.map((b) => emitBlock(b)).join(",\n")}
  ] as TermsBlock[],
  toc: [
${toc.map((t) => `    { id: "${t.id}", title: \`${esc(t.title)}\` }`).join(",\n")}
  ] as TermsTocItem[],
  sections: [
${sections
  .map(
    (s) => `    {
      id: "${s.id}",
      title: \`${esc(s.title)}\`,
      blocks: [
${s.blocks.map((b) => emitBlock(b, "        ")).join(",\n")}
      ],
    }`,
  )
  .join(",\n")}
  ] as TermsSection[],
} as const;
`;

fs.writeFileSync("lib/terms.ts", ts);
console.log("Wrote lib/terms.ts");
console.log("lastUpdated", lastUpdated);
console.log("agreement", agreementBlocks.length, "sections", sections.length);
for (const s of sections) {
  const p = s.blocks.find((b) => b.type === "p");
  console.log(
    "-",
    s.id,
    s.blocks.length,
    (p?.text || "").slice(0, 100).replace(/\s+/g, " "),
  );
}
console.log("--- agreement[0] ---");
console.log(agreementBlocks[0]?.text);
console.log("--- contact ---");
console.log(sections.find((s) => s.id === "contact")?.blocks);
console.log("--- indemnification ---");
console.log(sections.find((s) => s.id === "indemnification")?.blocks[0]?.text?.slice(0, 200));
