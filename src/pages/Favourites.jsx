import { useEffect, useState } from "react";
import { ArrowLeft, Heart, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getFavourites, removeFavourite } from "../api/apiClient";

function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    async function loadFavourites() {
      setLoading(true);
      setError("");

      try {
        const data = await getFavourites();
        setFavourites(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFavourites();
  }, []);

  async function handleRemove(event, listingId) {
    event.preventDefault();
    event.stopPropagation();

    setError("");
    setRemovingId(listingId);

    // Optimistic: drop it from the list immediately, put it back if the
    // request actually fails, rather than making the user wait on a spinner
    // for something that almost always succeeds.
    const previous = favourites;
    setFavourites((current) => current.filter((item) => item.listing_id !== listingId));

    try {
      await removeFavourite(listingId);
    } catch (err) {
      setFavourites(previous);
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#EFEAE0]">
      <header className="border-b border-[#DED2B0] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/listings" className="text-lg font-semibold tracking-tight text-[#16231D]">
            Ivy Homes
          </Link>

          <Link
            to="/listings"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#3A473F] transition hover:bg-[#EFEAE0] hover:text-[#16231D]"
          >
            <ArrowLeft size={16} />
            Browse homes
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16231D] text-[#A9793C]">
              <Heart size={19} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#16231D]">Saved homes</h1>
              <p className="text-sm text-[#7A7568]">Properties you've saved for later.</p>
            </div>
          </div>
        </div>

        {loading && <p className="text-sm text-[#7A7568]">Loading saved homes...</p>}

        {error && (
          <div className="rounded-xl border border-[#A6432E]/30 bg-[#A6432E]/5 p-4 text-sm text-[#A6432E]">
            {error}
          </div>
        )}

        {!loading && favourites.length === 0 && (
          <div className="rounded-2xl border border-[#DED2B0] bg-white p-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEAE0]">
              <Heart size={21} className="text-[#A39D8C]" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-[#16231D]">No saved homes yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7A7568]">
              Save properties you're interested in and they'll appear here.
            </p>
            <Link
              to="/listings"
              className="mt-6 inline-flex rounded-xl bg-[#16231D] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#A9793C]"
            >
              Explore homes
            </Link>
          </div>
        )}

        {!loading && favourites.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {favourites.map((listing) => {
              const isRemoving = removingId === listing.listing_id;

              return (
                <Link
                  key={listing.listing_id}
                  to={`/listings/${listing.listing_id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-[#DED2B0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-[#A9793C]"
                >
                  <div className="relative flex h-40 items-end bg-[#E4DCC8] p-5">
                    <div className="relative">
                      <p className="text-xs font-medium uppercase tracking-wider text-[#7A7568]">
                        {listing.property_type}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#16231D]">
                        {listing.apartment_name}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => handleRemove(event, listing.listing_id)}
                      disabled={isRemoving}
                      aria-label="Remove from saved"
                      title="Remove from saved"
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7A7568] shadow-sm transition hover:text-[#A6432E] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-[#7A7568]">{listing.locality}</p>

                    <div className="mt-5 flex items-center justify-between border-t border-[#DED2B0] pt-4">
                      <p className="text-lg font-semibold text-[#A6432E]">
                        ₹{listing.price?.toLocaleString("en-IN")}
                      </p>
                      <span className="text-sm text-[#3A473F]">{listing.bedroom} BHK</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Favourites;
