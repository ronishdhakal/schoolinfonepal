// pages/index.js
"use client";
import { useEffect, useState } from "react";
import EventCard from "@/components/event/EventCard";
import { fetchEvents } from "@/utils/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        // If paginated
        if (data && data.results) setEvents(data.results);
        else if (Array.isArray(data)) setEvents(data);
        else setEvents([]);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
        {loading ? (
          <div className="text-gray-500">Loading events…</div>
        ) : events.length === 0 ? (
          <div className="text-gray-400">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
