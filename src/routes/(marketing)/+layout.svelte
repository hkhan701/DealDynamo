<script>
  import "../../app.css"
</script>

<div class="navbar bg-base-100 container mx-auto">
  <div class="flex-1">
    <a class="btn btn-ghost large-case text-xl" href="/">Deal Dynamo</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1 hidden sm:flex font-bold text-lg">
      <!-- <li class="md:mx-4">
        <a
          href="https://github.com/CriticalMoments/CMSaasStarter"
          class="border border-primary">★ us on Github</a
        >
      </li> -->
      <li class="md:mx-2"><a href="/pricing">Pricing 🏷️</a></li>
      <li class="md:mx-2"><a href="/account">Account</a></li>
      <li class="md:mx-2"><a href="/contact_us">Contact Us</a></li>
      <li class="md:mx-2"><a href="/blog">Blog</a></li>
    </ul>
    <div class="dropdown dropdown-end sm:hidden">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          /></svg
        >
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-bold"
      >
        <li><a href="/blog">Blog</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/account">Account</a></li>
        <!-- <li>
          <a
            href="https://github.com/CriticalMoments/CMSaasStarter"
            class="border border-primary">★ us on Github</a
          >
        </li> -->
      </ul>
    </div>
  </div>
</div>

<div class="">
  <slot />
</div>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<!-- FOOTER -->
<div class="flex-grow"></div>
<div class="">
  <div class="border-t max-w-[1000px] mx-auto"></div>

  <footer
    class="footer p-10 gap-x-48 lg:gap-x-64 xl:gap-x-96 place-content-center text-base bg-gray-900 text-white"
  >
    <nav class="grid grid-flow-col gap-4">
      <a class="link link-hover" href="/">Overview</a>
      <a class="link link-hover" href="/pricing">Pricing</a>
      <a class="link link-hover" href="/blog">Blog</a>
      <a class="link link-hover" href="/contact_us">Contact Us</a>
      <a
        class="link link-hover flex items-center"
        href="https://github.com/hkhan701"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 mr-1 fill-current"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.798 8.202 11.385.6.11.793-.26.793-.577 0-.285-.01-1.042-.015-2.048-3.338.724-4.042-1.613-4.042-1.613-.546-1.387-1.332-1.756-1.332-1.756-1.089-.744.083-.729.083-.729 1.205.085 1.838 1.24 1.838 1.24 1.07 1.835 2.805 1.304 3.488.998.108-.777.417-1.305.759-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.312.468-2.384 1.235-3.226-.125-.304-.535-1.526.116-3.176 0 0 1.007-.322 3.3 1.23a11.55 11.55 0 0 1 3-.41c1.019.003 2.043.136 3 .41 2.291-1.553 3.297-1.23 3.297-1.23.652 1.65.242 2.872.117 3.176.77.842 1.233 1.914 1.233 3.226 0 4.608-2.806 5.623-5.476 5.92.43.372.81 1.104.81 2.226 0 1.607-.015 2.898-.015 3.292 0 .32.19.692.8.574C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"
          />
        </svg>
        GitHub
      </a>
    </nav>
    <aside>
      <p>Copyright © 2024 - All right reserved by Deal Dynamo</p>
    </aside>
  </footer>
</div>
