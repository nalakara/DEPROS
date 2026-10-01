# DEPROS Portfolio Website --- Website Blueprint

**Status:** Planning / Architectural Reference\
**Source of Truth:** `PF DEPROS 2026_B.pdf`\
**Primary Build Environment:** Antigravity\
**Interaction Reference:** Poch Studio --- interaction/experience only\
**CMS Direction:** Level 2 --- Content + Visual Control

------------------------------------------------------------------------

## 1. Project Intent

Build a digital portfolio website for DEPROS that translates the
existing DEPROS studio profile PDF into a contemporary web experience.

The website must preserve the visual DNA, typography, color language,
composition, restraint, editorial character, and portfolio taxonomy of
the DEPROS source material.

The website should not be a literal digital reproduction of the PDF.

It should be a **digital reinterpretation of the DEPROS identity**.

Poch Studio may be studied for interaction patterns, scrolling behavior,
transitions, project presentation, and motion philosophy, but **must not
become the visual source for DEPROS**.

------------------------------------------------------------------------

## 2. Primary Source of Truth

The supplied DEPROS PDF is the primary source of truth for:

-   visual identity
-   color language
-   typography
-   logo treatment
-   spacing
-   composition
-   image treatment
-   tone of voice
-   portfolio structure
-   portfolio categories
-   project presentation
-   studio messaging
-   client/project information

Do not silently replace or reinterpret the source identity with generic
contemporary-agency conventions.

Where the source does not define something, propose a solution that is
consistent with the established DEPROS visual language rather than
introducing an unrelated visual trend.

------------------------------------------------------------------------

## 3. Core DEPROS Visual DNA

The source material establishes a visual language characterized by:

-   orange as a dominant brand field/color
-   black and white as supporting colors
-   strong negative space
-   condensed / narrow typographic character
-   restrained typography
-   editorial composition
-   asymmetric alignment
-   thin horizontal rules
-   section numbering
-   slash `/` as a recurring graphic motif
-   small metadata typography
-   large visual fields
-   deliberate whitespace
-   controlled contrast
-   concise copy
-   image-led portfolio presentation
-   confident but restrained composition

The visual character should feel:

**confident, disruptive, intentional, restrained, editorial, precise,
and purposeful.**

The source repeatedly uses statements such as:

> Confident in Vision. Disruptive by Design. Intentional in Every
> Detail.

and:

> Challenge the Usual. Break the Expected.

These statements should inform the site's tone without being overused.

------------------------------------------------------------------------

## 4. Non-Negotiable Design Principles

### 4.1 Do not copy Poch Studio visually

Poch Studio is an **interaction reference only**.

Use it to study:

-   scroll choreography
-   project reveal
-   image transitions
-   typography movement
-   hover behavior
-   sticky elements
-   section transitions
-   loading transitions
-   micro-interactions
-   page rhythm

Do not copy:

-   its visual identity
-   its color system
-   its typography system
-   its layout identity
-   its branding
-   its distinctive visual motifs
-   its overall art direction

### 4.2 Do not turn the PDF into a page-by-page website

The website should not simply reproduce:

PDF page 1 → web page 1\
PDF page 2 → web page 2\
PDF page 3 → web page 3

The PDF is a visual and content reference, not a page architecture.

The website should reinterpret the material into a coherent digital
experience.

### 4.3 Avoid generic agency-site behavior

Do not automatically introduce:

-   excessive gradients
-   unnecessary 3D
-   floating cards
-   decorative blobs
-   excessive glassmorphism
-   excessive parallax
-   noisy cursor effects
-   constant movement
-   trend-driven animation
-   generic "creative agency" templates

If an effect does not strengthen the DEPROS identity or improve
navigation/storytelling, it should not exist.

------------------------------------------------------------------------

## 5. Experience Philosophy

The site should feel like an **interactive editorial portfolio**, not a
database.

The CMS should power the content, but the visitor should experience:

-   visual storytelling
-   project discovery
-   art direction
-   rhythm
-   typography
-   imagery
-   controlled motion

The underlying CMS should remain invisible as a concept.

------------------------------------------------------------------------

## 6. Proposed Information Architecture

``` text
/
│
├── HOME
│
├── WORK
│   ├── ALL
│   ├── PRODUCT DESIGN
│   ├── BRAND IDENTITY
│   ├── LOGOS
│   ├── CORPORATE IDENTITY
│   ├── MARKETING KIT
│   ├── GRAPHIC / VISUAL
│   └── SOCIAL MEDIA CONTENT
│
├── WORK/[slug]
│
├── STUDIO
│
└── CONTACT
```

Categories should generally function as filters or portfolio taxonomy
rather than requiring a separate top-level page for every category.

------------------------------------------------------------------------

## 7. Portfolio Taxonomy

The taxonomy must be based on the portfolio structure shown in the
DEPROS PDF.

Primary categories:

1.  Product Design
2.  Brand Identity
3.  Logos
4.  Corporate Identity
5.  Marketing Kit
6.  Graphic & Visual
7.  Social Media Content

The source material presents:

-   Product Design across pages 5--12
-   Brand Identity on page 13
-   Logos on page 14
-   Corporate Identity on page 15
-   Marketing Kit / Sales Tools on pages 16--17
-   Floor / Wall Images, Visual Card, Graphic & else on page 18
-   Social Media Content on pages 19--20

These categories should become the initial CMS taxonomy.

Do not invent additional primary categories unless required by later
content.

------------------------------------------------------------------------

## 8. Portfolio Data Model

The portfolio should use structured project records.

Initial project model:

``` text
PROJECT
├── Title
├── Slug
├── Category
├── Client
├── Industry
├── Location
├── Year
├── Scope of Work
├── Description
├── Hero Image
├── Gallery
├── Featured
├── Order
├── Visibility / Status
└── Optional Metadata
```

A project may contain multiple images and should support a deliberate
image ordering.

The CMS should not force every project into exactly the same visual
composition if the source material suggests different presentation
needs.

------------------------------------------------------------------------

## 9. Client Data Model

Clients should be entities rather than plain text fields where
practical.

``` text
CLIENT
├── Name
├── Logo
├── Industry
├── Location
└── Projects[]
```

This allows client information to be reused and makes the system
scalable as the portfolio grows.

The PDF includes a notable-client listing with:

-   client
-   scope of work
-   industry
-   location

This structure should inform the CMS model.

------------------------------------------------------------------------

## 10. CMS Direction --- Level 2

The selected CMS capability level is:

**Level 2 --- Content + Visual Control**

The CMS should allow the owner to manage normal content and selected
presentation controls.

### Content controls

The owner should be able to:

-   create projects
-   edit projects
-   upload project images
-   manage galleries
-   assign categories
-   manage clients
-   edit descriptions
-   edit metadata
-   publish/unpublish projects

### Visual controls

The owner should also be able to control:

-   featured project status
-   homepage project ordering
-   project ordering
-   category visibility
-   project visibility
-   gallery ordering
-   captions
-   selected homepage content
-   selected hero content where appropriate

### CMS limitation

The CMS should **not** become a page builder.

Do not expose arbitrary:

-   typography settings
-   spacing systems
-   animation parameters
-   layout grids
-   component structure
-   arbitrary color controls

The design system must remain controlled by code.

------------------------------------------------------------------------

## 11. Content / Presentation Separation

The architecture should maintain a strict separation:

``` text
CMS
 │
 ├── Projects
 ├── Categories
 ├── Clients
 ├── Studio
 └── Contact
       │
       ▼
Content Model
       │
       ▼
DEPROS Design System
       │
       ▼
Components
       │
       ▼
Motion / Interaction Layer
       │
       ▼
Pages
```

The CMS provides content.

The design system determines presentation.

Components determine composition.

The motion layer determines interaction.

This separation must be preserved.

------------------------------------------------------------------------

## 12. Homepage Direction

The homepage should not be a static cover page.

Proposed narrative:

``` text
OPEN

DEPROS
/

STUDIO PROFILE

Confident in Vision.
Disruptive by Design.
Intentional in Every Detail.

        ↓

SELECTED WORK

[project]
[project]
[project]

        ↓

CAPABILITIES

Brand Development
Creative Direction
Graphic Design
Product Design
Digital Marketing
Social Media
Print

        ↓

STUDIO

short manifesto / studio description

        ↓

CONTACT

LET'S DO IT
```

The actual content should be grounded in the DEPROS PDF.

------------------------------------------------------------------------

## 13. Project Detail Direction

Project detail pages should translate the editorial structure found in
the PDF.

Example conceptual structure:

``` text
01 / DEPROS

PRODUCT DESIGN

JANUS BIFROUS
Herbs Liqueur

Crafted for LOCALE BREWERY

[large visual]

[visual]

[visual]

project information

[related / next project]
```

The PDF's project pages consistently use:

-   section number
-   DEPROS identifier
-   category
-   project title
-   short description
-   client attribution
-   visual presentation

This should become the foundation of the dynamic project template.

------------------------------------------------------------------------

## 14. Project Presentation

The project page should prioritize imagery.

Possible sequence:

``` text
PROJECT INTRO
       ↓
HERO IMAGE
       ↓
PROJECT INFORMATION
       ↓
IMAGE / DETAIL
       ↓
IMAGE / DETAIL
       ↓
IMAGE / DETAIL
       ↓
NEXT PROJECT
```

The exact layout may vary depending on the project.

Do not force every portfolio item into an identical gallery grid.

The CMS should store content; the presentation system may select an
appropriate composition based on the project type.

------------------------------------------------------------------------

## 15. Component Architecture

Initial component map:

``` text
AppShell
├── Header
├── Navigation
├── Cursor
└── Footer

BrandSystem
├── DeprosMark
├── SlashMark
├── SectionLabel
├── PageNumber
├── Rule
└── Metadata

Portfolio
├── ProjectGrid
├── ProjectCard
├── ProjectFilter
├── ProjectHero
├── ProjectGallery
├── ProjectMeta
├── ProjectNext
└── ProjectDetail

Studio
├── Manifesto
├── Services
├── Clients
└── Contact

Motion
├── PageTransition
├── Reveal
├── ImageReveal
├── TextReveal
└── HoverInteraction
```

This is a starting architecture, not a requirement to implement every
component immediately.

Antigravity should validate the architecture before implementation.

------------------------------------------------------------------------

## 16. Motion System

Motion must follow the DEPROS character.

Preferred motion model:

``` text
REST
 ↓
REVEAL
 ↓
MOVE
 ↓
SETTLE
```

Not:

``` text
EVERYTHING MOVES ALL THE TIME
```

Animation should feel:

-   controlled
-   precise
-   editorial
-   intentional
-   restrained

Animation should primarily support:

-   hierarchy
-   discovery
-   transition
-   image reveal
-   project storytelling
-   navigation feedback

Motion must never become the main visual identity.

------------------------------------------------------------------------

## 17. Interaction Opportunities

Potential interactions to investigate:

### Project hover

A project title or card may reveal an image or visual state.

### Project reveal

Images may enter through controlled clipping/masking or editorial
transitions.

### Typography reveal

Section titles and metadata may use subtle reveal sequences.

### Scroll choreography

Project sections may respond to scroll position in a restrained way.

### Navigation

Navigation may transition between sections/pages without breaking the
visual rhythm.

All interaction patterns must be tested against the DEPROS visual
language before being adopted.

------------------------------------------------------------------------

## 18. Responsive Strategy

The desktop composition in the PDF is an important reference, but the
website must not simply shrink it.

Responsive design should preserve:

-   hierarchy
-   whitespace
-   typography
-   visual rhythm
-   image impact
-   section numbering
-   metadata structure

Mobile should be treated as an intentional composition.

Do not simply stack every desktop element vertically without considering
the resulting rhythm.

------------------------------------------------------------------------

## 19. Technical Direction

Initial technical direction:

``` text
Next.js
TypeScript
Motion / animation library
Headless CMS
Vercel
```

The exact CMS and implementation stack should be validated during
architecture discovery.

Technical choices must serve:

-   performance
-   maintainability
-   CMS usability
-   image performance
-   responsive behavior
-   animation performance
-   future portfolio growth

Do not add dependencies without a clear architectural reason.

------------------------------------------------------------------------

## 20. Performance Principles

The site is image-heavy by nature.

Performance must therefore be considered from the beginning.

Pay particular attention to:

-   image optimization
-   responsive image sizes
-   lazy loading
-   image formats
-   animation performance
-   reduced-motion support
-   font loading
-   route transitions
-   CMS image delivery

Large portfolio imagery must not make the site feel heavy.

------------------------------------------------------------------------

## 21. Accessibility

The visual identity must not compromise basic accessibility.

Consider:

-   semantic HTML
-   keyboard navigation
-   readable contrast
-   alt text
-   focus states
-   reduced motion
-   screen-reader semantics
-   navigation clarity

Accessibility should be integrated without destroying the visual
character.

------------------------------------------------------------------------

## 22. Antigravity Workflow

The project should not begin with full implementation.

### Phase 1 --- Discovery

Antigravity should inspect the source PDF and produce:

-   visual audit
-   content audit
-   typography analysis
-   color analysis
-   layout analysis
-   image treatment analysis
-   portfolio taxonomy
-   interaction opportunities
-   responsive considerations

### Phase 2 --- Architecture

Produce:

-   information architecture
-   CMS model
-   component architecture
-   design token proposal
-   motion system
-   technical architecture
-   folder structure

### Phase 3 --- Design System

Translate the source into code-level design primitives:

-   colors
-   typography
-   spacing
-   grid
-   rules
-   numbering
-   slash motif
-   image behavior
-   responsive rules

### Phase 4 --- Prototype

Build only the critical experience:

-   homepage
-   one category/filter state
-   one project detail page
-   navigation
-   core motion

### Phase 5 --- Audit

Evaluate against the PDF:

-   visual fidelity
-   typography
-   spacing
-   composition
-   tone
-   motion
-   responsive behavior

### Phase 6 --- CMS Integration

Connect the structured content model and migrate the portfolio.

### Phase 7 --- Portfolio Population

Populate all approved projects.

### Phase 8 --- Final QA

Test:

-   desktop
-   tablet
-   mobile
-   performance
-   accessibility
-   CMS workflows
-   navigation
-   animation
-   image loading

------------------------------------------------------------------------

## 23. Critical Constraint for AI-Assisted Development

Antigravity must not fill ambiguity with arbitrary design decisions.

When a decision is not defined by the source:

1.  identify the ambiguity
2.  state the proposed interpretation
3.  explain why it is consistent with DEPROS
4.  wait for architectural approval when the decision is consequential

Do not silently introduce a new design language.

------------------------------------------------------------------------

## 24. Definition of Success

The finished website should feel like:

> **DEPROS became a website.**

Not:

> **A modern agency website was filled with DEPROS content.**

The visitor should recognize the relationship between the PDF and the
website immediately, while still experiencing the website as a native
digital experience rather than a PDF conversion.

------------------------------------------------------------------------

## 25. Current Decision Record

The following decisions are currently accepted:

-   DEPROS PDF is the primary visual/content source.
-   Poch Studio is an interaction reference only.
-   Website will be a digital reinterpretation, not a PDF reproduction.
-   Portfolio is the core content domain.
-   CMS will support Level 2: Content + Visual Control.
-   CMS will not become a page builder.
-   Content and presentation will remain separated.
-   Portfolio taxonomy follows the source PDF.
-   Motion will be restrained and editorial.
-   Architecture should be modular and maintainable.
-   Antigravity should begin with discovery and architecture, not
    immediate full implementation.

------------------------------------------------------------------------

## 26. Next Step

The next artifact to create is:

**`01_DEPROS_DISCOVERY_AND_ARCHITECTURE.md`**

This document should become the result of the first Antigravity prompt.

The first prompt should ask Antigravity to inspect the source material
and this blueprint, perform discovery and architecture analysis, and
produce the next architectural document.

It should **not begin full implementation yet**.
