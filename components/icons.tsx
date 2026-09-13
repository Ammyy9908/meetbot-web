export function GoogleMeetIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.5 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"/>
      <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"/>
      <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z"/>
      <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z"/>
      <path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"/>
      <path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"/>
    </svg>
  )
}

export function ZoomIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5.5" fill="#0B5CFF"/>
      <path fill="#FFFFFF" d="M4.5 8.5C4.5 7.4 5.4 6.5 6.5 6.5H13C14.1 6.5 15 7.4 15 8.5V15.5C15 16.6 14.1 17.5 13 17.5H6.5C5.4 17.5 4.5 16.6 4.5 15.5V8.5Z"/>
      <path fill="#FFFFFF" d="M16 10.38L19.45 7.91C19.78 7.67 20.25 7.91 20.25 8.32V15.68C20.25 16.09 19.78 16.33 19.45 16.09L16 13.62V10.38Z"/>
    </svg>
  )
}
