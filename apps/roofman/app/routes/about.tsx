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

const getMagicalBlackbok = createServerFn({ method: 'GET' })
  .middleware([logger])
  .validator((data: unknown) => data)
  .handler(async ({ data, context, method }) => {
    const response = await fetch('https://placeholderdata.typicode.com/posts', {
      cache: 'no-store',
    });
    return await response.json();
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
        getMagicalBlackbok().then(() => {
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
