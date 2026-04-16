import Dropzone from "@/components/Dropzone";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1>Manuscript Translator</h1>
      <p>
        Drop a scanned manuscript page (PDF or image) and we will translate the text to
        English while keeping the original artwork intact.
      </p>
      <Dropzone />
      <p style={{ marginTop: "2rem", fontSize: 14, opacity: 0.7 }}>
        Target language is currently fixed to English. A language picker is on the roadmap.
      </p>
    </main>
  );
}
