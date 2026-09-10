import { Fragment, useEffect, useState, type CSSProperties } from "react";
import { ScrollArea } from "radix-ui";
import type { HighlightResult } from "@streamdown/code";
import "./highlighted-code.css";

export type CodeLanguage = "tsx" | "typescript" | "css" | "bash";

export function HighlightedCode({
  code,
  language = "tsx",
  label = "代码",
}: {
  code: string;
  language?: CodeLanguage;
  label?: string;
}) {
  const [highlighted, setHighlighted] = useState<{
    code: string;
    language: CodeLanguage;
    result: HighlightResult;
  } | null>(null);
  useEffect(() => {
    let current = true;
    const receive = (result: HighlightResult) => {
      if (current) setHighlighted({ code, language, result });
    };
    void import("@streamdown/code")
      .then(({ code: highlighter }) => {
        if (!current) return;
        const result = highlighter.highlight(
          { code, language, themes: ["github-light", "github-dark"] },
          receive,
        );
        if (result) receive(result);
      })
      .catch(() => {
        /* Plain text stays readable if highlighting cannot load. */
      });
    return () => {
      current = false;
    };
  }, [code, language]);
  const result =
    highlighted?.code === code && highlighted.language === language
      ? highlighted.result
      : null;
  return (
    <ScrollArea.Root className="code-scroll" type="auto">
      <ScrollArea.Viewport
        className="code-viewport"
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        <pre
          className="highlighted-code"
          data-language={language}
          data-highlighted={Boolean(result)}
        >
          <code>
            {result
              ? result.tokens.map((line, index) => (
                  <Fragment key={index}>
                    {index > 0 ? "\n" : null}
                    {line.map((token, i) => (
                      <span
                        key={i}
                        style={
                          {
                            ...token.htmlStyle,
                            fontStyle:
                              token.fontStyle && token.fontStyle & 1
                                ? "italic"
                                : undefined,
                          } as CSSProperties
                        }
                      >
                        {token.content}
                      </span>
                    ))}
                  </Fragment>
                ))
              : code}
          </code>
        </pre>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="code-scrollbar" orientation="vertical">
        <ScrollArea.Thumb className="code-scroll-thumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className="code-scrollbar" orientation="horizontal">
        <ScrollArea.Thumb className="code-scroll-thumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="code-scroll-corner" />
    </ScrollArea.Root>
  );
}
