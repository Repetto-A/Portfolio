import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

const blogPosts = {
  "nasa-space-apps-2024": {
    title: "Building AI-Powered Seismic Detection for NASA Space Apps 2024",
    excerpt:
      "How we developed a machine learning model to detect seismic activity on the Moon and Mars, tackling one of the most challenging problems in space exploration.",
    date: "2024-10-15",
    readTime: "8 min read",
    category: "AI/ML",
    content: `
# Building AI-Powered Seismic Detection for NASA Space Apps 2024

The NASA Space Apps Challenge 2024 presented us with an incredible opportunity to tackle one of the most fascinating problems in space exploration: detecting seismic activity on celestial bodies like the Moon and Mars. Our team developed an AI-powered solution that could identify and classify seismic events from space-based sensor data.

## The Challenge

Seismic detection in space environments presents unique challenges compared to Earth-based systems:

- **Limited data availability**: Unlike Earth, we have sparse historical seismic data from lunar and Martian missions
- **Environmental factors**: Different gravitational fields, atmospheric conditions, and surface compositions
- **Signal processing complexity**: Distinguishing between actual seismic events and noise from various sources

## Our Approach

We developed a machine learning pipeline that combines several techniques:

### Data Preprocessing
- Signal filtering and noise reduction algorithms
- Feature extraction from time-series seismic data
- Data augmentation techniques to expand our limited dataset

### Model Architecture
- Convolutional Neural Networks (CNNs) for pattern recognition in seismic waveforms
- Long Short-Term Memory (LSTM) networks for temporal sequence analysis
- Ensemble methods combining multiple model predictions

### Key Features
- Real-time seismic event detection
- Classification of event types (moonquakes vs. impacts)
- Magnitude estimation and location triangulation
- Visualization dashboard for mission control

## Technical Implementation

The system was built using Python with TensorFlow for the machine learning components. We utilized several key libraries:

- **TensorFlow/Keras**: For building and training neural networks
- **Scikit-learn**: For traditional ML algorithms and preprocessing
- **Pandas/NumPy**: For data manipulation and numerical computations
- **Matplotlib/Plotly**: For data visualization and dashboard creation

## Results and Impact

Our solution achieved promising results in detecting seismic events with high accuracy while maintaining low false positive rates. The system demonstrated the potential for autonomous seismic monitoring on future lunar and Martian missions.

## Lessons Learned

This project reinforced several important principles:

1. **Domain expertise matters**: Understanding the physics of seismic activity was crucial for feature engineering
2. **Data quality over quantity**: With limited space data, careful preprocessing and augmentation were essential
3. **Ensemble approaches**: Combining multiple models improved robustness and reliability
4. **Real-world constraints**: Designing for space environments requires considering power, computational, and communication limitations

## Future Directions

The work opens several avenues for future development:
- Integration with actual space mission hardware
- Expansion to other planetary bodies
- Real-time processing optimization for space-grade computers
- Collaboration with planetary science researchers

This project exemplifies how AI/ML can contribute to space exploration and scientific discovery, pushing the boundaries of what's possible in autonomous space systems.
    `,
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} - Alejandro Repetto`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} - Alejandro Repetto`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="space-y-6 mb-12">
          <div className="space-y-4">
            <Badge variant="secondary">{post.category}</Badge>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight text-balance">{post.title}</h1>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
            <img
              src={`/placeholder.png?height=400&width=800&text=${post.title.split(" ").slice(0, 4).join(" ")}`}
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Written by Alejandro Repetto</p>
              <p className="text-xs text-muted-foreground">
                Systems Engineering Student specializing in AI/ML and Automation
              </p>
            </div>

            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share Article
            </Button>
          </div>
        </footer>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                "@type": "Person",
                name: "Alejandro Repetto",
              },
              publisher: {
                "@type": "Person",
                name: "Alejandro Repetto",
              },
            }),
          }}
        />
      </article>
    </main>
  )
}
