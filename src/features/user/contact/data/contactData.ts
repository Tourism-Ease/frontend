import { faPhone, faEnvelope, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import contactUsBg from '@/assets/images/contact.jfif';

export const contactCards: { icon: IconProp; title: string; lines: string[]; subtitle?: string }[] = [
    { icon: faPhone, title: "Phone", lines: ["+1 (555) 123-4567", "+1 (555) 765-4321"], subtitle: "Mon-Fri from 8am to 6pm" },
    { icon: faEnvelope, title: "Email", lines: ["info@wanderlust.com", "support@wanderlust.com"], subtitle: "We'll respond within 24 hours" },
    { icon: faLocationDot, title: "Office", lines: ["123 Travel Street", "New York, NY 10001"], subtitle: "Visit us Monday-Friday" },
    { icon: faClock, title: "Working Hours", lines: ["Monday - Friday: 8am - 6pm", "Saturday: 9am - 4pm"], subtitle: "Closed on Sundays" },
];

export const contactPageData = {
    bgImage: contactUsBg,
    icon: faComment,
    title: "Get In Touch",
    description: "Have questions about our trips? Need help planning your adventure? We're here to help you every step of the way.",
};
