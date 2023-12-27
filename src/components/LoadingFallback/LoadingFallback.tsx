export default function LoadingFallback(props: { className?: string }) {
  return (
    <div className={`loading-fallback ${props?.className}`}>
      <div className="fallback-container">
        <h3>Loading</h3>
        <p>Please wait</p>
      </div>
    </div>
  )
}
