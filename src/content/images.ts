/**
 * Real photographs supplied by the business, optimised to WebP.
 * Alt text and captions describe only what is visibly shown.
 * Display-fault images are EXAMPLES of symptoms, not customer results.
 */

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export const IMAGES = {
  bench: {
    src: "/images/rm-electronics-workshop-bench-nagole.webp",
    width: 1599,
    height: 899,
    alt: "Repair bench at the RM Electronics workshop in Nagole, with one TV opened to show its circuit board and a multimeter and tools beside it.",
    caption: "A repair bench in the RM Electronics workshop, with a TV opened for inspection.",
  },
  floor: {
    src: "/images/rm-electronics-workshop-floor-tvs.webp",
    width: 1599,
    height: 899,
    alt: "Inside the RM Electronics workshop: several TVs stacked and standing against the walls, with a repair bench in the corner.",
    caption: "The workshop floor, with TVs waiting along the walls and a repair bench in the corner.",
  },
  board: {
    src: "/images/rm-electronics-repair-bench-tv-board.webp",
    width: 1599,
    height: 899,
    alt: "A TV laid face-down on the workshop bench beside an exposed circuit board, with more TVs stored beneath the bench.",
    caption: "A TV on the bench next to an exposed circuit board.",
  },
  sign: {
    src: "/images/rm-electronics-shop-sign-nagole.webp",
    width: 1300,
    height: 720,
    alt: "The RM Electronics shop sign in Nagole, listing LCD, LED and Smart TV repair and service, the address near Vishal Mega Mart, and the phone number.",
    caption: "The RM Electronics signboard on Road No. 2, Shrungeri Colony, Nagole.",
  },
  exampleLines: {
    src: "/images/rm-electronics-example-display-vertical-lines.webp",
    width: 1320,
    height: 780,
    alt: "Example of a TV display fault: a band of vertical coloured lines across part of an otherwise dark screen.",
    caption: "Example of a display symptom: a band of vertical lines.",
  },
  exampleDistorted: {
    src: "/images/rm-electronics-example-display-distorted-picture.webp",
    width: 850,
    height: 530,
    alt: "Example of a TV display fault: a heavily distorted picture filled with coloured noise.",
    caption: "Example of a display symptom: a distorted, noisy picture.",
  },
  benchOpenedTv: {
    src: "/images/rm-electronics-bench-opened-tv-circuit-board.webp",
    width: 800,
    height: 429,
    alt: "A TV laid on the workshop bench with its back panel open and its circuit board exposed.",
    caption: "A TV on the bench with its back opened to reach the circuit board.",
  },
  benchTools: {
    src: "/images/rm-electronics-bench-multimeter-and-tools.webp",
    width: 560,
    height: 420,
    alt: "Test meters, cables and a power strip on the repair bench beside a TV.",
    caption: "Test meters, cables and tools on the repair bench.",
  },
  floorWall: {
    src: "/images/rm-electronics-floor-tvs-along-wall.webp",
    width: 820,
    height: 660,
    alt: "TVs standing along the wall of the RM Electronics workshop, with a green stool in front.",
    caption: "TVs standing along the workshop wall.",
  },
  floorShelf: {
    src: "/images/rm-electronics-floor-parts-trays-shelf.webp",
    width: 660,
    height: 470,
    alt: "A workshop shelf holding trays of parts and tools, with a TV on the bench below.",
    caption: "A shelf of parts trays and tools in the workshop.",
  },
  benchLargeTv: {
    src: "/images/rm-electronics-bench-tv-face-down.webp",
    width: 620,
    height: 420,
    alt: "A large TV on the workshop bench with another TV's exposed circuit board in the foreground.",
    caption: "A large TV on the bench during inspection.",
  },
  circuitCloseup: {
    src: "/images/rm-electronics-bench-circuit-board-closeup.webp",
    width: 520,
    height: 340,
    alt: "Close view of an exposed TV circuit board next to a pink tray of small parts on the bench.",
    caption: "A closer look at an exposed circuit board and a tray of small parts.",
  },
  shelfTools: {
    src: "/images/rm-electronics-shelf-tools-and-trays.webp",
    width: 520,
    height: 380,
    alt: "Trays of small parts and tools on a workshop shelf, with a TV on the bench beside it.",
    caption: "Parts trays and tools within reach of the bench.",
  },
} as const satisfies Record<string, SiteImage>;

export type GalleryCategory = "workshop" | "shop" | "symptoms";

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "workshop", label: "Workshop" },
  { id: "shop", label: "Shop and signboard" },
  { id: "symptoms", label: "Display symptom examples" },
];

export type GalleryItem = SiteImage & { category: GalleryCategory };

const g = (category: GalleryCategory, image: SiteImage): GalleryItem => ({ ...image, category });

/** Order matters: this is the order shown on /gallery. */
export const GALLERY: GalleryItem[] = [
  g("workshop", IMAGES.bench),
  g("workshop", IMAGES.benchOpenedTv),
  g("workshop", IMAGES.floor),
  g("workshop", IMAGES.circuitCloseup),
  g("workshop", IMAGES.benchTools),
  g("workshop", IMAGES.board),
  g("workshop", IMAGES.floorWall),
  g("workshop", IMAGES.benchLargeTv),
  g("workshop", IMAGES.floorShelf),
  g("workshop", IMAGES.shelfTools),
  g("shop", IMAGES.sign),
  g("symptoms", IMAGES.exampleLines),
  g("symptoms", IMAGES.exampleDistorted),
];

export type SiteVideo = {
  src: string;
  width: number;
  height: number;
  title: string;
  description: string;
};

/** Silent clips (audio removed). Loaded only when the visitor presses play. */
export const VIDEOS: SiteVideo[] = [
  {
    src: "/videos/rm-electronics-shopfront-nagole.mp4",
    width: 640,
    height: 360,
    title: "Finding RM Electronics in Nagole",
    description: "A short walk along the street showing the building and the RM Electronics roadside sign. No sound.",
  },
  {
    src: "/videos/rm-electronics-example-display-fault.mp4",
    width: 356,
    height: 640,
    title: "Example of a display fault",
    description: "A short clip of a TV screen showing a display problem, as an example of a symptom. No sound.",
  },
];
