import AboutSections from "../components/AboutSections";
import TeamSection from "../components/TeamSection";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white mt-10">
            <AboutSections />
            <TeamSection />
        </div>
    );
};

export default AboutPage;
