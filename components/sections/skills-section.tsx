"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/layout/section-header"
import { Grid } from "@/components/layout/grid"
import { useTranslations, getTranslation } from "@/lib/i18n-context"

export function SkillsSection() {
  const [translations] = useTranslations()

  const skillCategories = [
    {
      titleKey: "skills.categories.languages",
      titleDefault: "Languages & Frameworks",
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
      titleDefault: "AI/ML & Data Science",
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
      titleDefault: "Databases & Infrastructure",
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
      titleDefault: "Automation & Integration",
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
    <Section variant="muted" spacing="default">
      <Container maxWidth="7xl">
        <SectionHeader
          title={getTranslation(translations, "skills.title")}
          description={getTranslation(
            translations,
            "skills.subtitle",
            "A comprehensive toolkit for building modern applications, from frontend interfaces to AI-powered backend systems.",
          )}
        />

        <Grid cols={{ md: 2, lg: 4 }} gap="md">
          {skillCategories.map((category, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  {getTranslation(translations, category.titleKey, category.titleDefault)}
                </CardTitle>
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
        </Grid>
      </Container>
    </Section>
  )
}
