"use client";

export default function BrokerageLogo() {
  return (
    <img
      src="/brokerage-logo.png"
      alt="Brokerage"
      className="h-10 w-auto object-contain object-left opacity-60"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
