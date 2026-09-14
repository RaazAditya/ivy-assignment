import { useEffect, useState } from "react";
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/apiClient";

const LIMIT = 20;

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function loadRentals() {
      setLoading(true);
      setError("");

      try {
        const data = await apiFetch(`/v1/rentals?limit=${LIMIT}&offset=${offset}`);
        setRentals(data.results || []);
        setHasMore(Boolean(data.has_more));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRentals();
  }, [offset]);

  function handlePrevious() {
    setOffset((current) => Math.max(0, current - LIMIT));
  }

  function handleNext() {
    if (hasMore) setOffset((current) => current + LIMIT);
  }

  return (
    <main className="min-h-screen bg-[#EFEAE0]">
      <header className="border-b border-[#DED2B0] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/listings" className="text-lg font-semibold tracking-tight text-[#16231D]">
            Ivy Homes
          </Link>

          <Link to="/favourites" className="text-sm font-medium text-[#3A473F] hover:text-[#A9793C]">
            Saved
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/listings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#7A7568] hover:text-[#16231D]"
        >
          <ArrowLeft size={17} />
          Back to listings
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-[#A9793C]">Rentals</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#16231D]">Rental properties</h1>
          <p className="mt-2 text-sm text-[#7A7568]">Browse available rental properties.</p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-[#DED2B0] bg-white p-10 text-center">
            <p className="text-sm text-[#7A7568]">Loading rentals...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-[#A6432E]/30 bg-[#A6432E]/5 p-6">
            <p className="text-sm font-medium text-[#A6432E]">{error}</p>
          </div>
        )}

        {!loading && !error && rentals.length === 0 && (
          <div className="rounded-2xl border border-[#DED2B0] bg-white p-10 text-center">
            <p className="text-sm text-[#7A7568]">No rentals found.</p>
          </div>
        )}

        {!loading && !error && rentals.length > 0 && (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentals.map((rental) => (
                <article
                  key={rental.listing_id || rental.rental_id}
                  className="overflow-hidden rounded-2xl border border-[#DED2B0] bg-white shadow-sm"
                >
                  <div className="flex h-36 items-end bg-[#E4DCC8] p-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#7A7568]">
                        {rental.property_type || "Property"}
                      </p>
                      <h2 className="mt-1 line-clamp-1 text-lg font-semibold text-[#16231D]">
                        {rental.apartment_name || "Rental property"}
                      </h2>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-[#7A7568]">
                      <MapPin size={15} />
                      {rental.locality || "—"}
                    </div>

                    <p className="mt-4 text-2xl font-semibold text-[#A6432E]">
                      ₹{Number(rental.price || 0).toLocaleString("en-IN")}
                      <span className="text-sm font-normal text-[#A39D8C]"> / month</span>
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#DED2B0] pt-4">
                      <div>
                        <BedDouble size={16} className="text-[#A9793C]" />
                        <p className="mt-1 text-xs text-[#A39D8C]">Beds</p>
                        <p className="text-sm font-medium text-[#3A473F]">{rental.bedroom ?? "—"}</p>
                      </div>
                      <div>
                        <Bath size={16} className="text-[#A9793C]" />
                        <p className="mt-1 text-xs text-[#A39D8C]">Baths</p>
                        <p className="text-sm font-medium text-[#3A473F]">{rental.bathroom ?? "—"}</p>
                      </div>
                      <div>
                        <Ruler size={16} className="text-[#A9793C]" />
                        <p className="mt-1 text-xs text-[#A39D8C]">Area</p>
                        <p className="text-sm font-medium text-[#3A473F]">
                          {rental.carpet_area ? `${rental.carpet_area} sqft` : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#DED2B0] pt-6">
              <button
                onClick={handlePrevious}
                disabled={offset === 0 || loading}
                className="rounded-xl border border-[#DED2B0] bg-white px-4 py-2 text-sm font-medium text-[#3A473F] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-[#7A7568]">Page {Math.floor(offset / LIMIT) + 1}</span>

              <button
                onClick={handleNext}
                disabled={!hasMore || loading}
                className="rounded-xl bg-[#16231D] px-4 py-2 text-sm font-medium text-white hover:bg-[#A9793C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Rentals;