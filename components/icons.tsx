export function GoogleMeetIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 7.5V16.5L18.5 20.5V3.5L13 7.5Z" fill="#00832D"/>
      <path d="M3.5 6.5C3.5 5.39543 4.39543 4.5 5.5 4.5H13V19.5H5.5C4.39543 19.5 3.5 18.6046 3.5 17.5V6.5Z" fill="#00AC47"/>
      <path d="M13 4.5H17.5C18.6046 4.5 19.5 5.39543 19.5 6.5V12H13V4.5Z" fill="#2684FC"/>
      <path d="M19.5 12V17.5C19.5 18.6046 18.6046 19.5 17.5 19.5H13V12H19.5Z" fill="#0066DA"/>
      <path d="M18.5 8.5L21.5 6.2C21.8 5.9 22.3 6.1 22.3 6.5V17.5C22.3 17.9 21.8 18.1 21.5 17.8L18.5 15.5V8.5Z" fill="#FFBA00"/>
    </svg>
  )
}

export function ZoomIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#2D8CFF"/>
      <path d="M5.5 9C5.5 8.17157 6.17157 7.5 7 7.5H13C13.8284 7.5 14.5 8.17157 14.5 9V15C14.5 15.8284 13.8284 16.5 13 16.5H7C6.17157 16.5 5.5 15.8284 5.5 15V9Z" fill="white"/>
      <path d="M15.5 10.3L18.6 7.9C18.9 7.7 19.5 7.9 19.5 8.4V15.6C19.5 16.1 18.9 16.3 18.6 16.1L15.5 13.7V10.3Z" fill="white"/>
    </svg>
  )
}
