# Alejandro Repetto - Portfolio Website

A modern, responsive portfolio website showcasing systems engineering projects, AI/ML implementations, and automation solutions. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, professional interface with dark/light mode support
- **Responsive Layout**: Optimized for all devices and screen sizes
- **SEO Optimized**: Complete meta tags, OpenGraph, and structured data
- **Performance Focused**: Lighthouse-optimized with fast loading times
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Project Showcase**: Interactive project cards with detailed modal views
- **Blog System**: Technical articles and case studies
- **Contact Form**: Functional contact form with validation
- **Analytics Ready**: Plausible Analytics integration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Inter + JetBrains Mono
- **Theme**: next-themes for dark/light mode
- **Analytics**: Plausible (privacy-focused)

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── projects/          # Project detail pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── sections/          # Page sections
│   ├── ui/               # UI components (shadcn/ui)
│   └── navigation.tsx     # Navigation component
├── content/              # Content data
│   └── projects.json     # Project information
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+ or pnpm

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Repetto-A/portfolio-website.git
   cd portfolio-website
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   # or
   pnpm dev
   \`\`\`

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🧪 Testing

Run the test suite:

\`\`\`bash
npm test
# or for watch mode
npm run test:watch
\`\`\`

## 📝 Content Management

### Updating Projects

Edit `content/projects.json` to add, modify, or remove projects:

\`\`\`json
{
  "projects": [
    {
      "id": "project-slug",
      "title": "Project Name",
      "description": "Project description...",
      "status": "production", // "in-progress", "production", "competition", "prototype"
      "techStack": ["React", "Node.js", "PostgreSQL"],
      "features": ["Feature 1", "Feature 2"],
      "githubUrl": "https://github.com/username/repo",
      "demoUrl": "https://demo.example.com", // optional
      "images": ["/projects/project-1.jpg"],
      "category": "Web Application"
    }
  ]
}
\`\`\`

### Adding Blog Posts

1. Add post metadata to `app/blog/[slug]/page.tsx`
2. Create the post content in the same file
3. Update the blog posts array in `components/sections/blog-section.tsx`

### Updating Personal Information

- **Hero Section**: Edit `components/sections/hero-section.tsx`
- **About Section**: Edit `components/sections/about-section.tsx`
- **Skills**: Edit `components/sections/skills-section.tsx`
- **Contact Info**: Edit `components/sections/contact-section.tsx`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Configure Environment Variables** (if needed)
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Your domain for analytics
   - `CONTACT_EMAIL`: Email for contact form notifications

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `out` (if using static export) or `.next`
3. **Environment Variables**: Same as Vercel

### Other Platforms

The site works on any platform supporting Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Configuration

### Analytics

Replace the Plausible script in `app/layout.tsx`:

\`\`\`tsx
<script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
\`\`\`

### SEO

Update SEO settings in `app/layout.tsx`:

\`\`\`tsx
export const metadata: Metadata = {
  title: "Your Name - Your Title",
  description: "Your description...",
  // ... other metadata
}
\`\`\`

### Contact Form

The contact form uses a Next.js API route (`app/api/contact/route.ts`). To enable email sending:

1. Install email service (Resend, SendGrid, etc.)
2. Add API keys to environment variables
3. Update the API route to send emails

## 🎨 Customization

### Colors

Edit the color scheme in `app/globals.css`:

\`\`\`css
:root {
  --primary: your-primary-color;
  --secondary: your-secondary-color;
  /* ... */
}
\`\`\`

### Fonts

Update fonts in `app/layout.tsx`:

\`\`\`tsx
import { Cute_Font as YourFont } from 'next/font/google'

const yourFont = YourFont({ subsets: ['latin'] })
\`\`\`

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting

## 🔒 Security

- **Content Security Policy**: Configured for production
- **Form Validation**: Client and server-side validation
- **XSS Protection**: React's built-in XSS protection
- **HTTPS**: Enforced in production

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support:
- Email: repettoalejandroing@gmail.com
- LinkedIn: [linkedin.com/in/alejandro-repetto](https://linkedin.com/in/alejandro-repetto)
- GitHub: [github.com/Repetto-A](https://github.com/Repetto-A)

---

**Built with ❤️ by Alejandro Repetto**
