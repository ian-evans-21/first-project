const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current=temperature_2m,wind_speed_10m";

type OpenMeteoResponse = {
  current_units?: {
    temperature_2m?: string;
    wind_speed_10m?: string;
  };
  current?: {
    temperature_2m?: number;
    wind_speed_10m?: number;
  };
};

export default async function Home() {
  const res = await fetch(OPEN_METEO_URL, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <p className="text-center text-lg text-red-600 dark:text-red-400">
          Could not load weather ({res.status}).
        </p>
      </div>
    );
  }

  const data = (await res.json()) as OpenMeteoResponse;
  const temp = data.current?.temperature_2m;
  const wind = data.current?.wind_speed_10m;
  const tempUnit = data.current_units?.temperature_2m ?? "°C";
  const windUnit = data.current_units?.wind_speed_10m ?? "km/h";

  if (temp === undefined || wind === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <p className="text-center text-lg text-zinc-600 dark:text-zinc-400">
          Weather data is unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <div className="max-w-md text-center">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          London weather
        </h1>
        <dl className="flex flex-col gap-6 text-left sm:flex-row sm:justify-center sm:gap-12 sm:text-center">
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Temperature
            </dt>
            <dd className="mt-1 text-4xl font-semibold tabular-nums text-black dark:text-zinc-50 sm:text-5xl">
              {temp}
              {tempUnit}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Wind speed
            </dt>
            <dd className="mt-1 text-4xl font-semibold tabular-nums text-black dark:text-zinc-50 sm:text-5xl">
              {wind}
              {windUnit}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
