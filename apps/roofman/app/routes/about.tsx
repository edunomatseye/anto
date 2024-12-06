import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createMiddleware, createServerFn } from '@tanstack/start';
import { createClient } from '@supabase/supabase-js';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const count = await getCount();
    return {
      count,
    };
  },
});

export const logger = createMiddleware()
  .validator((data: unknown) => data)
  .server(async ({ next }) => {
    console.log('a');
    return next();
  });

// Rate limiter using a simple in-memory store
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const rateLimitMiddleware = createMiddleware().server(
  async ({ next, data, context }) => {
    const ip = context?.headers?.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 30; // max requests per window

    const current = rateLimit.get(ip) || { count: 0, timestamp: now };

    // Reset if window has passed
    if (now - current.timestamp > windowMs) {
      current.count = 0;
      current.timestamp = now;
    }

    if (current.count >= maxRequests) {
      return await next({
        sendContext: { status: 429, body: { error: 'Too many requests' } },
      });
    }

    // Update rate limit counter
    rateLimit.set(ip, {
      count: current.count + 1,
      timestamp: current.timestamp,
    });

    return next();
  }
);

// Add Supabase client configuration
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Add the server function
const getSupabaseData = createServerFn({ method: 'GET' })
  .middleware([logger, rateLimitMiddleware])
  .validator((data: unknown): unknown => data)
  .handler(async () => {
    try {
      const { data, error } = await supabase
        .from('your_table_name')
        .select('*')
        .limit(10);

      if (error) {
        return {
          status: 400,
          body: { error: error.message },
        };
      }

      return {
        status: 200,
        body: data,
      };
    } catch (err) {
      return {
        status: 500,
        body: { error: 'Internal server error' },
      };
    }
  });

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <button
      type="button"
      onClick={() => {
        getCount().then(() => {
          router.invalidate();
        });
        getSupabaseData().then(() => {
          router.invalidate();
        });
      }}
    >
      Add 1 to {state}?
    </button>
  );
}
async function getCount() {
  throw new Error('Function not implemented.');
}
