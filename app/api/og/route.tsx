import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get("title") || "Alejandro Repetto"
    const type = searchParams.get("type") || "default"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundImage: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          {type === "project" && (
            <div
              style={{
                fontSize: 32,
                color: "#a1a1aa",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#3b82f6",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: 24,
                  color: "#ffffff",
                }}
              >
                Project
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Alejandro Repetto
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#71717a",
              display: "flex",
              gap: "16px",
            }}
          >
            <span>Systems Engineer</span>
            <span>•</span>
            <span>AI/ML Developer</span>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
