export default function WarningFlag({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-xs bg-neon-orange/10 border border-neon-orange/30 text-neon-orange rounded px-3 py-2">
      <span className="text-base">!</span>
      <span>{message}</span>
    </div>
  );
}
