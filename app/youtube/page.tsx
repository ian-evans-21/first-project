const CHANNEL_ID = "UCddiUEpeqJcYeBxX1IVBKvQ";

type YouTubeChannelsResponse = {
  items?: Array<{
    snippet?: { title?: string };
    statistics?: {
      subscriberCount?: string;
      viewCount?: string;
    };
  }>;
  error?: {
    code?: number;
    message?: string;
  };
};

function formatCount(value: string | undefined): string {
  if (!value) return "—";
  try {
    return new Intl.NumberFormat().format(BigInt(value));
  } catch {
    return value;
  }
}

export default async function YouTubePage() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <div className="max-w-lg text-center">
          <h1 className="mb-3 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            YouTube channel stats
          </h1>
          <p className="text-center text-lg text-red-600 dark:text-red-400">
            Missing <code className="font-mono">YOUTUBE_API_KEY</code> in{" "}
            <code className="font-mono">process.env</code>.
          </p>
        </div>
      </div>
    );
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("id", CHANNEL_ID);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <p className="text-center text-lg text-red-600 dark:text-red-400">
          Could not load YouTube stats ({res.status}).
        </p>
      </div>
    );
  }

  const data = (await res.json()) as YouTubeChannelsResponse;
  const channel = data.items?.[0];
  const title = channel?.snippet?.title ?? "Unknown channel";
  const subscribers = channel?.statistics?.subscriberCount;
  const views = channel?.statistics?.viewCount;

  if (!channel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <div className="max-w-lg text-center">
          <h1 className="mb-3 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            YouTube channel stats
          </h1>
          <p className="text-center text-lg text-zinc-600 dark:text-zinc-400">
            No channel data returned.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <div className="max-w-2xl text-center">
        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {title}
        </h1>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Channel statistics (YouTube Data API v3)
        </p>

        <dl className="flex flex-col gap-6 text-left sm:flex-row sm:justify-center sm:gap-12 sm:text-center">
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Subscribers
            </dt>
            <dd className="mt-1 text-4xl font-semibold tabular-nums text-black dark:text-zinc-50 sm:text-5xl">
              {formatCount(subscribers)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total views
            </dt>
            <dd className="mt-1 text-4xl font-semibold tabular-nums text-black dark:text-zinc-50 sm:text-5xl">
              {formatCount(views)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

