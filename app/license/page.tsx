"use client";

import { useState } from "react";

type Item = { mark: "+" | "x" | ">"; text: string };
type Block = {
  label: "ALLOWED" | "PROHIBITED" | "NOTICE";
  items: Item[];
};
type Section = {
  number: string;
  title: string;
  blocks: Block[];
  note?: string;
  extra?: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    number: "01",
    title: "What you can do with samples",
    blocks: [
      {
        label: "ALLOWED",
        items: [
          { mark: "+", text: "Use samples in your tracks, beats, and compositions without limitations" },
          { mark: "+", text: "Release music commercially (sell on platforms, upload to streaming services)" },
          { mark: "+", text: "Process and modify samples however you want" },
          { mark: "+", text: "Use in videos, advertisements, films, games" },
          { mark: "+", text: "Use in live performances and DJ sets" },
          { mark: "+", text: "Create an unlimited number of tracks" },
        ],
      },
    ],
  },
  {
    number: "02",
    title: "What you cannot do with samples",
    blocks: [
      {
        label: "PROHIBITED",
        items: [
          { mark: "x", text: "Resell samples as-is or as new sample packs" },
          { mark: "x", text: "Share files with other producers" },
          { mark: "x", text: "Upload to torrents or file-sharing platforms" },
          { mark: "x", text: "Claim samples as your own original work" },
          { mark: "x", text: "Use to create competing sample packs" },
          { mark: "x", text: "Sell access to samples to other people" },
        ],
      },
    ],
    note: "In simple terms: samples are only for your tracks, not for resale in any form.",
  },
  {
    number: "03",
    title: "Rules for VST plugins",
    blocks: [
      {
        label: "ALLOWED",
        items: [
          { mark: "+", text: "Install on all your computers" },
          { mark: "+", text: "Use in commercial and personal projects" },
          { mark: "+", text: "Receive free updates" },
        ],
      },
      {
        label: "PROHIBITED",
        items: [
          { mark: "x", text: "Transfer the plugin to other people" },
          { mark: "x", text: "Attempt to crack or modify plugin code" },
          { mark: "x", text: "Extract sounds from the plugin to create sample packs" },
          { mark: "x", text: "Share installation files or license keys" },
        ],
      },
    ],
  },
  {
    number: "04",
    title: "Copyright & credits",
    blocks: [
      {
        label: "NOTICE",
        items: [
          { mark: ">", text: "All samples and plugins remain our intellectual property" },
          { mark: ">", text: "You purchase the right to use, not the files themselves" },
          { mark: ">", text: 'Credits are mandatory: when using samples in tracks, you must credit "AETRIS / LAB" in descriptions/credits' },
        ],
      },
    ],
    extra: (
      <div className="mt-5 border-l-2 border-[var(--accent-dim)] pl-4">
        <p className="font-mono-brand text-xs text-[var(--accent)] uppercase tracking-wide mb-2.5">
          How to credit
        </p>
        <p className="text-[var(--text-dim)] text-sm mb-3">
          When releasing a track with our samples, you must credit in:
        </p>
        <ul className="space-y-1.5 text-sm text-[var(--text-dim)]">
          <li className="font-mono-brand text-[13px]">{">"} Track description on streaming platforms (Spotify, Apple Music, etc.)</li>
          <li className="font-mono-brand text-[13px]">{">"} Album credits</li>
          <li className="font-mono-brand text-[13px]">{">"} Video description on YouTube/other platforms</li>
          <li className="font-mono-brand text-[13px]">{">"} Social media posts when announcing the track</li>
        </ul>
        <div className="mt-4 bg-black border border-[var(--line)] rounded-md p-3.5">
          <p className="font-mono-brand text-[10px] text-[var(--text-faint)] uppercase tracking-wide mb-1.5">
            Accepted format
          </p>
          <p className="font-mono-brand text-[13px]">
            <span className="text-[var(--accent)]">$</span> prod. by AETRIS / LAB
          </p>
        </div>
      </div>
    ),
  },
  {
    number: "05",
    title: "Important to know",
    blocks: [
      {
        label: "NOTICE",
        items: [
          { mark: ">", text: 'All products are provided "as is"' },
          { mark: ">", text: "We are not responsible for technical issues on your end" },
          { mark: ">", text: "Refunds are only possible in case of serious technical bugs" },
          { mark: ">", text: "These terms may be updated — the current version is always on this page" },
        ],
      },
    ],
  },
];

function BlockMarks({ block }: { block: Block }) {
  const dotColor =
    block.label === "ALLOWED"
      ? "bg-[var(--accent)]"
      : block.label === "PROHIBITED"
        ? "bg-[var(--red)]"
        : "bg-[#e8b339]";
  const labelColor =
    block.label === "ALLOWED"
      ? "text-[var(--accent)]"
      : block.label === "PROHIBITED"
        ? "text-[var(--red)]"
        : "text-[#e8b339]";

  return (
    <div className="mb-5">
      <p className={`font-mono-brand text-xs uppercase tracking-wide mb-2.5 flex items-center gap-2 ${labelColor}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {block.label}
      </p>
      <ul className="space-y-1.5">
        {block.items.map((item, i) => (
          <li key={i} className="font-mono-brand text-[13px] text-[var(--text-dim)] flex gap-2.5">
            <span className={item.mark === "x" ? "text-[var(--red)]" : item.mark === "+" ? "text-[var(--accent)]" : "text-[#e8b339]"}>
              {item.mark}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LicensePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[900px] mx-auto px-7">
        <div className="text-center mb-16">
          <span className="font-mono-brand text-xs tracking-[3px] text-[var(--accent)] uppercase block mb-4">
            AETRIS / LAB
          </span>
          <h1 className="font-mono-brand text-4xl md:text-5xl font-bold uppercase tracking-[-1px]">
            Terms
            <br />
            of use
          </h1>
          <p className="font-mono-brand text-[13px] text-[var(--text-faint)] uppercase tracking-wide mt-4">
            Product usage guidelines &amp; license agreement
          </p>
        </div>

        <div className="space-y-px bg-[var(--line)] border border-[var(--line)] rounded-lg overflow-hidden">
          {SECTIONS.map((section, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={section.number} className="bg-[var(--bg)]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[var(--bg-card)] transition-colors"
                >
                  <span className="flex items-center gap-4">
                    <span className="font-mono-brand text-xs text-[var(--red)]">{section.number}</span>
                    <span className="font-mono-brand text-sm uppercase tracking-wide">{section.title}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono-brand text-[10px] uppercase tracking-wide ${
                        isOpen ? "text-[var(--accent)]" : "text-[var(--text-faint)]"
                      }`}
                    >
                      {isOpen ? "open" : "closed"}
                    </span>
                    <span className={`text-[var(--text-faint)] transition-transform ${isOpen ? "rotate-180" : ""}`}>
                      ⌄
                    </span>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 pt-1 border-t border-[var(--line)]">
                    {section.blocks.map((block, bi) => (
                      <BlockMarks key={bi} block={block} />
                    ))}
                    {section.note && (
                      <div className="border border-[var(--line)] rounded-md p-3.5 mt-2">
                        <p className="font-mono-brand text-[13px] text-[var(--text)]">
                          <span className="font-bold">In simple terms:</span>{" "}
                          {section.note.replace("In simple terms: ", "")}
                        </p>
                      </div>
                    )}
                    {section.extra}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
