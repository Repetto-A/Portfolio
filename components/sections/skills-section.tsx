import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SkillsSection() {
  const skillCategories = [
    {
      title: "Languages & Frameworks",
      skills: [
        "Python",
        "C",
        "C++",
        "Java",
        "TypeScript",
        "JavaScript",
        "Django",
        "Django Rest Framework",
        "FastAPI",
        "Flask",
        "Express",
        "React",
        "Next.js",
        "HTML5",
        "CSS3",
        "TailwindCSS",
      ],
    },
    {
      title: "AI/ML & Data Science",
      skills: [
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "Langchain",
        "Langgraph",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "OpenCV",
        "Natural Language Processing",
        "Computer Vision",
        "Data Analysis & Visualization",
      ],
    },
    {
      title: "Databases & Infrastructure",
      skills: [
        "MySQL",
        "PostgreSQL",
        "SQLite",
        "MongoDB",
        "Redis",
        "Docker",
        "Terraform",
        "AWS",
        "Vercel",
        "Nginx",
        "Linux",
        "Git",
      ],
    },
    {
      title: "Automation & Integration",
      skills: [
        "REST APIs",
        "GraphQL",
        "Webhook Integration",
        "Selenium",
        "Social Media Automation",
        "Telegram and Whatsapp Bots",
        "Email Automation",
        "AFIP Connection",
        "Document Processing",
        "AI Chatbots",
        "AI Agents",
        "Workflow Automations",
      ],
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Skills & Technologies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A comprehensive toolkit for building modern applications, from frontend interfaces to AI-powered backend
            systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Experience Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">Full-Stack</div>
            <div className="text-sm text-muted-foreground">End-to-end application development</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">AI/ML</div>
            <div className="text-sm text-muted-foreground">Machine learning model implementation</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">Automation</div>
            <div className="text-sm text-muted-foreground">Business process optimization</div>
          </div>
        </div>
      </div>
    </section>
  )
}
