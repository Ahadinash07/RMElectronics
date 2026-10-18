import { BUSINESS } from "./site";

export type Faq = { q: string; a: string };

export const GENERAL_FAQS: Faq[] = [
  {
    q: "Does a technician come to my home?",
    a: `Yes. RM Electronics is a doorstep TV repair service across Hyderabad. Call ${BUSINESS.phone.display} or book online, and tell us your area so we can confirm the visit.`,
  },
  {
    q: "What is the visiting charge?",
    a: "Visiting charges start at \u20b9199. The repair cost itself depends on your TV model, the cause of the fault and whether parts are needed, and is discussed after the technician has checked the TV.",
  },
  {
    q: "Which areas of Hyderabad do you visit?",
    a: "Technicians visit homes across Hyderabad, including Nagole, Saidabad, Boduppal, Tarnaka, Badangpet, Kukatpally and Vanasthalipuram. If your area is not listed, call to check.",
  },
  {
    q: "What if my TV cannot be repaired at home?",
    a: "Some faults, such as a damaged panel or a board that needs workshop tools, may not be possible to fix at the doorstep. The technician will explain the options, including taking the TV to the workshop in Nagole.",
  },
  {
    q: "Which TV brands can I book for?",
    a: "The shop signboard lists Sony, LG, Samsung, Panasonic, Micromax and One+ TV, and the business also mentions Mi. This website has pages for LG OLED, Samsung, Sony, OnePlus and Vu. Confirm support for your exact model and parts availability when you book.",
  },
  {
    q: "Can you repair a TV that has sound but no picture?",
    a: "That symptom can have several causes. Share the TV brand, model and what you see, and the technician can check it at your home. The fault cannot be identified from the symptom alone.",
  },
  {
    q: "What should I share when I book?",
    a: "The TV brand, the model number if you can find it, what the TV is doing, your area in Hyderabad and a suitable way to reach you.",
  },
  {
    q: "Are you an authorised service centre?",
    a: "No authorised status is claimed. RM Electronics is an independent TV repair service. If your TV is under a manufacturer warranty, check the warranty terms before arranging a repair elsewhere.",
  },
  {
    q: "Is every display fault repairable?",
    a: "Not always. Some faults involve the panel or other parts, and whether a repair is possible or worthwhile depends on the diagnosis and the cost.",
  },
];

export const SERVICES_FAQS: Faq[] = [
  GENERAL_FAQS[0]!,
  GENERAL_FAQS[1]!,
  GENERAL_FAQS[3]!,
  {
    q: "Can you tell me what is wrong over the phone?",
    a: "A phone call can help decide the next step, but a firm diagnosis normally needs the TV to be checked, which is what the doorstep visit is for.",
  },
  {
    q: "What should I do if my TV will not turn on?",
    a: "Tell us whether any standby light appears, whether the TV restarts, and if there was a recent power cut or surge. These clues can help describe the problem, but the cause needs to be checked.",
  },
  {
    q: "Can you check a TV with sound but no picture?",
    a: "Yes, you can enquire about this symptom. A dark screen can have different causes, so share the TV brand and model and describe whether a faint picture is visible; an inspection is needed to identify the fault.",
  },
  {
    q: "Can lines or screen damage be repaired?",
    a: "Lines, spots or cracks can involve different parts of the display. The technician needs to assess the TV, and whether repair is possible or worthwhile depends on what is found.",
  },
  {
    q: "Can you help if my TV has no sound or distorted sound?",
    a: "You can book an assessment for sound problems. When you enquire, mention whether the issue happens on every input and whether you use headphones or external speakers; the cause needs to be checked.",
  },
  {
    q: "Do you look at Smart TV app or Wi-Fi problems?",
    a: "You can ask about app, Wi-Fi or start-up problems. Share the brand and model, what happens when you open the app or connect, and whether other devices connect to your Wi-Fi. Some issues can be related to the home network rather than the TV.",
  },
];
