import React, { useState } from "react";
import { ROUTES_AREA, SIDEBAR_NAV_AREA } from "@hermes/plugin-sdk";

const h = React.createElement;
const sample = {
  id: "sample",
  revision: 0,
  theme: "ink",
  slides: [
    {
      id: "s1",
      layout: "hero",
      kicker: "FIELD NOTES / 01",
      headline: "Make room for better ideas.",
      body: "A sample deck about focused creative work. Edit any text, then invite Hermes into the details.",
    },
    {
      id: "s2",
      layout: "split",
      kicker: "THE CHALLENGE",
      headline: "Attention is a finite resource.",
      body: "Fewer inputs. Clearer priorities. More space to think.\nDesign the conditions before you demand the outcome.",
    },
    {
      id: "s3",
      layout: "statement",
      kicker: "A PRINCIPLE",
      headline: "Clarity is a creative advantage.",
      body: "Say one thing well.",
    },
    {
      id: "s4",
      layout: "split",
      kicker: "THE PRACTICE",
      headline: "Start small. Stay deliberate.",
      body: "Choose one question.\nMake a rough version.\nShare it early.\nRefine what matters.",
    },
    {
      id: "s5",
      layout: "hero",
      kicker: "NEXT CHAPTER",
      headline: "Build something worth sharing.",
      body: "Create a little space today. See what grows.",
    },
  ],
};
const css = `
.ss{font:14px Georgia,serif;color:var(--ui-text-primary);background:var(--ui-bg-base);height:100%;min-height:100vh;display:flex;flex-direction:column}.ss *{box-sizing:border-box}.ss button,.ss input,.ss textarea,.ss select{font:13px sans-serif;color:inherit;background:var(--ui-bg-elevated);border:1px solid var(--ui-stroke-secondary);border-radius:7px;padding:9px}.ss button{cursor:pointer}.ss button:disabled{opacity:.4}.ss header{display:flex;align-items:center;gap:10px;padding:18px;border-bottom:1px solid var(--ui-stroke-secondary);flex-wrap:wrap}.ss header strong{font-size:22px;margin-right:auto}.ss main{display:grid;grid-template-columns:180px minmax(300px,1fr) 260px;flex:1;min-height:0}.ss nav,.ss aside{padding:16px;border-right:1px solid var(--ui-stroke-secondary);overflow:auto}.ss nav button{display:block;width:100%;margin-bottom:12px;text-align:left;min-height:75px}.ss nav button[aria-current=true]{outline:2px solid var(--ui-accent)}.ss .stage{padding:32px;display:flex;flex-direction:column;justify-content:center;gap:16px;overflow:auto;background:repeating-linear-gradient(45deg,transparent,transparent 18px,var(--ui-stroke-secondary) 19px,transparent 20px)}.ss .slide{aspect-ratio:16/9;padding:6%;position:relative;overflow:hidden;background:#eee9db;color:#183d36;box-shadow:0 18px 45px #0002;display:flex;flex-direction:column;justify-content:center}.ss .slide:after{content:'';position:absolute;width:40%;aspect-ratio:1;border:1px solid currentColor;border-radius:50%;right:-15%;bottom:-25%;opacity:.2;pointer-events:none}.ss .ink{background:#153e37;color:#f2ead6}.ss .citrus{background:#f4d359;color:#252e37}.ss .paper{background:#eee9db;color:#183d36}.ss .slide [contenteditable]{white-space:pre-wrap;outline:none;position:relative;z-index:1}.ss .slide [contenteditable]:focus{outline:2px solid #e8895c;outline-offset:5px}.ss .kicker{font:11px sans-serif;letter-spacing:.19em;margin-bottom:6%}.ss .headline{font-size:clamp(24px,3.8vw,66px);line-height:1.03;letter-spacing:-.045em;max-width:90%;margin-bottom:5%}.ss .body{font:clamp(12px,1.3vw,21px)/1.5 sans-serif;max-width:75%}.ss .split{display:grid;grid-template-columns:1fr 1fr;gap:7%}.ss .split .kicker{grid-column:1/-1;margin:0}.ss .split .headline{font-size:clamp(24px,3vw,50px)}.ss .split .body{max-width:100%;align-self:center}.ss .statement{text-align:center;align-items:center}.ss aside{border-right:0;border-left:1px solid var(--ui-stroke-secondary)}.ss aside textarea,.ss aside select{width:100%;margin:8px 0 14px}.ss aside h3{font-size:20px}.ss .note{font:12px/1.5 sans-serif;color:var(--ui-text-secondary)}.ss .proposal{white-space:pre-wrap;padding:12px;border:1px solid var(--ui-accent);margin:12px 0}.ss .printslides{display:none}.ss.present main{display:block}.ss.present nav,.ss.present aside{display:none}.ss.present .stage{padding:0}.ss.present .slide{max-height:85vh}.ss .error{color:var(--ui-text-primary);padding:10px;border:1px solid var(--ui-accent)}@media(max-width:950px){.ss main{grid-template-columns:100px 1fr}.ss aside{grid-column:1/-1}.ss .stage{padding:15px}}@media print{body *{visibility:hidden}.ss .printslides,.ss .printslides *{visibility:visible}.ss .printslides{display:block;position:absolute;left:0;top:0;width:100%}.ss .printslides .slide{height:100vh;width:100vw;break-after:page;box-shadow:none;print-color-adjust:exact}.ss .printslides .headline{font-size:60px}.ss .printslides .body{font-size:24px}@page{size:landscape;margin:0}}
`;
export function Studio({ api }) {
  const [doc, S] = useState(() => structuredClone(sample)),
    [index, I] = useState(0),
    [selection, Q] = useState(null),
    [instruction, J] = useState("Make this clearer and more memorable."),
    [proposal, P] = useState(null),
    [busy, B] = useState(false),
    [message, M] = useState("Sample deck - not AI generated"),
    [past, U] = useState([]),
    [future, F] = useState([]),
    [present, V] = useState(false),
    [topic, T] = useState("");
  const ref = React.useRef();
  ref.current = { doc, index, selection, past, future };
  const change = (fn) => {
    const r = ref.current;
    const next = structuredClone(r.doc);
    fn(next);
    next.revision = r.doc.revision + 1;
    U([...r.past, structuredClone(r.doc)]);
    F([]);
    S(next);
    ref.current = { ...r, doc: next, past: [...r.past, r.doc], future: [] };
  };
  const act = async (fn) => {
    B(true);
    try {
      await fn();
    } catch (e) {
      M(e.message || "Operation failed");
    } finally {
      B(false);
    }
  };
  function capture(e, field, id) {
    const text = e.currentTarget.textContent;
    const sel = window.getSelection();
    let start = 0,
      end = text.length;
    if (
      sel &&
      !sel.isCollapsed &&
      e.currentTarget.contains(sel.anchorNode) &&
      e.currentTarget.contains(sel.focusNode)
    ) {
      const range = sel.getRangeAt(0);
      const pre = range.cloneRange();
      pre.selectNodeContents(e.currentTarget);
      pre.setEnd(range.startContainer, range.startOffset);
      start = pre.toString().length;
      end = start + range.toString().length;
    }
    Q({ id, field, start, end, text: text.slice(start, end), base: text });
  }
  function slide(s, editable = false) {
    return h(
      "article",
      { className: `slide ${doc.theme} ${s.layout}`, key: s.id },
      ...["kicker", "headline", "body"].map((field) =>
        h(
          "div",
          {
            key: field,
            className: field,
            contentEditable: editable ? "plaintext-only" : false,
            suppressContentEditableWarning: true,
            role: editable ? "textbox" : undefined,
            "aria-label": editable ? field : undefined,
            onBlur: editable
              ? (e) => {
                  const value = e.currentTarget.textContent;
                  if (
                    value.length >
                    (field === "body" ? 1200 : field === "headline" ? 180 : 80)
                  ) {
                    M("Text exceeds layout limit; edit shortened.");
                    e.currentTarget.textContent = value.slice(
                      0,
                      field === "body" ? 1200 : field === "headline" ? 180 : 80,
                    );
                  }
                  const text = e.currentTarget.textContent;
                  if (
                    text !==
                    ref.current.doc.slides.find((x) => x.id === s.id)[field]
                  )
                    change((d) => {
                      d.slides.find((x) => x.id === s.id)[field] = text;
                    });
                }
              : undefined,
            onMouseUp: editable ? (e) => capture(e, field, s.id) : undefined,
            onKeyUp: editable ? (e) => capture(e, field, s.id) : undefined,
          },
          s[field],
        ),
      ),
    );
  }
  return h(
    "section",
    { className: `ss ${present ? "present" : ""}` },
    h("style", null, css),
    h(
      "header",
      null,
      h("strong", null, "Slide Studio"),
      h("input", {
        "aria-label": "Deck topic",
        placeholder: "What is your story?",
        value: topic,
        onChange: (e) => T(e.target.value),
        maxLength: 1000,
      }),
      h(
        "button",
        {
          disabled: busy || !topic,
          onClick: () =>
            act(async () => {
              const rev = ref.current.doc.revision;
              const result = await api("/generate", {
                method: "POST",
                body: { topic },
              });
              if (ref.current.doc.revision !== rev)
                throw Error(
                  "Deck changed during generation. Result discarded.",
                );
              change((d) => {
                d.slides = result.slides.map((s) => ({
                  ...s,
                  id: crypto.randomUUID(),
                }));
              });
              I(0);
              Q(null);
              P(null);
              M("Generated five slides with Hermes");
            }),
        },
        busy ? "Working..." : "Generate 5",
      ),
      h(
        "button",
        {
          disabled: !past.length,
          onClick: () => {
            const r = ref.current;
            F([...r.future, r.doc]);
            S({ ...r.past.at(-1), revision: r.doc.revision + 1 });
            U(r.past.slice(0, -1));
          },
        },
        "Undo",
      ),
      h(
        "button",
        {
          disabled: !future.length,
          onClick: () => {
            const r = ref.current;
            U([...r.past, r.doc]);
            S({ ...r.future.at(-1), revision: r.doc.revision + 1 });
            F(r.future.slice(0, -1));
          },
        },
        "Redo",
      ),
      h(
        "button",
        {
          disabled: busy,
          onClick: () =>
            act(async () => {
              const result = await api("/deck", {
                method: "PUT",
                body: {
                  document: ref.current.doc,
                  expectedRevision: api.savedRevision ?? null,
                },
              });
              api.savedRevision = result.revision;
              M("Saved to this Hermes profile");
            }),
        },
        "Save",
      ),
      h(
        "button",
        {
          disabled: busy,
          onClick: () =>
            act(async () => {
              const result = await api("/deck");
              api.savedRevision = result.revision;
              change((d) => Object.assign(d, result));
              I(0);
              Q(null);
              P(null);
              M("Reopened saved deck");
            }),
        },
        "Reopen",
      ),
      h("button", { onClick: () => window.print() }, "Export PDF"),
      h(
        "button",
        { onClick: () => V(!present) },
        present ? "Exit presentation" : "Present",
      ),
    ),
    h(
      "main",
      null,
      h(
        "nav",
        { "aria-label": "Slides" },
        doc.slides.map((s, n) =>
          h(
            "button",
            {
              key: s.id,
              "aria-current": n === index,
              onClick: () => {
                I(n);
                Q(null);
              },
            },
            h("small", null, `${String(n + 1).padStart(2, "0")} / ${s.layout}`),
            h("div", null, s.headline),
          ),
        ),
      ),
      h(
        "div",
        { className: "stage" },
        slide(doc.slides[index], true),
        h("div", { className: "note", role: "status" }, message),
      ),
      h(
        "aside",
        null,
        h("h3", null, "Shape your story"),
        h(
          "label",
          null,
          "Document palette",
          h(
            "select",
            {
              "aria-label": "Document palette",
              value: doc.theme,
              onChange: (e) =>
                change((d) => {
                  d.theme = e.target.value;
                }),
            },
            ["ink", "paper", "citrus"].map((x) => h("option", { key: x }, x)),
          ),
        ),
        h(
          "label",
          null,
          "Slide layout",
          h(
            "select",
            {
              "aria-label": "Slide layout",
              value: doc.slides[index].layout,
              onChange: (e) =>
                change((d) => {
                  d.slides[index].layout = e.target.value;
                }),
            },
            ["hero", "split", "statement"].map((x) =>
              h("option", { key: x }, x),
            ),
          ),
        ),
        h("h3", null, "Ask Hermes"),
        h(
          "p",
          { className: "note" },
          "Click a text element, or highlight a phrase. Only that selection will change.",
        ),
        h(
          "div",
          { className: "proposal", "aria-label": "Selected text" },
          selection?.text || "No text selected",
        ),
        h("textarea", {
          "aria-label": "Improvement instruction",
          value: instruction,
          onChange: (e) => J(e.target.value),
          maxLength: 1000,
        }),
        h(
          "button",
          {
            disabled: busy || !selection?.text,
            onClick: () =>
              act(async () => {
                const target = structuredClone(ref.current.selection);
                const revision = ref.current.doc.revision;
                const result = await api("/improve", {
                  method: "POST",
                  body: { text: target.text, instruction },
                });
                P({ target, revision, text: result.text });
                M("Proposal ready. Original text is unchanged.");
              }),
          },
          "Improve selection",
        ),
        proposal &&
          h(
            "div",
            null,
            h("h3", null, "Proposed replacement"),
            h(
              "div",
              { className: "proposal", "aria-label": "Proposed replacement" },
              proposal.text,
            ),
            h(
              "button",
              {
                onClick: () => {
                  const r = ref.current;
                  const t = proposal.target;
                  const s = r.doc.slides.find((x) => x.id === t.id);
                  if (
                    r.doc.revision !== proposal.revision ||
                    !s ||
                    s[t.field] !== t.base
                  ) {
                    M("Stale proposal: document changed. Ask Hermes again.");
                    P(null);
                    return;
                  }
                  const value =
                    t.base.slice(0, t.start) +
                    proposal.text +
                    t.base.slice(t.end);
                  if (
                    value.length >
                    (t.field === "body"
                      ? 1200
                      : t.field === "headline"
                        ? 180
                        : 80)
                  ) {
                    M(
                      "Proposal exceeds this element limit. Reject or ask for shorter text.",
                    );
                    return;
                  }
                  change((d) => {
                    d.slides.find((x) => x.id === t.id)[t.field] = value;
                  });
                  P(null);
                  Q(null);
                  M("AI change accepted. Undo restores your text.");
                },
              },
              "Accept",
            ),
            h(
              "button",
              {
                onClick: () => {
                  P(null);
                  M("Proposal rejected; document unchanged.");
                },
              },
              "Reject",
            ),
          ),
      ),
    ),
    h(
      "div",
      { className: "printslides" },
      doc.slides.map((s) => slide(s)),
    ),
  );
}
export default {
  id: "slide-studio",
  name: "Slide Studio",
  defaultEnabled: false,
  register(ctx) {
    ctx.register({
      id: "page",
      area: ROUTES_AREA,
      data: { path: "/slide-studio" },
      render: () => h(Studio, { api: ctx.rest }),
    });
    ctx.register({
      id: "nav",
      area: SIDEBAR_NAV_AREA,
      data: {
        path: "/slide-studio",
        label: "Slide Studio",
        codicon: "preview",
      },
    });
  },
};
