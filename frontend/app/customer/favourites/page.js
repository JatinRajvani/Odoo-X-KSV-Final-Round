'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Car, Heart, Star, Trash2 } from 'lucide-react';
import MasterPage from '@/components/master/MasterPage';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { APP_ROUTES } from '@/constants/routes';
import vehicleService from '@/services/vehicleService';
import favouriteService from '@/services/favouriteService';
import { formatCurrency } from '@/lib/format';
import notify from '@/lib/toast';

export default function CustomerFavouritesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const ids = favouriteService.getIds();
    if (ids.length === 0) { setVehicles([]); setLoading(false); return; }

    try {
      // Fetch each vehicle by id in parallel
      const results = await Promise.allSettled(ids.map((id) => vehicleService.getVehicleById(id)));
      setVehicles(
        results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value.data)
          .filter(Boolean)
      );
    } catch {
      notify.error('Failed to load favourites');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleRemove(vehicleId) {
    favouriteService.remove(vehicleId);
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    notify.success('Removed from favourites');
  }

  function handleClearAll() {
    favouriteService.clear();
    setVehicles([]);
    notify.success('All favourites cleared');
  }

  return (
    <MasterPage
      title="Favourites"
      description="Your saved vehicles"
      breadcrumbs={[
        { label: 'Customer', href: APP_ROUTES.CUSTOMER.DASHBOARD },
        { label: 'Favourites' },
      ]}
      actions={
        vehicles.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-danger hover:bg-rose-50 transition"
          >
            <Trash2 size={13} /> Clear all
          </button>
        ) : null
      }
    >
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <SkeletonLoader key={i} height="22rem" rounded="2xl" />)}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="surface-card py-20 text-center">
          <Heart size={52} className="mx-auto mb-4 text-rose-200" />
          <p className="text-base font-semibold text-muted">No favourites yet</p>
          <p className="mt-1 text-sm text-muted/60">Tap the ♥ on any vehicle to save it here.</p>
          <Link
            href={APP_ROUTES.CUSTOMER.VEHICLES}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
          >
            <Car size={15} /> Browse Cars
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle) => {
            const image = vehicle.images?.find((i) => i.isPrimary)?.imageUrl || vehicle.images?.[0]?.imageUrl;
            return (
              <div key={vehicle.id} className="surface-card group overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5 duration-200">
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {image ? (
                    <img src={image} alt={`${vehicle.brand} ${vehicle.model}`} className="h-full w-full object-cover transition group-hover:scale-105 duration-300" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Car size={48} className="text-muted/30" />
                    </div>
                  )}
                  {/* Status */}
                  <span className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold
                    ${vehicle.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {vehicle.status}
                  </span>
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(vehicle.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition hover:bg-rose-600"
                    aria-label="Remove from favourites"
                  >
                    <Heart size={14} className="fill-white" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-primary truncate">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-xs text-muted">{vehicle.year} · {vehicle.fuelType} · {vehicle.transmission}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-amber-500">
                      <Star size={12} className="fill-amber-500" />
                      <span className="text-xs font-semibold">{Number(vehicle.averageRating || 0).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-accent tabular-nums">{formatCurrency(vehicle.rentPerDay)}</span>
                      <span className="text-xs text-muted"> / day</span>
                    </div>
                    <Link
                      href={APP_ROUTES.CUSTOMER.VEHICLE_DETAIL(vehicle.id)}
                      className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
                    >
                      View & Book
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MasterPage>
  );
}
