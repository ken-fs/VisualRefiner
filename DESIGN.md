---
name: VisualRefiner
description: A precision inspection bench for browser-local image and video tools.
colors:
  graphite-ink: "#17211c"
  graphite-muted: "#526159"
  bench-celadon: "#dce5df"
  bench-celadon-deep: "#c7d2cb"
  inspection-paper: "#fffaf0"
  inspection-paper-bright: "#fffdf8"
  calibration-orange: "#d43d1f"
  calibration-orange-deep: "#b83219"
  signal-yellow: "#f2cf52"
  measurement-line: "#98a79f"
  measurement-line-dark: "#65736c"
  error-red: "#a62d20"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(3.65rem, 6.2vw, 6rem)"
    fontWeight: 760
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 850
    lineHeight: 1.2
    letterSpacing: "0.07em"
rounded:
  field: "9px"
  control: "10px"
  surface: "14px"
  round: "999px"
spacing:
  tight: "8px"
  control: "14px"
  panel: "24px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.calibration-orange}"
    textColor: "{colors.inspection-paper-bright}"
    rounded: "{rounded.control}"
    padding: "0 17px"
    height: "50px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.calibration-orange-deep}"
    textColor: "{colors.inspection-paper-bright}"
    rounded: "{rounded.control}"
  field:
    backgroundColor: "{colors.inspection-paper-bright}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.field}"
    padding: "0 12px"
    height: "46px"
  status-chip:
    backgroundColor: "{colors.bench-celadon}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.round}"
    padding: "9px 12px"
---

# Design System: VisualRefiner

## Overview

**Creative North Star: "The Precision Inspection Bench"**

VisualRefiner treats every file as material placed on a real inspection surface. The visual system borrows from proofing tables, registration marks, crop rulers, contact sheets, and optical inspection tools. The interface feels exact and practical without becoming a dark engineering dashboard.

The system is light, materially layered, and deliberately asymmetrical. Large typographic statements sit beside working tools rather than above marketing card grids. Functional proof carries the brand: a visitor should see the file action, the local-processing mechanism, and the result path before encountering promotional explanation.

**Key Characteristics:**

- Pale celadon work surfaces with warm inspection paper.
- Graphite typography and measurement lines.
- Calibration orange appears only on actions and directional emphasis.
- Large compact display type faces working media surfaces.
- Registration geometry is functional, sparse, and tied to file inspection.

## Colors

The palette resembles a daylight inspection table: cool work surfaces, warm paper, dark graphite, and narrowly controlled calibration signals.

### Primary

- **Calibration Orange:** Reserved for primary actions, directional marks, and active range controls. It must remain rare enough to identify something actionable immediately.
- **Deep Calibration Orange:** Used for primary-action hover states and stronger interaction feedback.

### Secondary

- **Signal Yellow:** Separates keyboard focus from surrounding surfaces and carries result-ready or warning emphasis.

### Neutral

- **Graphite Ink:** Primary text, dark controls, the active browser node, and structural marks.
- **Graphite Muted:** Explanatory copy, metadata, labels, and secondary navigation.
- **Bench Celadon:** The main environmental surface and product atmosphere.
- **Deep Bench Celadon:** Tonal separation where a denser work area is needed.
- **Inspection Paper:** Media workspaces and high-attention task surfaces.
- **Bright Inspection Paper:** Inputs and the lightest interactive fields.
- **Measurement Lines:** Dividers, rulers, and component boundaries.

**The Action Signal Rule.** Calibration orange identifies actions or movement; it does not decorate passive copy or large background fields.

**The Two-Tone Focus Rule.** Keyboard focus uses a graphite outline with a signal-yellow separation ring so it remains visible on paper and celadon.

## Typography

**Display Font:** Bricolage Grotesque with a sans-serif fallback

**Body Font:** Manrope with a sans-serif fallback

**Character:** The display face is compact, dense, and slightly irregular, giving large headlines the presence of equipment labeling without turning technical. Manrope keeps controls and explanations calm and readable.

### Hierarchy

- **Display:** Heavy, tightly tracked, and close-set. Use for the single dominant page statement and major section titles.
- **Headline:** Large display typography with the same compact silhouette at a reduced responsive scale.
- **Title:** Medium display typography for tool names and task results.
- **Body:** Manrope with relaxed leading. Keep explanatory passages near 65–75 characters per line.
- **Label:** Small, strongly weighted, tracked uppercase text for measurement metadata, panel headings, and format status.

**The One Dominant Statement Rule.** Each surface receives one oversized typographic statement. Controls and section headings step down clearly instead of competing with it.

## Layout

The global container is fluid with narrow fixed gutters and a wide desktop ceiling. Primary surfaces use intentionally unequal columns: the product statement occupies the smaller rail while the working bench owns most of the viewport. Full-width ledger rows replace equal card grids for collections of tools.

Vertical rhythm is generous between major sections and tight inside a task. Desktop workspaces divide media and controls; below the compact breakpoint they stack into one continuous bench. Secondary ledger columns disappear on smaller screens before task names or actions are compressed.

The first viewport must contain a real task or task entry, not a detached marketing header. Measurement grids are allowed only inside media workspaces, where they behave as inspection surfaces.

## Elevation & Depth

The system is flat by default and gains depth through tonal layers, borders, and one soft optical shadow. Workspaces rely on a dark structural border and inset measurement line. The inspection lens uses a soft offset shadow to feel movable; primary actions use a restrained downward shadow to separate them from the control panel.

**The Flat Bench Rule.** Ordinary rows and containers stay flat. Shadows belong only to movable or pressable objects.

## Shapes

Workspaces and panels use gently rounded rectangular corners. Inputs and buttons are slightly tighter than outer media surfaces. Pills are restricted to small status controls. Circular forms belong to lenses, registration targets, and the local-processing path.

Borders are structural and usually one pixel. Thick colored side borders are not part of the language. Registration marks, rulers, and connector arrows are crisp geometry rather than illustration.

## Components

### Buttons

- **Shape:** Compact rounded rectangle using the control radius.
- **Primary:** Calibration orange with bright inspection-paper text, a minimum 50px height, and strong label weight.
- **Hover / Focus:** Hover deepens the orange and lifts by one pixel. Focus uses the two-tone graphite and yellow treatment.
- **Download:** Graphite background with bright paper text; hover moves to deep calibration orange.

### Chips

- **Style:** Thin graphite border, transparent celadon fill, compact rounded ends, and plain-language status copy.
- **State:** Chips report context such as local processing; they do not replace primary actions.

### Cards / Containers

- **Corner Style:** Outer tool surfaces use the surface radius.
- **Background:** Inspection paper over the celadon environment.
- **Shadow Strategy:** No ambient card shadow. Structure comes from borders and tonal separation.
- **Border:** Dark measurement border with a lighter inset line.
- **Internal Padding:** Control panels use the panel spacing token.

### Inputs / Fields

- **Style:** Bright paper, dark graphite text, one-pixel measurement border, and the field radius.
- **Focus:** The global two-tone focus treatment remains visible without shifting layout.
- **Error / Disabled:** Errors become a full-width error-red strip with a recovery sentence. Disabled actions retain their shape and reduce opacity.

### Navigation

Navigation uses the body face at strong weight. Desktop links remain plain and underlined only on interaction. Mobile reduces the header to the wordmark and the complete tool index rather than introducing a generic menu drawer.

### Inspection Bench

The signature component combines a top measurement label, working media field, control rail, registration marks, and a result strip. It always exposes the local-processing state and keeps the primary action inside the bench.

### Tool Ledger

Tool collections are horizontal ledger rows with group, task name, explanation, supported formats, and one directional icon. Hover translates the row slightly without changing layout dimensions.

## Do's and Don'ts

### Do:

- **Do** place a real file action or working tool in the first viewport.
- **Do** reserve calibration orange for actions, active controls, and directional signals.
- **Do** use ledger rows and asymmetric splits for multi-tool navigation.
- **Do** let privacy claims point to a visible local-processing mechanism.
- **Do** keep mobile tasks vertically continuous and touch targets at least 46px high.

### Don't:

- **Don't** introduce blue-purple gradients, neon AI-editor styling, or generic SaaS card walls.
- **Don't** use an eyebrow above a major heading.
- **Don't** use emoji or Unicode glyphs as interface icons; use Iconify or authored geometry.
- **Don't** decorate passive surfaces with calibration orange.
- **Don't** apply measurement grids outside genuine file workspaces.
- **Don't** add ambient shadows to every container or combine wide shadows with decorative borders.
