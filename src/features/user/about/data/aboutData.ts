import { faGlobe, faUsers, faBullseye, faAward } from "@fortawesome/free-solid-svg-icons";
import { faCompass } from "@fortawesome/free-regular-svg-icons";
import aboutBg from "@/assets/images/about.jfif";
import { type IconProp } from "@fortawesome/fontawesome-svg-core";

export const storyText = `
TourEase was created with a clear vision: to empower travel agencies with smarter, simpler, and more connected tools. What began as an idea to make tourism management easier has evolved into a powerful platform trusted by agencies around the world.
We believe that technology should enhance human connection — not replace it. That’s why TourEase blends intelligent automation with a personal touch, helping travel professionals focus on what truly matters: delivering unforgettable experiences to their customers.
From dynamic trip planning and real-time reservations to AI-powered insights and customer engagement tools, TourEase transforms how agencies operate. Today, we’re proud to support hundreds of growing travel businesses, helping them streamline operations, increase efficiency, and craft journeys that inspire.
Our journey is driven by innovation, collaboration, and a shared passion for travel. At TourEase, we’re not just building software — we’re shaping the future of tourism management, one seamless experience at a time.
`;

export const values: { title: string; text: string; icon: IconProp }[] = [
    { title: "Global Reach", text: "We connect travelers with incredible destinations across all seven continents, creating unforgettable experiences worldwide.", icon: faGlobe },
    { title: "Customer Focus", text: "Your satisfaction is our priority. We provide personalized service and 24/7 support to ensure your journey is seamless.", icon: faUsers },
    { title: "Sustainability", text: "We're committed to responsible tourism that respects local cultures and protects the environment for future generations.", icon: faBullseye },
    { title: "Innovation", text: "Award-winning service backed by years of expertise and a passion for creating extraordinary travel experiences.", icon: faAward },
];

export const teamMembers = [
    "Ali Mahmoud",
    "Bakr Abuhassiba",
    "Abdelrahman Hashem",
    "Abdelrahman Gamal",
    "Youssef Elhabal",
];

export const mission = {
    title: "Our Mission",
    text: "To inspire and enable everyone to explore the world, fostering cultural understanding and creating positive impact in the communities we visit. We believe travel has the power to transform lives and build bridges between cultures.",
    icon: faCompass,
    backgroundImage: aboutBg,
};
