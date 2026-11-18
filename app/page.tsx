import { FloatingNav } from "@/components/navigation/floating-nav";
import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero";
import { MyStackSection } from "@/components/sections/my-stack";
import { ProjectsSection } from "@/components/sections/projects";
import { StackOrbitSection } from "@/components/sections/stack-orbit";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <main className="flex-1">
        <HeroSection />
        <MyStackSection />
        <StackOrbitSection />
        <ProjectsSection />
      </main>
      <Footer />
    </>
  );
}
