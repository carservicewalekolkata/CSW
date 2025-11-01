import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <div className="min-h-screen bg-slate-50">
              <div className="container-cs py-16 space-y-6">
                <div className="h-7 w-64 animate-pulse rounded bg-slate-200/60" />
                <div className="grid gap-6 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                      <div className="h-24 w-full animate-pulse rounded-lg bg-slate-200/60" />
                      <div className="space-y-2 pt-4">
                        <div className="h-4 w-3/5 animate-pulse rounded bg-slate-200/60" />
                        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200/60" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
