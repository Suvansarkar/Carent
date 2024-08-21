"use client"
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold">
            Carent: Drive Your Way, Anytime
          </h1>
          <p className="py-6">
            Unlock the road with Carent, where your journey becomes our priority. Experience the freedom of choice with our diverse fleet, ranging from sleek city compacts to robust SUVs for off-road adventures. Our user-friendly platform ensures effortless bookings, while our competitive rates keep your wallet happy.
          </p>
          <div className="flex gap-6 justify-center items-center">
            <button className="btn btn-primary" onClick={() => { router.push("/signup") }}>Get Started</button>
            <button className="btn btn-outline" onClick={() => { router.push("/login") }}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
