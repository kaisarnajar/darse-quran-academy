import { HomeAnnouncements } from "@/components/home/HomeAnnouncements";
import { ExperienceBanner } from "@/components/home/ExperienceBanner";
import { HomeFatwa } from "@/components/home/HomeFatwa";
import { FeatureCards } from "@/components/home/FeatureCards";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HeroWave } from "@/components/home/HeroWave";
import { HomeHero } from "@/components/home/HomeHero";
import { LearnAccordion } from "@/components/home/LearnAccordion";
import { StudentTestimonials } from "@/components/home/StudentTestimonials";
import { getPublishedCourses } from "@/lib/courses";

export default async function HomePage() {
  const courses = await getPublishedCourses();
  const featuredCourses = courses.slice(0, 6);

  return (
    <>
      <HomeHero />
      <HeroWave />
      <FeatureCards />
      <FeaturedCourses courses={featuredCourses} />
      <HomeAnnouncements />
      <HomeAbout />
      <ExperienceBanner />
      <StudentTestimonials />
      <HomeFatwa />
      <LearnAccordion />
    </>
  );
}
