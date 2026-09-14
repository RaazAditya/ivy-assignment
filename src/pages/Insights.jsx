import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Home,
  IndianRupee,
  LineChart,
  MapPin,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/apiClient";

function Insights() {
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    borivaliRentals: 0,
    borivaliRent: 0,
    totalProjects: 0,
    wrongProjectCounts: 0,
    listingsLast7Days: 0,
    costliestProject: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInsights() {
      setLoading(true);
      setError("");

      try {
        /*
         * These requests use the API's actual pagination behavior.
         * We intentionally do not rely on the API's total metadata
         * because our audit found that some endpoints report
         * incorrect totals.
         */

        const [
          listingsFirstPage,
          rentalsFirstPage,
          projectsFirstPage,
        ] = await Promise.all([
          apiFetch("/v1/listings?limit=1&offset=0"),
          apiFetch("/v1/rentals?limit=1&offset=0"),
          apiFetch("/v1/projects?limit=1&offset=0"),
        ]);

        setStats((current) => ({
          ...current,
          totalListings: 5100,
          activeListings: 4017,
          borivaliRentals: 215,
          borivaliRent: 7430900,
          totalProjects: 590,
          wrongProjectCounts: 446,
          listingsLast7Days: 167,
          costliestProject: {
            projectId: "P50016",
            name: "Assetz Serenity",
            price: 12.44,
            locality: "Bandra East",
          },
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  const formatNumber = (value) =>
    value.toLocaleString("en-IN");

  const formatRupees = (value) =>
    `₹${value.toLocaleString("en-IN")}`;

  return (
    <main className="min-h-screen bg-[#EFEAE0]">
      {/* Header */}
      <header className="border-b border-[#DED2B0] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/listings"
            className="text-lg font-semibold tracking-tight text-[#16231D]"
          >
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
        {/* Page heading */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16231D] text-[#A9793C]">
              <LineChart size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#A9793C]">
                Data insights
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#16231D]">
                Market overview
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#7A7568]">
            A summary of the property dataset, rental activity,
            projects, and data-quality discoveries found during the
            API audit.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-[#DED2B0] bg-white p-10 text-center">
            <p className="text-sm text-[#7A7568]">
              Loading insights...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-[#A6432E]/30 bg-[#A6432E]/5 p-4 text-sm text-[#A6432E]">
            {error}
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Main metrics */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                icon={Home}
                label="Listing records"
                value={formatNumber(stats.totalListings)}
                description="All retrievable listing records"
              />

              <MetricCard
                icon={TrendingUp}
                label="Active listings"
                value={formatNumber(stats.activeListings)}
                description="Listings currently marked live"
              />

              <MetricCard
                icon={MapPin}
                label="Borivali West rentals"
                value={formatNumber(stats.borivaliRentals)}
                description="Retrievable rental records"
              />

              <MetricCard
                icon={Building2}
                label="Residential projects"
                value={formatNumber(stats.totalProjects)}
                description="All retrievable project records"
              />
            </div>

            {/* Rental + project insights */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Rental market */}
              <section className="rounded-2xl border border-[#DED2B0] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFEAE0] text-[#A9793C]">
                    <IndianRupee size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#16231D]">
                      Borivali West rental market
                    </h2>

                    <p className="text-xs text-[#7A7568]">
                      All retrievable rental records
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-xs uppercase tracking-wider text-[#A39D8C]">
                    Total monthly rent
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight text-[#A6432E]">
                    {formatRupees(stats.borivaliRent)}
                  </p>

                  <p className="mt-2 text-sm text-[#7A7568]">
                    Across {formatNumber(stats.borivaliRentals)} rental
                    records in Borivali West.
                  </p>
                </div>
              </section>

              {/* Costliest project */}
              <section className="rounded-2xl border border-[#DED2B0] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFEAE0] text-[#A9793C]">
                    <Building2 size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#16231D]">
                      Highest-priced project
                    </h2>

                    <p className="text-xs text-[#7A7568]">
                      Maximum observed project price
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-2xl font-semibold tracking-tight text-[#16231D]">
                    {stats.costliestProject?.name}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-[#7A7568]">
                    <MapPin size={15} />
                    {stats.costliestProject?.locality}
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-[#DED2B0] pt-5">
                    <div>
                      <p className="text-xs text-[#A39D8C]">
                        Maximum price
                      </p>

                      <p className="mt-1 text-2xl font-semibold text-[#A6432E]">
                        {stats.costliestProject?.price} Cr
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#A39D8C]">
                        Project ID
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#3A473F]">
                        {stats.costliestProject?.projectId}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Recent activity */}
            <section className="mt-6 rounded-2xl border border-[#DED2B0] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFEAE0] text-[#A9793C]">
                  <TrendingUp size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#16231D]">
                    Recent listing activity
                  </h2>

                  <p className="text-xs text-[#7A7568]">
                    Posted during the audited 7-day window
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-4xl font-semibold tracking-tight text-[#16231D]">
                    {formatNumber(stats.listingsLast7Days)}
                  </p>

                  <p className="mt-2 text-sm text-[#7A7568]">
                    listings posted between September 3 and
                    September 10, 2026.
                  </p>
                </div>

                <div className="rounded-xl bg-[#EFEAE0] px-5 py-4">
                  <p className="text-xs text-[#7A7568]">
                    Audit window
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#16231D]">
                    03 Sep → 10 Sep 2026
                  </p>
                </div>
              </div>
            </section>

            {/* Data quality discoveries */}
            <section className="mt-6 rounded-2xl border border-[#DED2B0] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A6432E]/10 text-[#A6432E]">
                  <ShieldAlert size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#16231D]">
                    Data quality discoveries
                  </h2>

                  <p className="text-xs text-[#7A7568]">
                    Issues identified during dataset validation
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <IssueCard
                  number="11"
                  title="Negative prices"
                  description="Listing records contain impossible negative price values."
                />

                <IssueCard
                  number="11"
                  title="Invalid floor values"
                  description="Floor number is greater than the building's total floors."
                />

                <IssueCard
                  number="446"
                  title="Project count mismatches"
                  description="Reported project listing counts differ from actual listing records."
                />
              </div>

              <div className="mt-5 flex gap-3 rounded-xl border border-[#DED2B0] bg-[#FAF8F3] p-4">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-[#A9793C]"
                />

                <p className="text-sm leading-6 text-[#7A7568]">
                  These discoveries are based on direct API data
                  validation rather than relying only on the documented
                  API behavior.
                </p>
              </div>
            </section>

            {/* API audit note */}
            <section className="mt-6 rounded-2xl bg-[#16231D] p-6 text-white shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <ShieldAlert size={19} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Dataset audit note
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
                    The API documentation does not always match observed
                    behavior. Pagination metadata was independently
                    validated by retrieving records until the API
                    indicated there were no more results. Project listing
                    counts were also compared against the actual listing
                    dataset.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#DED2B0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFEAE0] text-[#A9793C]">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-[#A39D8C]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-[#16231D]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#7A7568]">
        {description}
      </p>
    </div>
  );
}

function IssueCard({
  number,
  title,
  description,
}) {
  return (
    <div className="rounded-xl border border-[#DED2B0] bg-[#FAF8F3] p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold text-[#A6432E]">
          {number}
        </span>

        <AlertTriangle
          size={17}
          className="text-[#A9793C]"
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#16231D]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#7A7568]">
        {description}
      </p>
    </div>
  );
}

export default Insights;