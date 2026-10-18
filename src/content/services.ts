import type { IconName } from "@/components/ui/Icon";
import { IMAGES, type SiteImage } from "./images";

/**
 * Symptoms and service categories.
 * Wording is deliberately cautious: a symptom does not prove which part has
 * failed, repairability is not promised, and no prices or timings are given.
 */

export type Problem = {
  id: string;
  title: string;
  icon: IconName;
  text: string;
};

export const PROBLEMS: Problem[] = [
  {
    id: "no-power",
    title: "TV not turning on",
    icon: "power",
    text: "No response from the power button or remote, or the TV restarts by itself. Several different faults can cause this, so it needs to be checked.",
  },
  {
    id: "sound-no-picture",
    title: "Sound but no picture",
    icon: "screenOff",
    text: "You can hear audio but the screen stays dark. The cause is not obvious from the outside and can only be confirmed after inspection.",
  },
  {
    id: "lines-distortion",
    title: "Lines or colour distortion",
    icon: "lines",
    text: "Vertical or horizontal lines, coloured bands or a noisy picture. Whether this can be repaired depends on what is found.",
  },
  {
    id: "backlight",
    title: "Backlight or brightness issue",
    icon: "sun",
    text: "A very dim picture, uneven brightness or dark patches. Different faults can look similar, so a diagnosis is needed.",
  },
  {
    id: "no-sound",
    title: "No sound or distorted sound",
    icon: "volume",
    text: "Silent, crackling or very low sound, even though the picture looks normal.",
  },
  {
    id: "smart-tv",
    title: "Smart TV, Wi-Fi or app issues",
    icon: "wifi",
    text: "Apps that will not open, Wi-Fi that will not connect, or a TV stuck on its start-up screen.",
  },
];

export type ServiceCategory = {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
  symptoms: string[];
  mayBeChecked: string;
  share: string;
  caveat: string;
  /** Decorative workshop photo for the card (alt is empty; the text carries the meaning). */
  image: SiteImage;
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "led-lcd-repair",
    title: "LED and LCD TV repair",
    icon: "tv",
    summary: "General enquiries for display, power and audio faults on LED and LCD TVs.",
    symptoms: ["Picture, power or sound problems", "A fault that comes and goes", "A TV that worked until recently"],
    mayBeChecked: "Depending on the TV, an inspection can look at the power supply, the main board, the display connections and the panel.",
    share: "Brand, model number (usually on the back label), what you see and when it started.",
    caveat: "Which models and faults can be handled is confirmed when you enquire.",
    image: IMAGES.floorWall,
  },
  {
    id: "smart-tv-support",
    title: "Smart TV support",
    icon: "wifi",
    summary: "Questions about apps, Wi-Fi, software or connectivity problems on Smart TVs.",
    symptoms: ["Apps crashing or not opening", "Wi-Fi not connecting or dropping", "Stuck on the logo or restarting"],
    mayBeChecked: "Some of these problems come from settings or the home network, and some from the TV itself. Describing what happens helps work out which.",
    share: "Brand and model, what the TV does at start-up, and whether other devices connect to your Wi-Fi.",
    caveat: "Ask whether your particular software issue can be handled.",
    image: IMAGES.benchLargeTv,
  },
  {
    id: "no-power",
    title: "No power or will not start",
    icon: "power",
    summary: "TVs that show no sign of life, restart repeatedly or switch off on their own.",
    symptoms: ["No standby light", "Standby light on but no start-up", "Clicking sound or repeated restarts"],
    mayBeChecked: "Power-related faults can have several causes. Which part is responsible is only known after inspection.",
    share: "Whether any light shows, whether there was a power cut or surge, and any sounds or smells you noticed.",
    caveat: "A cause is not assumed from the symptom alone.",
    image: IMAGES.benchOpenedTv,
  },
  {
    id: "picture-backlight",
    title: "Picture and backlight issues",
    icon: "sun",
    summary: "Dark screens, dim or uneven brightness, or a picture that disappears.",
    symptoms: ["Sound works but the screen is dark", "Very dim picture", "Patches of uneven brightness"],
    mayBeChecked: "A dark or dim picture can come from different parts of the display system, which is why a visual check of the TV is needed.",
    share: "Whether a faint picture is visible with a torch held close to the screen, and whether the problem is steady or intermittent.",
    caveat: "Panel and backlight faults can have different causes and different costs.",
    image: IMAGES.bench,
  },
  {
    id: "lines-distortion",
    title: "Lines and distorted picture",
    icon: "lines",
    summary: "Lines, bands, colour distortion or a noisy picture on the screen.",
    symptoms: ["Vertical or horizontal lines", "Part of the screen blank or coloured", "Picture breaking into blocks or noise"],
    mayBeChecked: "The cause can lie in a signal source, a board or the panel itself.",
    share: "Whether the lines also appear in the TV's own menu, and whether different inputs show the same thing.",
    caveat: "There is no guarantee that a panel-related fault can be repaired.",
    image: IMAGES.circuitCloseup,
  },
  {
    id: "sound-issues",
    title: "Sound issues",
    icon: "volume",
    summary: "No sound, low sound, crackling or distortion.",
    symptoms: ["No sound at all", "Crackling or buzzing", "Sound only on some inputs"],
    mayBeChecked: "Settings, connected devices and the TV's own speakers and audio circuits can all play a part.",
    share: "Whether the sound problem happens on every input and with headphones or external speakers.",
    caveat: "Ask whether the audio part for your model can be handled.",
    image: IMAGES.benchTools,
  },
  {
    id: "panel-assessment",
    title: "Panel and screen damage assessment",
    icon: "search",
    summary: "An assessment for a cracked, spotted or physically damaged display.",
    symptoms: ["Cracks or impact marks", "Black spots or spreading patches", "Damage after a fall or knock"],
    mayBeChecked: "An inspection shows whether the display itself is affected.",
    share: "Brand, model, screen size and a description of how the damage happened.",
    caveat: "Display panels can be costly to replace, and for some TVs repair may not make sense. This will be discussed honestly.",
    image: IMAGES.board,
  },
];
