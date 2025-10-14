export default function Spinner({ size = 24, color = "text-blue-500" }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
        style={{ width: size, height: size }}
      />
    </div>
  )
}
