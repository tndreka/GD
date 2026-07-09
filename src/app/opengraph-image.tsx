import { ImageResponse } from "next/og";

export const alt = "Graciano Dhima — From Pain To Performance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* gold top border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 10,
            background: "#ffc800",
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 14,
            display: "flex",
          }}
        >
          <span style={{ color: "#ffc800" }}>G</span>RACIANO&nbsp;
          <span style={{ color: "#ffc800" }}>D</span>HIMA
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: "#ffc800",
            letterSpacing: 10,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          From Pain To Performance
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            color: "#9a9a9a",
            letterSpacing: 4,
            display: "flex",
          }}
        >
          ONLINE COACHING · TRX · POSTURE · STRENGTH
        </div>
        {/* gold bottom border */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 10,
            background: "#ffc800",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
