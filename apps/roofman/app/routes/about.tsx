import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
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
      }}
    >
      Add 1 to {state}?
    </button>
  );
}
async function getCount() {
  throw new Error('Function not implemented.');
}
