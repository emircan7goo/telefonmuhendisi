"use client";

export function BackgroundBlobs() {
  return (
    <>
      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 20px) scale(1.08); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 40px) scale(1.1); }
          66% { transform: translate(30px, -20px) scale(0.9); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
        .blob1 { animation: blob1 20s ease-in-out infinite; }
        .blob2 { animation: blob2 25s ease-in-out infinite; }
        .blob3 { animation: blob3 30s ease-in-out infinite; }
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div
          className="blob1 absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full opacity-40 bg-indigo-200"
          style={{ filter: "blur(80px)", willChange: "transform" }}
        />
        <div
          className="blob2 absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full opacity-25 bg-pink-200"
          style={{ filter: "blur(100px)", willChange: "transform" }}
        />
        <div
          className="blob3 absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vw] rounded-full opacity-15 bg-emerald-200"
          style={{ filter: "blur(100px)", willChange: "transform" }}
        />
      </div>
    </>
  );
}
