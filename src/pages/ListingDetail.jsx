import { useEffect, useState } from "react";
import { ArrowLeft, Bath, BedDouble, Heart, Home, MapPin, Ruler } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { addFavourite, apiFetch, getFavourites, removeFavourite } from "../api/apiClient";

function ListingDetail() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadListing() {
      setLoading(true);
      setError("");

      try {
        const data = await apiFetch(`/v1/listings/${id}`);
        setListing(data);

        const savedData = await getFavourites();
        const saved = savedData.results?.some(
          (item) => item.listing_id === id || item.id === id
        );
        setIsSaved(Boolean(saved));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [id]);

  async function handleSaveToggle() {
    setSaving(true);
    setError("");

    try {
      if (isSaved) {
        await removeFavourite(id);
        setIsSaved(false);
      } else {
        await addFavourite(id);
        setIsSaved(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#EFEAE0]">
        <p className="text-sm text-[#7A7568]">Loading property...</p>
      </main>
    );
  }

  if (error && !listing) {
    return (
      <main className="min-h-screen bg-[#EFEAE0] px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#A6432E]/30 bg-[#A6432E]/5 p-6">
          <p className="text-sm font-medium text-[#A6432E]">{error}</p>
          <Link
            to="/listings"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#3A473F] hover:text-[#16231D]"
          >
            <ArrowLeft size={16} />
            Back to listings
          </Link>
        </div>
      </main>
    );
  }

  if (!listing) return null;

  return (
    <main className="min-h-screen bg-[#EFEAE0]">
      {/* Header */}
      <header className="border-b border-[#DED2B0] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/listings" className="text-lg font-semibold tracking-tight text-[#16231D]">
            Ivy Homes
          </Link>
          <span className="text-xs text-[#A9793C]">Mumbai</span>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <Link
          to="/listings"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#7A7568] transition hover:text-[#16231D]"
        >
          <ArrowLeft size={17} />
          Back to listings
        </Link>

        {/* Hero */}
        <div className="overflow-hidden rounded-3xl border border-[#DED2B0] bg-white shadow-sm">
          <div className="relative flex min-h-72 items-end bg-[#E4DCC8] p-8 sm:min-h-96">
            <div className="relative">
              <p className="text-sm font-medium uppercase tracking-wider text-[#7A7568]">
                {listing.property_type}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#16231D] sm:text-4xl">
                {listing.apartment_name}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-sm text-[#3A473F]">
                <MapPin size={16} />
                {listing.locality}
              </div>
            </div>

            {listing.is_verified && (
              <span className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-medium text-[#16231D] shadow-sm">
                Verified listing
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            {/* Price + Save */}
            <div className="flex flex-col justify-between gap-5 border-b border-[#DED2B0] pb-7 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm text-[#A39D8C]">Asking price</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-[#A6432E]">
                  ₹{listing.price?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <div className="text-sm text-[#7A7568]">
                  Listing ID: <span className="font-medium text-[#16231D]">{listing.listing_id}</span>
                </div>

                <button
                  type="button"
                  onClick={handleSaveToggle}
                  disabled={saving}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition ${
                    isSaved
                      ? "bg-[#16231D] text-white hover:bg-[#A9793C]"
                      : "border border-[#DED2B0] bg-white text-[#3A473F] hover:bg-[#EFEAE0]"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
                  {saving ? "Saving..." : isSaved ? "Saved" : "Save listing"}
                </button>
              </div>
            </div>

            {/* Save error */}
            {error && (
              <div className="mt-5 rounded-xl border border-[#A6432E]/30 bg-[#A6432E]/5 p-4 text-sm text-[#A6432E]">
                {error}
              </div>
            )}

            {/* Property stats */}
            <div className="grid gap-4 py-7 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-[#EFEAE0] p-4">
                <BedDouble size={20} className="text-[#A9793C]" />
                <p className="mt-4 text-xs text-[#A39D8C]">Bedrooms</p>
                <p className="mt-1 font-semibold text-[#16231D]">{listing.bedroom} BHK</p>
              </div>
              <div className="rounded-2xl bg-[#EFEAE0] p-4">
                <Bath size={20} className="text-[#A9793C]" />
                <p className="mt-4 text-xs text-[#A39D8C]">Bathrooms</p>
                <p className="mt-1 font-semibold text-[#16231D]">{listing.bathroom}</p>
              </div>
              <div className="rounded-2xl bg-[#EFEAE0] p-4">
                <Ruler size={20} className="text-[#A9793C]" />
                <p className="mt-4 text-xs text-[#A39D8C]">Carpet area</p>
                <p className="mt-1 font-semibold text-[#16231D]">
                  {listing.carpet_area?.toLocaleString("en-IN")} sqft
                </p>
              </div>
              <div className="rounded-2xl bg-[#EFEAE0] p-4">
                <Home size={20} className="text-[#A9793C]" />
                <p className="mt-4 text-xs text-[#A39D8C]">Furnishing</p>
                <p className="mt-1 font-semibold capitalize text-[#16231D]">
                  {listing.furnishing || "—"}
                </p>
              </div>
            </div>

            {/* Additional information */}
            <div className="border-t border-[#DED2B0] pt-7">
              <h2 className="text-lg font-semibold text-[#16231D]">Property information</h2>

              <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#A39D8C]">Floor</p>
                  <p className="mt-1 text-sm font-medium text-[#3A473F]">{listing.floor ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A39D8C]">Total floors</p>
                  <p className="mt-1 text-sm font-medium text-[#3A473F]">{listing.total_floors ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A39D8C]">Balcony</p>
                  <p className="mt-1 text-sm font-medium text-[#3A473F]">{listing.balcony ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A39D8C]">Parking</p>
                  <p className="mt-1 text-sm font-medium text-[#3A473F]">
                    {listing.covered_parking ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#A39D8C]">Facing</p>
                  <p className="mt-1 text-sm font-medium capitalize text-[#3A473F]">
                    {listing.facing_direction || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#A39D8C]">Posted by</p>
                  <p className="mt-1 text-sm font-medium text-[#3A473F]">
                    {listing.posted_by_name || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="mt-8 border-t border-[#DED2B0] pt-7">
                <h2 className="text-lg font-semibold text-[#16231D]">About this property</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#7A7568]">
                  {listing.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ListingDetail;
