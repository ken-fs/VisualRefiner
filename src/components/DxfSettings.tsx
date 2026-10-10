"use client";

import { Select } from "@/components/Select";
import type { DxfUnit } from "@/lib/dxf";
import type { DxfOptions } from "@/lib/svg-geometry";

export type Accuracy = "fine" | "normal" | "draft";

export type DxfSettingsValue = {
  width: number;
  unit: DxfUnit;
  accuracy: Accuracy;
  layersByColor: boolean;
};

export const DEFAULT_DXF_SETTINGS: DxfSettingsValue = { width: 100, unit: "mm", accuracy: "normal", layersByColor: true };

// Max gap between a curve and its straight-line segments. 0.05 mm is below a
// typical laser kerf (0.1–0.2 mm), so "normal" never shows up in the cut.
const ACCURACY_MM: Record<Accuracy, number> = { fine: 0.01, normal: 0.05, draft: 0.2 };

const ACCURACY_LABELS: Record<Accuracy, string> = {
  fine: "Fine (0.01 mm, bigger file)",
  normal: "Normal (0.05 mm)",
  draft: "Draft (0.2 mm, smallest file)",
};

export function dxfOptions(value: DxfSettingsValue): DxfOptions {
  return { width: value.width, unit: value.unit, accuracyMm: ACCURACY_MM[value.accuracy], layersByColor: value.layersByColor };
}

export function DxfSettings({ value, onChange, showLayers = true }: { value: DxfSettingsValue; onChange: (next: DxfSettingsValue) => void; showLayers?: boolean }) {
  function setUnit(unit: DxfUnit) {
    if (unit === value.unit) return;
    // Keep the physical size when switching units.
    const width = unit === "in" ? value.width / 25.4 : value.width * 25.4;
    onChange({ ...value, unit, width: Math.round(width * 100) / 100 });
  }

  return (
    <>
      <label className="field-label">
        Output width
        <span style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: "8px" }}>
          <input
            type="number"
            min="0.1"
            step="any"
            value={value.width}
            onChange={(event) => {
              const width = Number(event.target.value);
              if (width > 0) onChange({ ...value, width });
            }}
          />
          <Select
            ariaLabel="Units"
            value={value.unit}
            onChange={(unit) => setUnit(unit as DxfUnit)}
            options={[
              { value: "mm", label: "mm" },
              { value: "in", label: "inch" },
            ]}
          />
        </span>
      </label>

      <label className="field-label">
        Curve accuracy
        <Select
          ariaLabel="Curve accuracy"
          value={value.accuracy}
          onChange={(accuracy) => onChange({ ...value, accuracy: accuracy as Accuracy })}
          options={Object.entries(ACCURACY_LABELS).map(([key, label]) => ({ value: key, label }))}
        />
      </label>

      {showLayers && (
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
          <input type="checkbox" checked={value.layersByColor} onChange={(event) => onChange({ ...value, layersByColor: event.target.checked })} />
          One layer per color
        </label>
      )}
    </>
  );
}

export function downloadText(text: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
