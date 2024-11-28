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

const getPokemon = createServerFn({ method: 'GET' })
  .middleware([logger])
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
