import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><p>That tool is not on this bench.</p><h1>Page not found.</h1><Link href="/#all-tools">See every working tool</Link></main>;
}
