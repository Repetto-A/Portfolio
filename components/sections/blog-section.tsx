import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

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

export function BlogSection() {
  return (
    <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Blog & Case Studies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Technical insights, project breakdowns, and lessons learned from building systems that solve real-world
            problems.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          <div className="lg:col-span-2">
            {blogPosts
              .filter((post) => post.featured)
              .map((post) => (
                <Card key={post.id} className="h-full group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg flex items-center justify-center">
                    <img
                      src={`/placeholder.png?height=300&width=600&text=${post.title.split(" ").slice(0, 3).join(" ")}`}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>

                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{post.category}</Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>

                    <CardTitle className="text-2xl group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
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

                    <Button asChild variant="ghost" className="group/btn p-0 h-auto">
                      <Link href={`/blog/${post.id}`}>
                        Read Full Article
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Recent Posts */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Recent Posts</h3>

            <div className="space-y-4">
              {blogPosts
                .filter((post) => !post.featured)
                .map((post) => (
                  <Card key={post.id} className="group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>

                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h4>

                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>

                        <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-xs">
                          <Link href={`/blog/${post.id}`}>Read More</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
