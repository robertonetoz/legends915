import { reviews, site } from "@/lib/site";
import { FacebookIcon, GoogleIcon, Stars } from "./brand-icons";

export function Reviews() {
  return (
    <section aria-labelledby="reviews-title" className="bg-ink">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-20 lg:px-10 lg:py-32">
        <div>
          <h2 id="reviews-title" className="sr-only">
            Reviews
          </h2>
          <p className="display text-[clamp(7rem,20vw,13rem)] leading-[0.8]">{site.rating.google.score}</p>
          <Stars value={site.rating.google.score} className="mt-4 text-3xl" />
          <p className="mt-4 text-lg text-white/75">
            Average from {site.rating.google.count} reviews on Google.
          </p>
          <div className="mt-8 flex flex-col gap-3 text-[0.95rem]">
            <a
              href={site.rating.google.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 font-semibold hover:text-red"
            >
              <GoogleIcon className="size-5" />
              Read all reviews on Google
            </a>
            <a
              href={site.social.facebook.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 text-white/75 hover:text-white"
            >
              <FacebookIcon className="size-5 text-[#1877F2]" />
              {site.rating.facebookRecommend}% recommend us on Facebook
            </a>
          </div>
        </div>

        <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.author}>
              <figure>
                <span className="display block text-7xl leading-[0.5] text-red" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="mt-2 text-xl leading-relaxed text-white/90">{r.text}</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-sm text-white/60">
                  <Stars value={5} className="text-sm" />
                  {r.author}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
