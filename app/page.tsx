import { HomeAnnouncements } from "@/components/home/HomeAnnouncements";
import { ExperienceBanner } from "@/components/home/ExperienceBanner";
import { HomeFatwa } from "@/components/home/HomeFatwa";
import { FeatureCards } from "@/components/home/FeatureCards";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeDailyInspiration } from "@/components/home/HomeDailyInspiration";
import { HeroWave } from "@/components/home/HeroWave";
import { HomeHero } from "@/components/home/HomeHero";
import { LearnAccordion } from "@/components/home/LearnAccordion";
import { StudentTestimonials } from "@/components/home/StudentTestimonials";
import { getFeaturedHomepageCourses } from "@/lib/courses";
import { getHomepageDailyInspiration } from "@/lib/daily-inspiration";

export default async function HomePage() {
  const [featuredCourses, dailyInspiration] = await Promise.all([
    getFeaturedHomepageCourses(),
    getHomepageDailyInspiration(),
  ]);

  return (
    <>
      <HomeHero />
      <HeroWave />
      <FeatureCards />
      <HomeDailyInspiration inspiration={dailyInspiration} />
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
