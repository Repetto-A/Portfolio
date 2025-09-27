export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">About</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              A passionate systems engineering student with a focus on creating intelligent solutions that bridge the
              gap between complex problems and elegant technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Short Bio */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Background</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I'm a 23-year-old systems engineering student specializing in management systems, automation, and
                  AI/ML development. My work focuses on creating practical solutions that solve real-world business
                  challenges.
                </p>
                <p>
                  From factory quoting systems to real estate management platforms, I enjoy building comprehensive
                  applications that streamline operations and enhance user experiences. My recent work includes
                  AI-powered seismic detection for NASA's Space Apps Challenge and various automation tools for
                  different industries.
                </p>
              </div>
            </div>

            {/* Approach */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Approach</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I believe in building technology that's both powerful and accessible. Every project starts with
                  understanding the core problem and designing solutions that are scalable, maintainable, and
                  user-focused.
                </p>
                <p>
                  My experience spans full-stack development, machine learning implementation, and system architecture.
                  I'm particularly interested in how AI and automation can transform traditional business processes and
                  create new opportunities for innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
