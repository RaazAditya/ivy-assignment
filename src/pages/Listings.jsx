import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/apiClient";

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [locality, setLocality] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [furnishing, setFurnishing] = useState("");

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const LIMIT = 20;

  const localities = [
    ...new Set(listings.map((listing) => listing.locality).filter(Boolean)),
  ].sort();

  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("limit", String(LIMIT));
        params.set("offset", String(offset));
        if (locality) params.set("locality", locality);
        if (bedroom) params.set("bhk", bedroom);
        if (minPrice) params.set("min_price", minPrice);
        if (maxPrice) params.set("max_price", maxPrice);
        if (furnishing) params.set("furnishing", furnishing);

        const data = await apiFetch(`/v1/listings?${params.toString()}`);

        setListings(data.results || []);
        setHasMore(Boolean(data.has_more));
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [locality, bedroom, minPrice, maxPrice, furnishing, offset]);

  useEffect(() => {
    setOffset(0);
  }, [locality, bedroom, minPrice, maxPrice, furnishing]);

  function handlePrevious() {
    setOffset((currentOffset) => Math.max(0, currentOffset - LIMIT));
  }

  function handleNext() {
    if (hasMore) setOffset((currentOffset) => currentOffset + LIMIT);
  }

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(total / LIMIT);

  const selectClass =
    "h-11 w-full rounded-xl border border-[#DED2B0] bg-white px-3 text-sm text-[#16231D] outline-none transition focus:border-[#A9793C] focus:ring-4 focus:ring-[#A9793C]/10";
  const labelClass = "mb-2 block text-sm font-medium text-[#3A473F]";

  return (
    <main className="min-h-screen bg-[#EFEAE0]">
      <header className="border-b border-[#DED2B0] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#16231D]">Ivy Homes</h1>
            <p className="text-xs text-[#A9793C]">Mumbai</p>
          </div>

          {/* <button className="rounded-lg px-3 py-2 text-sm font-medium text-[#3A473F] transition hover:bg-[#EFEAE0] hover:text-[#16231D]">
            Logout
          </button> */}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#A9793C]">Property marketplace</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-[#16231D]">Explore homes</h2>
          <p className="mt-2 text-sm text-[#7A7568]">Browse properties available in Mumbai.</p>
        </div>

        <div className="mb-8 rounded-2xl border border-[#DED2B0] bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div>
              <label htmlFor="locality" className={labelClass}>Locality</label>
              <select id="locality" value={locality} onChange={(e) => setLocality(e.target.value)} className={selectClass}>
                <option value="">All localities</option>
                {localities.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bedroom" className={labelClass}>Bedrooms</label>
              <select id="bedroom" value={bedroom} onChange={(e) => setBedroom(e.target.value)} className={selectClass}>
                <option value="">Any bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK</option>
              </select>
            </div>

            <div>
              <label htmlFor="minPrice" className={labelClass}>Minimum price</label>
              <input
                id="minPrice"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min price"
                className={selectClass + " placeholder:text-[#A39D8C]"}
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className={labelClass}>Maximum price</label>
              <input
                id="maxPrice"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price"
                className={selectClass + " placeholder:text-[#A39D8C]"}
              />
            </div>

            <div>
              <label htmlFor="furnishing" className={labelClass}>Furnishing</label>
              <select id="furnishing" value={furnishing} onChange={(e) => setFurnishing(e.target.value)} className={selectClass}>
                <option value="">Any furnishing</option>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi_furnished">Semi Furnished</option>
                <option value="fully_furnished">Fully Furnished</option>
              </select>
            </div>
          </div>
        </div>

        {loading && <p className="text-sm text-[#7A7568]">Loading listings...</p>}

        {error && (
          <div className="rounded-xl bg-[#A6432E]/5 border border-[#A6432E]/30 p-4 text-sm text-[#A6432E]">{error}</div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.listing_id}
                to={`/listings/${listing.listing_id}`}
                className="group block overflow-hidden rounded-2xl border border-[#DED2B0] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#A9793C]"
              >
                <div className="relative flex h-44 items-end overflow-hidden bg-[#E4DCC8] p-5">
                  <div className="relative">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A7568]">
                      {listing.property_type}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#16231D]">
                      {listing.apartment_name}
                    </h3>
                  </div>

                  {listing.is_verified && (
                    <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#16231D] shadow-sm">
                      Verified
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-sm text-[#7A7568]">{listing.locality}</p>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-y border-[#DED2B0] py-4">
                    <div>
                      <p className="text-xs text-[#A39D8C]">Bedrooms</p>
                      <p className="mt-1 text-sm font-semibold text-[#16231D]">{listing.bedroom} BHK</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#A39D8C]">Bathrooms</p>
                      <p className="mt-1 text-sm font-semibold text-[#16231D]">{listing.bathroom}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#A39D8C]">Area</p>
                      <p className="mt-1 text-sm font-semibold text-[#16231D]">
                        {listing.carpet_area?.toLocaleString("en-IN")} sqft
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#A39D8C]">Price</p>
                      <p className="mt-1 text-lg font-semibold tracking-tight text-[#A6432E]">
                        ₹{listing.price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#A39D8C]">Furnishing</p>
                      <p className="mt-1 text-sm font-medium capitalize text-[#3A473F]">
                        {listing.furnishing || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="rounded-2xl border border-[#DED2B0] bg-white p-12 text-center">
            <p className="text-sm font-medium text-[#16231D]">No listings found</p>
            <p className="mt-1 text-sm text-[#A39D8C]">Try adjusting your filters.</p>
          </div>
        )}

        {!loading && !error && total > 0 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#DED2B0] bg-white p-5 sm:flex-row">
            <div className="text-sm text-[#7A7568]">
              Page <span className="font-medium text-[#16231D]">{currentPage}</span> of{" "}
              <span className="font-medium text-[#16231D]">{totalPages}</span>
              <span className="mx-2 text-[#DED2B0]">|</span>
              <span>{total.toLocaleString("en-IN")} total listings</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                disabled={offset === 0 || loading}
                className="rounded-xl border border-[#DED2B0] px-4 py-2 text-sm font-medium text-[#3A473F] transition hover:bg-[#EFEAE0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!hasMore || loading}
                className="rounded-xl border border-[#DED2B0] px-4 py-2 text-sm font-medium text-[#3A473F] transition hover:bg-[#EFEAE0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Listings;