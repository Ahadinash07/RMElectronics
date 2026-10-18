import type { Faq } from "./faqs";
import { IMAGES, type SiteImage } from "./images";
import type { BrandOption } from "@/lib/validation";

/**
 * Brand enquiry pages (/tv-repair/[brand]).
 *
 * Every brand has its own angle, symptom wording, questions and FAQs - they are
 * not one template with the name swapped. Set `published: false` to take a page
 * offline (it disappears from navigation, the sitemap and returns 404) until the
 * owner confirms that brand/model is actually supported.
 *
 * No manufacturer logos are used and no authorised status is implied.
 */

export type BrandSymptom = { title: string; text: string };

export type Brand = {
  slug: "lg-oled" | "samsung" | "sony" | "oneplus" | "vu";
  published: boolean;
  /** Short name used in cards and navigation. */
  name: string;
  /** Value pre-selected in the enquiry form brand dropdown. */
  formBrand: BrandOption;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** One-line summary shown on brand cards. */
  cardText: string;
  intro: string;
  caveat: string;
  angle: { heading: string; paragraphs: string[] };
  symptomsHeading: string;
  symptoms: BrandSymptom[];
  modelHelp: { heading: string; text: string };
  share: string[];
  faqs: Faq[];
  image: SiteImage;
  related: Brand["slug"][];
};

export const BRANDS: Brand[] = [
  {
    slug: "lg-oled",
    published: true,
    name: "LG OLED",
    formBrand: "LG",
    h1: "LG OLED Doorstep TV Repair in Hyderabad",
    metaTitle: "LG OLED Doorstep TV Repair in Hyderabad | RM Electronics",
    metaDescription:
      "Book RM Electronics for your LG OLED TV at your doorstep in Hyderabad. Share your model and symptoms to discuss next steps.",
    cardText: "Black screen, patches, lines or start-up problems on LG OLED TVs.",
    intro:
      "RM Electronics offers doorstep TV repair across Hyderabad. Contact RM Electronics about your LG OLED TV issue. Share the model and symptoms so the next step can be discussed. Repairability depends on the fault and model.",
    caveat: "Whether your LG OLED model and fault can be handled is confirmed during the enquiry.",
    angle: {
      heading: "Why an OLED enquiry is not the same as an LED one",
      paragraphs: [
        "An OLED screen produces its own light, pixel by pixel, so it has no separate backlight the way an LED TV does. That changes how some symptoms are read: a dark or patchy picture on an OLED is not looked at as a backlight fault.",
        "The display panel is also the most expensive part of any TV, and on an OLED it is not a simple swap. Some panel-related faults may not be possible or sensible to repair. That is why the honest first step is to describe the model and symptoms and have the TV checked before anything is promised.",
        "If a mark or shadow stays on the picture, or part of the screen is dark while the sound plays normally, note when you first saw it and whether it changes. Those details help the discussion.",
      ],
    },
    symptomsHeading: "Problems people report with LG OLED TVs",
    symptoms: [
      { title: "Black screen but sound works", text: "The TV seems to be on, you can hear it, but nothing appears on the display." },
      { title: "Dark patches, shadows or marks", text: "Areas of the picture that look darker, or marks that stay visible when the content changes." },
      { title: "Lines or colour bands", text: "Vertical or horizontal lines, or a band of wrong colours across the picture." },
      { title: "Will not switch on or keeps restarting", text: "No start-up, or the TV switches on and off by itself." },
      { title: "webOS apps or Wi-Fi not working", text: "Apps closing, a slow interface, or a TV that will not stay connected to the network." },
    ],
    modelHelp: {
      heading: "Finding your LG OLED model number",
      text: "LG OLED model numbers begin with OLED followed by the screen size, for example OLED55 and then more letters and digits. You can usually find it on the label at the back of the TV, or in the TV's settings under information about the TV.",
    },
    share: [
      "The full model number from the back label",
      "Whether the TV makes sound or shows a logo at start-up",
      "When the problem began and whether it comes and goes",
      "Any knock, fall, power cut or liquid exposure before it started",
    ],
    faqs: [
      {
        q: "Do you repair every LG OLED fault?",
        a: "No repair outcome is promised in advance. Some faults can be repaired and some, especially those involving the display panel, may not be possible or worthwhile. The model and fault are discussed during the enquiry.",
      },
      {
        q: "Is a dark or patchy OLED screen the same as a backlight problem?",
        a: "Not in the same way. An OLED panel lights each pixel itself, so it does not use a backlight like an LED TV. The cause of a patchy picture has to be found by checking the TV.",
      },
      {
        q: "Are you an official LG service centre?",
        a: "No. RM Electronics is an independent repair service and is not presented as an authorised LG centre. If your TV is in warranty, check the warranty terms first.",
      },
    ],
    image: IMAGES.bench,
    related: ["samsung", "sony"],
  },
  {
    slug: "samsung",
    published: true,
    name: "Samsung",
    formBrand: "Samsung",
    h1: "Samsung Doorstep TV Repair in Hyderabad",
    metaTitle: "Samsung Doorstep TV Repair in Hyderabad | RM Electronics",
    metaDescription:
      "Book RM Electronics for Samsung TV repair at your doorstep in Hyderabad. Repair options depend on the model and fault.",
    cardText: "Power, picture, sound and Smart Hub problems on Samsung TVs.",
    intro:
      "RM Electronics offers doorstep TV repair across Hyderabad. Tell us about your Samsung TV's power, picture, sound or Smart TV issue. A diagnosis is needed to confirm the cause.",
    caveat: "Support for your Samsung model and parts availability are confirmed during the enquiry.",
    angle: {
      heading: "Describe what the TV does when you press power",
      paragraphs: [
        "With Samsung TVs, the first few seconds after switching on say a lot. Does the standby light come on, blink or stay off? Does the Samsung logo appear? Does the picture then disappear, or does the TV restart? Writing this down before you call makes the conversation quicker.",
        "Samsung Smart TVs run the Smart Hub interface. Apps that crash or Wi-Fi that keeps dropping are sometimes caused by network or settings problems rather than a hardware fault, which is another reason to describe the problem first instead of assuming a part has failed.",
      ],
    },
    symptomsHeading: "Common Samsung TV symptoms",
    symptoms: [
      { title: "Does not turn on or keeps restarting", text: "The TV does not start, or starts and then switches itself off again." },
      { title: "Standby light on or blinking, no picture", text: "A light shows but the screen stays dark." },
      { title: "Half the screen or vertical lines", text: "Part of the screen is blank, or lines run across the picture." },
      { title: "Dim, flickering or uneven picture", text: "Brightness that fades, flickers or is uneven across the screen." },
      { title: "Smart Hub, apps or Wi-Fi problems", text: "Apps not opening, a frozen home screen or a connection that will not hold." },
    ],
    modelHelp: {
      heading: "Where to find the Samsung model number",
      text: "The model number is printed on the label at the back of the TV and in the TV's support or information settings. Samsung model codes usually start with letters such as UA, QA or UE followed by the screen size.",
    },
    share: [
      "The model number and screen size",
      "What the standby light does, if anything",
      "Whether the Samsung logo appears at start-up",
      "Whether the problem is constant or comes and goes",
    ],
    faqs: [
      {
        q: "Does a technician come to my home?",
        a: "Yes, RM Electronics is a doorstep service across Hyderabad. Call to confirm your area. If a TV cannot be repaired at home, the team will explain the options, including taking it to the workshop.",
      },
      {
        q: "Can a blinking standby light be diagnosed over the phone?",
        a: "Not reliably. A blinking light can be a useful clue, so do mention it, but the real cause is only confirmed by checking the TV.",
      },
      {
        q: "Will you tell me the cost before work starts?",
        a: "Repair cost depends on the model, the fault and any parts needed. Ask about the estimate when you contact RM Electronics. No fixed prices are published here.",
      },
    ],
    image: IMAGES.board,
    related: ["lg-oled", "vu"],
  },
  {
    slug: "sony",
    published: true,
    name: "Sony",
    formBrand: "Sony",
    h1: "Sony Doorstep TV Repair in Hyderabad",
    metaTitle: "Sony Doorstep TV Repair in Hyderabad | RM Electronics",
    metaDescription:
      "Book RM Electronics for Sony TV repair at your doorstep in Hyderabad. Share your TV model and the issue you are seeing.",
    cardText: "Picture, sound, input and start-up problems on Sony TVs.",
    intro:
      "RM Electronics offers doorstep TV repair across Hyderabad. Contact RM Electronics with your Sony TV model and symptoms. Service scope depends on the model, fault and parts availability.",
    caveat: "Whether your Sony model can be handled, and whether parts can be sourced, is confirmed during the enquiry.",
    angle: {
      heading: "Older and newer Sony TVs are different conversations",
      paragraphs: [
        "Sony TVs stay in use for many years, so enquiries range from older LED sets to recent Android TV and Google TV models. Age matters: parts availability, and whether a repair makes sense compared with the TV's value, can be very different between a ten-year-old set and a recent one.",
        "Sony model numbers often begin with KD, KDL or XR followed by the screen size. Sharing the full number from the back label lets the team understand which kind of TV you have before discussing options.",
        "If the problem involves a device you have connected, such as a set-top box or a soundbar, mention it. Input and HDMI problems sometimes sit outside the TV's picture or sound circuits.",
      ],
    },
    symptomsHeading: "Sony TV problems that people ask about",
    symptoms: [
      { title: "Picture is dark, shadowed or lined", text: "A dim picture, shadows across the screen or lines that appear after warming up." },
      { title: "Sound is missing or distorted", text: "No audio, crackling or sound that only works on some inputs." },
      { title: "Stuck on the logo or restarting", text: "The Sony logo appears but the TV never reaches the home screen." },
      { title: "HDMI or input not detected", text: "A connected box, console or soundbar is not recognised." },
      { title: "Remote, Bluetooth or app problems", text: "The remote does not pair, or apps will not load." },
    ],
    modelHelp: {
      heading: "How to read the Sony model number",
      text: "Look for the model on the back label or in the TV's settings under information about the TV. Please share the whole number, including letters, as models of the same size can differ a lot.",
    },
    share: [
      "The full model number, including letters",
      "Roughly how old the TV is",
      "Whether the problem happens on every input",
      "What devices are connected to the TV",
    ],
    faqs: [
      {
        q: "Is it worth repairing an older Sony TV?",
        a: "That depends on the fault, the cost and the age of the set. Ask about the estimate after the TV has been checked, then decide.",
      },
      {
        q: "Can you get parts for my Sony model?",
        a: "Parts availability depends on the model and the fault, so it cannot be promised in advance. It is confirmed during the enquiry.",
      },
      {
        q: "Are you an authorised Sony service centre?",
        a: "No authorised status is claimed. RM Electronics is an independent TV repair service. Check your warranty terms if the TV is still covered.",
      },
    ],
    image: IMAGES.floor,
    related: ["samsung", "oneplus"],
  },
  {
    slug: "oneplus",
    published: true,
    name: "OnePlus",
    formBrand: "OnePlus",
    h1: "OnePlus Doorstep TV Repair in Hyderabad",
    metaTitle: "OnePlus Doorstep TV Repair in Hyderabad | RM Electronics",
    metaDescription:
      "Book RM Electronics for OnePlus TV repair at your doorstep in Hyderabad. Share your model and issue to discuss repair options.",
    cardText: "Start-up loops, remote, Wi-Fi, display and power issues on OnePlus TVs.",
    intro:
      "RM Electronics offers doorstep TV repair across Hyderabad. Share your OnePlus TV model and issue to discuss repair options. RM Electronics is an independent repair service, not an official OnePlus service centre.",
    caveat: "Whether your OnePlus model can be handled is confirmed during the enquiry.",
    angle: {
      heading: "Many OnePlus TV problems start in the software",
      paragraphs: [
        "OnePlus TVs are Smart TVs, so a good share of the problems people report are about the system rather than the screen: a TV that gets stuck at the logo, a remote that will not pair, apps that crash, or Wi-Fi and Bluetooth that will not connect.",
        "Some of these can be related to settings or the network, and some to the TV's own hardware. Explaining exactly what you see on screen, and in what order, is the most useful thing you can do before calling.",
        "OnePlus has sold TVs in several series, including Y, U and Q models. The series and the screen size are useful details to share along with the model number on the back label.",
      ],
    },
    symptomsHeading: "Typical OnePlus TV symptoms",
    symptoms: [
      { title: "Stuck on the logo or restarting in a loop", text: "The TV starts but never reaches the home screen, or restarts repeatedly." },
      { title: "Remote or Bluetooth will not pair", text: "The remote stops responding or will not connect again." },
      { title: "Wi-Fi or app problems", text: "The TV will not join the network, or apps freeze and close." },
      { title: "Lines or patches on the display", text: "Lines, coloured bands or uneven areas on the picture." },
      { title: "No power", text: "No light and no response when you press the power button." },
    ],
    modelHelp: {
      heading: "Finding the OnePlus TV model",
      text: "The model name and number are on the back label and in the TV's settings under information about the TV. The series (such as Y, U or Q) and the screen size help to identify it.",
    },
    share: [
      "The series and model number",
      "What is on screen when the problem happens",
      "Whether the TV ever reaches the home screen",
      "Whether a software update or reset was tried before",
    ],
    faqs: [
      {
        q: "Are you an official OnePlus service centre?",
        a: "No. RM Electronics is an independent repair service. If your OnePlus TV is under warranty, check the warranty terms before arranging a repair elsewhere.",
      },
      {
        q: "Can a start-up loop be fixed without opening the TV?",
        a: "Sometimes the cause is in settings or software and sometimes in hardware. It cannot be said without checking the TV and hearing exactly what happens.",
      },
      {
        q: "What helps the team most when I call?",
        a: "The model number, what appears on screen in order, and whether the TV ever reaches the home screen. Notes or a phone photo of the screen can help you describe it.",
      },
    ],
    image: IMAGES.sign,
    related: ["sony", "vu"],
  },
  {
    slug: "vu",
    published: true,
    name: "Vu",
    formBrand: "Vu",
    h1: "Vu Doorstep TV Repair in Hyderabad",
    metaTitle: "Vu Doorstep TV Repair in Hyderabad | RM Electronics",
    metaDescription:
      "Book RM Electronics for Vu TV repair at your doorstep in Hyderabad. Model support and parts are confirmed during the enquiry.",
    cardText: "Blank screen, lines, dim picture, sound and Smart TV issues on Vu TVs.",
    intro:
      "RM Electronics offers doorstep TV repair across Hyderabad. Contact RM Electronics with the Vu TV model and symptoms. Confirm parts availability and repair scope during the enquiry.",
    caveat: "Model support and parts availability for Vu TVs are confirmed during the enquiry, not promised in advance.",
    angle: {
      heading: "Ask about parts and scope first",
      paragraphs: [
        "With any TV brand, whether a repair is practical depends on whether the right part can be sourced. That is especially worth asking about up front for Vu TVs, because it varies by model and by how long ago the TV was made.",
        "So the most useful first step is a short conversation: tell RM Electronics the exact model and the symptoms, and ask what a repair would involve and whether the needed parts can be obtained for that model.",
        "If you are weighing up a repair against buying a new TV, ask for that conversation before you decide. A clear answer on parts and scope is more valuable than a quick guess.",
      ],
    },
    symptomsHeading: "Problems people report with Vu TVs",
    symptoms: [
      { title: "Power light on, screen blank", text: "The TV appears to have power but nothing shows on the display." },
      { title: "Half-screen or lines", text: "Part of the picture missing, or lines across the screen." },
      { title: "Dim or uneven brightness", text: "A picture that is very faint, or brighter in some areas than others." },
      { title: "Sound problems", text: "No audio, low volume or crackling." },
      { title: "Smart TV apps or remote not working", text: "Apps will not open or the remote stops responding." },
    ],
    modelHelp: {
      heading: "Locating the Vu model details",
      text: "The model name and number are on the label at the back of the TV, and often in the settings under information about the TV. Please share the screen size too.",
    },
    share: [
      "The full model name, number and screen size",
      "Roughly when the TV was bought",
      "What you see on screen and whether any light shows",
      "Whether the problem is constant or intermittent",
    ],
    faqs: [
      {
        q: "Are parts available for my Vu model?",
        a: "That depends on the model and the fault, so it is confirmed during the enquiry rather than promised in advance.",
      },
      {
        q: "Can you repair an older Vu TV?",
        a: "Possibly, but it depends on the fault and whether parts can be sourced for that model. Describe the TV and the problem to find out.",
      },
      {
        q: "Does the repair estimate come before the work?",
        a: "Ask about the estimate and what it covers when you enquire. This website does not publish prices or promise turnaround times.",
      },
    ],
    image: IMAGES.bench,
    related: ["samsung", "oneplus"],
  },
];

export const PUBLISHED_BRANDS = BRANDS.filter((b) => b.published);

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug && b.published);
}
