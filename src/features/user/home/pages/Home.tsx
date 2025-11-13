import BestPackages from "../components/BestPackages";
import Hero from "../components/Hero";
import OurServices from "../components/OurServices";
import PopularDestinations from "../components/PopularDestinations";

export default function Home() {
  return (
    <>
      <Hero />
      <OurServices />
      <PopularDestinations />
      <BestPackages />
    </>
  );
}
