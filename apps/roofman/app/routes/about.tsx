import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createMiddleware, createServerFn } from '@tanstack/start';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
});

export const logger = createMiddleware()
  .validator((data: unknown) => data)
  .server(async ({ next }) => {
    console.log('a');
    return next();
  });

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonResponse {
  count: number;
  results: Pokemon[];
}

const loggingMiddleware = createMiddleware().server(async ({ next, data }) => {
  console.log('Request received:', data);
  const result = await next();
  console.log('Response processed:', result);
  return result;
});

// Rate limiter using a simple in-memory store
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const rateLimitMiddleware = createMiddleware().server(
  async ({ next, context }) => {
    console.log('Request received:', context);
    const ip = context?.request?.headers?.get('x-forwarded-for') || 'unknown';
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

const getPokemon = createServerFn({ method: 'GET' })
  .middleware([logger, rateLimitMiddleware])
  .validator((data: unknown): unknown => data)
  .handler(async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
    const data: PokemonResponse = await response.json();
    return { status: 200, body: data };
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
        getPokemon().then(() => {
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
