import ShaderBackground from "@/components/ShaderBackground"
import HeroContent from "@/components/HeroContent"
import PulsingCircle from "@/components/PulsingCircle"
import Header from "@/components/Header"
import ProjectsSection from "@/components/ProjectsSection"
import AboutSection from "@/components/AboutSection"
import NotesSection from "@/components/NotesSection"
import PlannerSection from "@/components/PlannerSection"

const Index = () => {
  return (
    <div className="bg-black">
      <div className="relative" style={{ height: "100vh" }}>
        <ShaderBackground>
          <Header />
          <HeroContent />
          <PulsingCircle />
        </ShaderBackground>
      </div>
      <div className="relative bg-black/95">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/80 to-black pointer-events-none" style={{ height: "120px", top: "-60px" }} />
        <AboutSection />
        <PlannerSection />
        <ProjectsSection />
        <NotesSection />
      </div>
    </div>
  )
}

export default Index