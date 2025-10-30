export function LoadingOverlay({ text }: { text: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-xs z-[100]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
}
