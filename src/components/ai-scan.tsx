import { motion } from "framer-motion";
import { Sparkles, Scan, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Result = "Match Found" | "Possible Match" | "No Match";

export function AIScanAnimation({ onComplete, image }: { onComplete?: (r: { result: Result; confidence: number }) => void; image?: string }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState<{ result: Result; confidence: number } | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); return 100; }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !done) {
      const confidence = Math.floor(70 + Math.random() * 30);
      const result: Result = confidence > 85 ? "Match Found" : confidence > 70 ? "Possible Match" : "No Match";
      const r = { result, confidence };
      setDone(r);
      onComplete?.(r);
    }
  }, [progress, done, onComplete]);

  return (
    <div className="rounded-2xl glass p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-primary" />
        AI Face Recognition
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
        {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />}
        <div className="absolute inset-0 grid place-items-center">
          <Scan className="h-16 w-16 text-primary/60" strokeWidth={1.5} />
        </div>
        {!done && (
          <motion.div
            className="absolute inset-x-0 h-16 scan-line"
            animate={{ top: ["0%", "85%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-primary/30 rounded-xl" />
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">{done ? "Analysis complete" : "Analyzing biometric features…"}</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div className="h-full gradient-brand" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {done && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 flex items-center gap-3 ${
            done.result === "Match Found" ? "bg-success/10 text-[color:var(--color-success)]" :
            done.result === "Possible Match" ? "bg-warning/15 text-[color:var(--color-warning)]" :
            "bg-muted text-muted-foreground"
          }`}>
          {done.result === "Match Found" ? <CheckCircle2 className="h-6 w-6" /> :
            done.result === "Possible Match" ? <AlertCircle className="h-6 w-6" /> :
            <XCircle className="h-6 w-6" />}
          <div>
            <div className="font-semibold">{done.result}</div>
            <div className="text-xs opacity-90">Confidence: {done.confidence}%</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
