'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Car, Heart, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import MasterPage from '@/components/master/MasterPage';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { APP_ROUTES } from '@/constants/routes';
import vehicleService from '@/services/vehicleService';
import categoryService from '@/services/categoryService';
import favouriteService from '@/services/favouriteService';
import { formatCurrency } from '@/lib/format';
import { getErrorMessage } from '@/lib/apiResponse';
import notify from '@/lib/toast';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const SORT_OPTIONS = [
  { value: 'rentPerDay:asc', label: 'Price: Low to High' },
  { value: 'rentPerDay:desc', label: 'Price: High to Low' },
  { value: 'year:desc', label: 'Newest First' },
  { value: 'brand:asc', label: 'Brand A–Z' },
];

const STATUS_BADGE = {
  Available: 'bg-emerald-100 text-emerald-700',
  Rented: 'bg-rose-100 text-rose-700',
  Maintenance: 'bg-amber-100 text-amber-700',
};

function VehicleCard({ vehicle, isFav, onToggleFav }) {
  const image = vehicle.images?.find((i) => i.isPrimary)?.imageUrl || vehicle.images?.[0]?.imageUrl;

  return (
    <div className="surface-card group overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5 duration-200">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {image ? (
          <img src={image} alt={`${vehicle.brand} ${vehicle.model}`} className="h-full w-full object-cover transition group-hover:scale-105 duration-300" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Car size={48} className="text-muted/30" />
          </div>
        )}
        {/* Favourite button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onToggleFav(vehicle.id); }}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition
            ${isFav ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-400 hover:text-rose-500'}`}
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart size={15} className={isFav ? 'fill-white' : ''} />
        </button>
        {/* Status */}
        <span className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[vehicle.status] || 'bg-slate-100 text-slate-600'}`}>
          {vehicle.status}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold text-primary truncate">{vehicle.brand} {vehicle.model}</p>
            <p className="text-xs text-muted">{vehicle.year} · {vehicle.fuelType} · {vehicle.transmission}</p>
          </div>
          <div className="shrink-0 flex items-center gap-1 text-amber-500">
            <Star size={12} className="fill-amber-500" />
            <span className="text-xs font-semibold">{Number(vehicle.averageRating || 0).toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-accent tabular-nums">{formatCurrency(vehicle.rentPerDay)}</span>
            <span className="text-xs text-muted"> / day</span>
          </div>
          <Link
            href={vehicle.status === 'Available' ? APP_ROUTES.CUSTOMER.VEHICLE_DETAIL(vehicle.id) : '#'}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition
              ${vehicle.status === 'Available'
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'}`}
          >
            {vehicle.status === 'Available' ? 'Book Now' : 'Unavailable'}
          </Link>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted border-t border-border pt-2">
          <span>🪑 {vehicle.seatCapacity} seats</span>
          <span>⚙️ {vehicle.transmission}</span>
          <span>📍 {vehicle.engineCapacity || '—'} cc</span>
        </div>
      </div>
    </div>
  );
}

export default function CustomerVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [favIds, setFavIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    fuelType: '',
    transmission: '',
    status: 'Available',
    sort: 'rentPerDay:asc',
  });

  // Load favourites from localStorage
  useEffect(() => {
    setFavIds(favouriteService.getIds());
  }, []);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const [sortBy, order] = filters.sort.split(':');
      const params = { page, limit: pagination.limit, sortBy, order };
      if (filters.search) params.brand = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.fuelType) params.fuelType = filters.fuelType;
      if (filters.transmission) params.transmission = filters.transmission;
      if (filters.status) params.status = filters.status;

      const res = await vehicleService.getVehicles(params);
      setVehicles(res.data?.vehicles || []);
      setPagination((p) => ({ ...p, ...(res.data?.pagination || {}), page }));
    } catch (err) {
      notify.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  useEffect(() => {
    categoryService.getAll().then((r) => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  useEffect(() => { load(1); }, [filters]);

  function handleToggleFav(vehicleId) {
    const isNowFav = favouriteService.toggle(vehicleId);
    setFavIds(favouriteService.getIds());
    notify.success(isNowFav ? 'Added to favourites ❤️' : 'Removed from favourites');
  }

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <MasterPage
      title="Browse Cars"
      description={`${pagination.total} vehicle${pagination.total !== 1 ? 's' : ''} available`}
      breadcrumbs={[{ label: 'Customer', href: APP_ROUTES.CUSTOMER.DASHBOARD }, { label: 'Browse Cars' }]}
    >
      {/* Search + Filter toggle bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by brand…"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="input-field w-full pl-9 text-sm"
          />
        </div>

        {/* Quick filters */}
        <select value={filters.fuelType} onChange={(e) => setFilter('fuelType', e.target.value)} className="input-field text-sm w-auto">
          <option value="">All Fuel Types</option>
          {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>

        <select value={filters.transmission} onChange={(e) => setFilter('transmission', e.target.value)} className="input-field text-sm w-auto">
          <option value="">All Transmissions</option>
          {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className="input-field text-sm w-auto">
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Rented">Rented</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)} className="input-field text-sm w-auto">
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {/* Category filter */}
        <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)} className="input-field text-sm w-auto">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Clear filters */}
        {(filters.search || filters.fuelType || filters.transmission || filters.category) && (
          <button
            type="button"
            onClick={() => setFilters({ search: '', category: '', fuelType: '', transmission: '', status: 'Available', sort: 'rentPerDay:asc' })}
            className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs text-muted hover:text-danger transition"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonLoader key={i} height="22rem" rounded="2xl" />)}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="surface-card py-16 text-center">
          <Car size={48} className="mx-auto mb-4 text-muted/30" />
          <p className="text-base font-semibold text-muted">No vehicles found</p>
          <p className="mt-1 text-sm text-muted/60">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              isFav={favIds.includes(v.id)}
              onToggleFav={handleToggleFav}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => load(p)}
              className={`h-9 w-9 rounded-xl text-sm font-semibold transition
                ${p === pagination.page
                  ? 'bg-accent text-white'
                  : 'border border-border text-muted hover:border-accent hover:text-accent'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </MasterPage>
  );
}
