export default function Logo({ className = 'h-9 w-9' }) {
  return (
    <img src="/images/logo/logo.webp" alt="Logo" className={`${className} object-contain rounded-full`} />
  );
}
