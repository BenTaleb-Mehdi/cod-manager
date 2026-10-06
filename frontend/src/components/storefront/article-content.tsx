import React from "react";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Split into paragraphs / blocks
  const blocks = content.split("\n\n");

  return (
    <div className="space-y-6 text-[#18221D] font-sans leading-relaxed text-sm sm:text-base">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // Horizontal divider
        if (trimmed === "---") {
          return <hr key={idx} className="my-8 border-[#E8E2D8]" />;
        }

        // H3 heading
        if (trimmed.startsWith("### ")) {
          const title = trimmed.replace("### ", "");
          return (
            <h3
              key={idx}
              className="font-serif text-2xl sm:text-3xl text-[#0B2D23] font-normal pt-4 tracking-tight"
            >
              {title}
            </h3>
          );
        }

        // H2 heading
        if (trimmed.startsWith("## ")) {
          const title = trimmed.replace("## ", "");
          return (
            <h2
              key={idx}
              className="font-serif text-3xl sm:text-4xl text-[#0B2D23] font-normal pt-6 tracking-tight"
            >
              {title}
            </h2>
          );
        }

        // Blockquote
        if (trimmed.startsWith("> ")) {
          const quote = trimmed.replace(/^>\s*/, "").replace(/[*_]/g, "");
          return (
            <blockquote
              key={idx}
              className="my-6 border-l-2 border-[#C5A880] pl-6 py-2 italic font-serif text-base sm:text-lg text-[#0B2D23] bg-[#F7F3EC]/50 rounded-r-xl"
            >
              {quote}
            </blockquote>
          );
        }

        // Markdown Table
        if (trimmed.startsWith("|") && trimmed.includes("\n|")) {
          const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
          const headerRow = lines[0]
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean);
          const dataRows = lines.slice(2).map((line) =>
            line
              .split("|")
              .map((c) => c.trim())
              .filter(Boolean)
          );

          return (
            <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-[#E8E2D8] bg-[#FDFCF9]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#0B2D23] text-[#FAF7F2]">
                  <tr>
                    {headerRow.map((h, i) => (
                      <th key={i} className="py-3 px-4 font-semibold tracking-wider uppercase text-[11px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8]">
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#FAF7F2]">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-4 font-medium text-[#0B2D23]">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Bullet lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed
            .split("\n")
            .filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))
            .map((l) => l.replace(/^[-*]\s*/, ""));

          return (
            <ul key={idx} className="space-y-2.5 my-4 pl-1">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#18221D]/80">
                  <span className="text-[#C5A880] text-sm leading-none mt-1">✦</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#0B2D23] font-bold">$1</strong>'),
                    }}
                  />
                </li>
              ))}
            </ul>
          );
        }

        // Ordered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed
            .split("\n")
            .filter((l) => /^\d+\.\s/.test(l.trim()))
            .map((l) => l.replace(/^\d+\.\s*/, ""));

          return (
            <ol key={idx} className="space-y-2.5 my-4 list-decimal pl-5 marker:text-[#C5A880] marker:font-bold">
              {items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="text-xs sm:text-sm text-[#18221D]/80 pl-1"
                  dangerouslySetInnerHTML={{
                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#0B2D23] font-bold">$1</strong>'),
                  }}
                />
              ))}
            </ol>
          );
        }

        // Standard paragraph (with **bold** support)
        const formatted = trimmed.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="text-[#0B2D23] font-semibold">$1</strong>'
        );

        return (
          <p
            key={idx}
            className="text-xs sm:text-base text-[#18221D]/80 leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
}
