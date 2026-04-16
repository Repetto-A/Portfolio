"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { Grid } from "@/components/layout/grid"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

const skillCategories = [
  {
    titleKey: "skills.categories.languages",
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
    titleKey: "skills.categories.frameworks",
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
    titleKey: "skills.categories.databases",
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
    titleKey: "skills.categories.tools",
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

export function SkillsSection() {
  const [translations] = useTranslations()

  return (
    <Section variant="muted" spacing="default">
      <Container maxWidth="7xl">
        <SectionHeader
          title={getTranslation(translations, "skills.title")}
          description={getTranslation(translations, "skills.subtitle")}
          eyebrow="Technical Stack"
        />

        <Grid cols={{ md: 2, lg: 4 }} gap="md">
          {skillCategories.map((category, index) => (
            <Card
              key={index}
              className={`h-full border-t-2 border-t-foreground/20 scroll-reveal-stagger-${index + 1}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  {getTranslation(translations, category.titleKey)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="outline"
                      className="text-xs cursor-default transition-all duration-150 hover:bg-foreground/5 hover:border-foreground/30"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}
