import type { ReactNode } from "react";

export const metadata = {
  title: "Manuscript Translator",
  description: "Translate historical manuscripts while preserving original layout.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "2rem",
          background: "#faf6ec",
          color: "#2b1d0e",
        }}
      >
        {children}
      </body>
    </html>
  );
}
