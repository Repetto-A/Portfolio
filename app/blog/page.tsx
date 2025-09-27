import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Alejandro Repetto",
  description:
    "Technical insights, project breakdowns, and lessons learned from building systems engineering solutions.",
}

const blogPosts = [
  {
    id: "nasa-space-apps-2024",
    title: "Building AI-Powered Seismic Detection for NASA Space Apps 2024",
    excerpt:
      "How we developed a machine learning model to detect seismic activity on the Moon and Mars, tackling one of the most challenging problems in space exploration.",
    date: "2024-10-15",
    readTime: "8 min read",
    category: "AI/ML",
    featured: true,
  },
  {
    id: "automation-factory-systems",
    title: "Automating Factory Quotation Systems: Lessons from Cotibot",
    excerpt:
      "The journey of building an intelligent quoting system that integrates with AFIP APIs and generates automated PDFs for manufacturing businesses.",
    date: "2024-09-22",
    readTime: "6 min read",
    category: "Automation",
    featured: false,
  },
  {
    id: "real-estate-tech-stack",
    title: "Building Scalable Real Estate Management Systems",
    excerpt:
      "Technical insights from developing a comprehensive property management platform with calendar bookings, email automation, and Telegram integration.",
    date: "2024-08-18",
    readTime: "7 min read",
    category: "Systems Engineering",
    featured: false,
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Blog & Case Studies</h1>
            <p className="text-lg text-muted-foreground">
              Technical insights, project breakdowns, and lessons learned from building systems that solve real-world
              problems.
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{post.category}</Badge>
                  {post.featured && <Badge variant="outline">Featured</Badge>}
                </div>

                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </CardTitle>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>

                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href={`/blog/${post.id}`}>Read Full Article →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
