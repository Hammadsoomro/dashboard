import AppShell from "@/components/layout/AppShell";

export default function Dashboard() {
  return (
    <AppShell center>
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {/* New Leads */}
          <section className="rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-6">
          <header className="px-6 pt-5">
            <div className="grid gap-1">
              <div className="text-sm font-semibold">New Leads</div>
              <div className="text-xs text-muted-foreground">Last Month</div>
            </div>
          </header>
          <div className="px-6">
            <div className="aspect-[16/9] min-h-24 flex items-center justify-center">
              <svg className="w-28 h-24" viewBox="0 0 111 96" aria-hidden>
                <g opacity="0.07" fill="var(--color-background, #000)">
                  <rect x="9" y="5" width="8" height="86" rx="4" />
                  <rect x="26" y="5" width="8" height="86" rx="4" />
                  <rect x="43" y="5" width="8" height="86" rx="4" />
                  <rect x="60" y="5" width="8" height="86" rx="4" />
                  <rect x="77" y="5" width="8" height="86" rx="4" />
                  <rect x="94" y="5" width="8" height="86" rx="4" />
                </g>
                <g>
                  <rect
                    x="9"
                    y="44.09"
                    width="8"
                    height="46.91"
                    fill="var(--color-newLeads)"
                  />
                  <rect
                    x="26"
                    y="53.86"
                    width="8"
                    height="37.14"
                    fill="var(--color-newLeads)"
                  />
                  <rect
                    x="43"
                    y="67.55"
                    width="8"
                    height="23.45"
                    fill="var(--color-newLeads)"
                  />
                  <rect
                    x="60"
                    y="51.91"
                    width="8"
                    height="39.09"
                    fill="var(--color-newLeads)"
                  />
                  <rect
                    x="77"
                    y="32.36"
                    width="8"
                    height="58.64"
                    fill="var(--color-newLeads)"
                  />
                  <rect
                    x="94"
                    y="48"
                    width="8"
                    height="43"
                    fill="var(--color-newLeads)"
                  />
                </g>
                <g>
                  <rect
                    x="9"
                    y="28.45"
                    width="8"
                    height="15.64"
                    rx="4"
                    fill="var(--color-disqualified)"
                  />
                  <rect
                    x="26"
                    y="42.14"
                    width="8"
                    height="11.73"
                    rx="4"
                    fill="var(--color-disqualified)"
                  />
                  <rect
                    x="43"
                    y="58.95"
                    width="8"
                    height="8.60"
                    rx="4"
                    fill="var(--color-disqualified)"
                  />
                  <rect
                    x="60"
                    y="38.23"
                    width="8"
                    height="13.68"
                    rx="4"
                    fill="var(--color-disqualified)"
                  />
                  <rect
                    x="77"
                    y="5"
                    width="8"
                    height="27.36"
                    rx="4"
                    fill="var(--color-disqualified)"
                  />
                  <rect
                    x="94"
                    y="24.55"
                    width="8"
                    height="23.45"
                    rx="4"
                    fill="var(--color-disqualified)"
                  />
                </g>
              </svg>
            </div>
          </div>
          <footer className="px-6 pb-5 flex items-center justify-between">
            <span className="text-xl font-semibold tabular-nums">635</span>
            <span className="text-sm font-medium text-[oklch(0.723_0.219_149.579)]">
              +54.6%
            </span>
          </footer>
          </section>

          {/* Proposals Sent */}
          <section className="rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-6 overflow-hidden">
          <header className="px-6 pt-5">
            <div className="grid gap-1">
              <div className="text-sm font-semibold">Proposals Sent</div>
              <div className="text-xs text-muted-foreground">Last Month</div>
            </div>
          </header>
          <div className="px-6">
            <div className="aspect-[16/9] min-h-24 flex items-center justify-center">
              <svg className="w-40 h-36" viewBox="0 0 159 156" aria-hidden>
                <path
                  d="M0,88.05C10.6,61.625,21.2,35.2,31.8,35.2C42.4,35.2,53,110.7,63.6,110.7C74.2,110.7,84.8,20.1,95.4,20.1C106,20.1,116.6,72.95,127.2,72.95C137.8,72.95,148.4,61.625,159,50.3L159,156L0,156Z"
                  fill="var(--color-proposalsSent)"
                  opacity=".05"
                />
                <path
                  d="M0,88.05C10.6,61.625,21.2,35.2,31.8,35.2C42.4,35.2,53,110.7,63.6,110.7C74.2,110.7,84.8,20.1,95.4,20.1C106,20.1,116.6,72.95,127.2,72.95C137.8,72.95,148.4,61.625,159,50.3"
                  fill="none"
                  stroke="var(--color-proposalsSent)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          </section>

          {/* Revenue */}
          <section className="rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <div className="px-6 pt-5">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[color:oklab(0.723_-0.18885_0.110891_/0.1)] px-2 py-1 text-[oklch(0.723_0.219_149.579)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
              </svg>
            </div>
          </div>
          <div className="px-6">
            <div className="text-sm font-semibold mb-1">Revenue</div>
            <div className="text-xs text-muted-foreground">Last 6 Months</div>
          </div>
          <div className="px-6 text-2xl font-semibold tabular-nums">
            $56,050
          </div>
          <div className="px-6 mb-5">
            <span className="inline-flex rounded-lg bg-[color:oklab(0.723_-0.18885_0.110891_/0.1)] text-[oklch(0.723_0.219_149.579)] px-2 py-1 text-xs font-medium">
              +22.2%
            </span>
          </div>
          </section>

          {/* Projects Won */}
          <section className="rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <div className="px-6 pt-5">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[color:oklab(0.6368_0.18782_0.0889076_/0.1)] px-2 py-1 text-[oklch(0.6368_0.2078_25.3313)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                <path d="M12 18V6"></path>
              </svg>
            </div>
          </div>
          <div className="px-6">
            <div className="text-sm font-semibold mb-1">Projects Won</div>
            <div className="text-xs text-muted-foreground">Last 6 Months</div>
          </div>
          <div className="px-6 text-2xl font-semibold tabular-nums">136</div>
          <div className="px-6 mb-5">
            <span className="inline-flex rounded-lg bg-[color:oklab(0.6368_0.18782_0.0889076_/0.1)] text-[oklch(0.6368_0.2078_25.3313)] px-2 py-1 text-xs font-medium">
              -2.5%
            </span>
          </div>
        </section>

        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-6">
          {/* Revenue Growth (YTD) */}
          <section className="col-span-6 lg:col-span-2 rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <header className="px-6 pt-5">
            <div className="text-sm font-semibold">Revenue Growth</div>
            <div className="text-xs text-muted-foreground">
              Year to Date (YTD)
            </div>
          </header>
          <div className="px-6">
            <div className="aspect-[16/9] flex items-center justify-center">
              <svg
                className="w-full max-w-md h-24"
                viewBox="0 0 288 96"
                aria-hidden
              >
                <path
                  d="M10,45.192C18.121,43.675,26.242,42.158,34.364,42.158C42.485,42.158,50.606,44.054,58.727,44.054C66.848,44.054,74.97,40.578,83.091,39.125C91.212,37.672,99.333,36.344,107.455,35.333C115.576,34.322,123.697,33.058,131.818,33.058C139.939,33.058,148.061,36.092,156.182,36.092C164.303,36.092,172.424,33.627,180.545,32.3C188.667,30.973,196.788,29.772,204.909,28.129C213.03,26.486,221.152,25.285,229.273,22.442C237.394,19.598,245.515,11.067,253.636,11.067C261.758,11.067,269.879,17.513,278,23.958"
                  stroke="var(--color-revenue)"
                  strokeWidth="2"
                  fill="none"
                />
                {Array.from({ length: 12 }).map((_, i) => {
                  const xs = [
                    10, 34.36, 58.72, 83.09, 107.45, 131.81, 156.18, 180.54,
                    204.9, 229.27, 253.63, 278,
                  ];
                  const ys = [
                    45.19, 42.16, 44.05, 39.12, 35.33, 33.05, 36.09, 32.3,
                    28.12, 22.44, 11.06, 23.95,
                  ];
                  return (
                    <circle
                      key={i}
                      r={3}
                      cx={xs[i]}
                      cy={ys[i]}
                      stroke="var(--color-revenue)"
                      strokeWidth="2"
                      fill="#fff"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="px-6 pb-5 text-sm text-muted-foreground">
            +35% growth since last year
          </div>
        </section>

        {/* Leads by Source */}
        <section className="col-span-6 lg:col-span-2 rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <header className="px-6 pt-5 text-sm font-semibold">
            Leads by Source
          </header>
          <div className="px-6">
            <div className="aspect-[16/9] max-h-48 flex items-center justify-center relative">
              <svg
                className="w-full max-w-lg h-48"
                viewBox="0 0 359 192"
                aria-hidden
              >
                <g>
                  <path
                    d="M 177.4,96 A90,90,0,0,0,43.01,20.18"
                    fill="var(--color-website)"
                    stroke="#fff"
                  />
                  <path
                    d="M 39.48,27.63 A90,90,0,0,0,8.03,129.66"
                    fill="var(--color-referral)"
                    stroke="#fff"
                  />
                  <path
                    d="M 14.7,134.5 A90,90,0,0,0,91.94,186"
                    fill="var(--color-social)"
                    stroke="#fff"
                  />
                  <path
                    d="M 98.9,181.58 A90,90,0,0,0,158.34,156.26"
                    fill="var(--color-cold)"
                    stroke="#fff"
                  />
                  <path
                    d="M 159.77,148.14 A90,90,0,0,0,181.2,103.32"
                    fill="var(--color-other)"
                    stroke="#fff"
                  />
                </g>
              </svg>
              <div className="absolute right-4 top-6 text-xs space-y-2">
                {[
                  { c: "var(--color-website)", l: "Website", v: 170 },
                  { c: "var(--color-referral)", l: "Referral", v: 105 },
                  { c: "var(--color-social)", l: "Social Media", v: 90 },
                  { c: "var(--color-cold)", l: "Cold Outreach", v: 62 },
                  { c: "var(--color-other)", l: "Other", v: 48 },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="flex items-center justify-between w-36"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: x.c as string }}
                      />{" "}
                      {x.l}
                    </span>
                    <span className="tabular-nums">{x.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 pb-5 flex gap-2">
            <button className="flex-1 rounded-xl border border-black/5 bg-white shadow-sm px-3 py-2 text-sm font-medium">
              View Full Report
            </button>
            <button className="flex-1 rounded-xl border border-black/5 bg-white shadow-sm px-3 py-2 text-sm font-medium">
              Download CSV
            </button>
          </div>
        </section>

        {/* Project Revenue vs Target */}
        <section className="col-span-6 lg:col-span-3 rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <header className="px-6 pt-5 text-sm font-semibold">
            Project Revenue vs. Target
          </header>
          <div className="px-6">
            <div className="aspect-[16/9] max-h-52">
              <div className="space-y-3">
                {[
                  ["MVP Development", 82000, 90000],
                  ["Consultation", 48000, 65000],
                  ["Framer Sites", 34000, 45000],
                  ["DevOps Support", 77000, 90000],
                  ["LLM Training", 68000, 80000],
                  ["Product Launch", 52000, 70000],
                ].map(([name, actual, target], i) => {
                  const pct = Number(actual) / Number(target);
                  return (
                    <div
                      key={String(name)}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
                    >
                      <div className="text-xs text-muted-foreground">
                        {String(name)}
                      </div>
                      <div className="h-6 rounded-lg overflow-hidden bg-black/5">
                        <div
                          className="h-full bg-[var(--color-actual)]"
                          style={{ width: `${pct * 100}%` }}
                        />
                      </div>
                      <div className="text-xs tabular-nums text-muted-foreground">
                        {Number(actual).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="px-6 pb-5 text-xs text-muted-foreground">
            Average progress: 78% · 2 projects above target
          </div>
        </section>

        {/* Sales Pipeline */}
        <section className="col-span-6 lg:col-span-3 rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <header className="px-6 pt-5 text-sm font-semibold">
            Sales Pipeline
          </header>
          <div className="px-6">
            <div className="space-y-4">
              {[
                ["Leads", 680, "var(--chart-1)"],
                ["Qualified", 480, "var(--chart-2)"],
                ["Proposal Sent", 210, "var(--chart-3)"],
                ["Negotiation", 120, "var(--chart-4)"],
                ["Won", 45, "var(--chart-5)"],
              ].map(([label, val, color], idx) => (
                <div
                  key={String(label)}
                  className="grid grid-cols-[1fr_auto] items-center gap-2"
                >
                  <div
                    className="h-10 rounded-lg border-2 border-white"
                    style={{
                      background: String(color),
                      width: `${100 - idx * 16}%`,
                    }}
                  />
                  <div className="text-sm tabular-nums">{val as number}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 pb-5 text-xs text-muted-foreground">
            Leads increased by 18.2% since last month.
          </div>
        </section>

        {/* Sales by Region */}
        <section className="col-span-6 lg:col-span-3 rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <header className="px-6 pt-5">
            <div className="text-sm font-semibold">Sales by Region</div>
            <div className="text-xs font-medium tabular-nums">$123,500</div>
          </header>
          <div className="px-6 space-y-4">
            {[
              [
                "North America",
                0.31,
                "$37,800",
                "-3.2%",
                "text-[oklch(0.6368_0.2078_25.3313)]",
              ],
              [
                "Europe",
                0.34,
                "$40,100",
                "+9.4%",
                "text-[oklch(0.723_0.219_149.579)]",
              ],
              [
                "Asia Pacific",
                0.26,
                "$30,950",
                "+12.8%",
                "text-[oklch(0.723_0.219_149.579)]",
              ],
              [
                "Latin America",
                0.07,
                "$12,200",
                "-1.7%",
                "text-[oklch(0.6368_0.2078_25.3313)]",
              ],
              [
                "Middle East & Africa",
                0.02,
                "$2,450",
                "+6.0%",
                "text-[oklch(0.723_0.219_149.579)]",
              ],
            ].map(([name, pct, val, delta, color]) => (
              <div key={String(name)}>
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-sm font-medium">{String(name)}</div>
                  <div className="flex items-baseline gap-1 text-sm font-semibold">
                    <span>{String(val)}</span>
                    <span className={`text-xs font-medium ${String(color)}`}>
                      {String(delta)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full rounded-full bg-[color:oklab(0.5106_0.0279066_-0.228401_/0.2)] overflow-hidden">
                    <div
                      className="h-full bg-[oklch(0.5106_0.2301_276.966)]"
                      style={{ width: `${Number(pct) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums">
                    {Math.round(Number(pct) * 100)}
                  </span>
                  <span className="text-xs">%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 pb-5 text-xs text-muted-foreground flex items-center gap-2">
            <span>5 regions tracked</span>•<span>3 regions growing</span>
          </div>
        </section>

        {/* Action Items */}
        <section className="col-span-6 lg:col-span-3 rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <header className="px-6 pt-5 text-sm font-semibold">
            Action Items
          </header>
          <div className="px-6 pb-5">
            <ul className="space-y-4">
              <li className="rounded-xl border border-black/10 p-3">
                <div className="flex items-center gap-2">
                  <button
                    className="h-4 w-4 rounded border border-black/20"
                    aria-checked={false}
                    role="checkbox"
                  />
                  <span className="text-sm font-medium">Send kickoff docs</span>
                  <span className="ml-auto text-xs rounded-lg px-2 py-0.5 bg-[color:oklab(0.6368_0.18782_0.0889076_/0.2)] text-[oklch(0.6368_0.2078_25.3313)]">
                    High
                  </span>
                </div>
                <div className="mt-2 text-xs font-medium text-muted-foreground">
                  Send onboarding documents and timeline
                </div>
                <div className="mt-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  Due today
                </div>
              </li>
              <li className="rounded-xl border border-black/10 p-3">
                <div className="flex items-center gap-2">
                  <button
                    className="h-4 w-4 rounded border border-black/20 bg-[oklch(0.5106_0.2301_276.966)]"
                    aria-checked
                    role="checkbox"
                  />
                  <span className="text-sm font-medium">
                    Demo call for SaaS MVP
                  </span>
                  <span className="ml-auto text-xs rounded-lg px-2 py-0.5 bg-[color:oklab(0.795_0.0126846_0.183562_/0.2)] text-[oklch(0.795_0.184_86.047)]">
                    Medium
                  </span>
                </div>
                <div className="mt-2 text-xs font-medium text-muted-foreground">
                  Book Zoom call with client
                </div>
                <div className="mt-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  Due tomorrow
                </div>
              </li>
              <li className="rounded-xl border border-black/10 p-3">
                <div className="flex items-center gap-2">
                  <button
                    className="h-4 w-4 rounded border border-black/20"
                    aria-checked={false}
                    role="checkbox"
                  />
                  <span className="text-sm font-medium">Update case study</span>
                  <span className="ml-auto text-xs rounded-lg px-2 py-0.5 bg-[color:oklab(0.723_-0.18885_0.110891_/0.2)] text-[oklch(0.723_0.219_149.579)]">
                    Low
                  </span>
                </div>
                <div className="mt-2 text-xs font-medium text-muted-foreground">
                  Add latest LLM project
                </div>
                <div className="mt-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  Due this week
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Recent Leads Table */}
        <section className="col-span-6 rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-4">
          <header className="px-6 pt-5">
            <div className="text-sm font-semibold">Recent Leads</div>
            <div className="text-xs text-muted-foreground">
              Track and manage your latest leads and their status.
            </div>
          </header>
          <div className="px-4 pb-5 overflow-hidden">
            <div className="overflow-x-auto rounded-xl border border-black/5">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 sticky top-0">
                  <tr>
                    <th className="h-10 w-8"></th>
                    <th className="text-left px-2">Ref</th>
                    <th className="text-left px-2">Name</th>
                    <th className="text-left px-2">Company</th>
                    <th className="text-left px-2">Status</th>
                    <th className="text-left px-2">Source</th>
                    <th className="text-left px-2">Last Activity</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "L-1012",
                      "Guillermo Rauch",
                      "Vercel",
                      "Qualified",
                      "Website",
                      "30m ago",
                    ],
                    [
                      "L-1018",
                      "Nizzy",
                      "Mail0",
                      "Qualified",
                      "Website",
                      "35m ago",
                    ],
                    [
                      "L-1005",
                      "Sahaj",
                      "Tweakcn",
                      "Negotiation",
                      "Website",
                      "1h ago",
                    ],
                    [
                      "L-1001",
                      "Shadcn",
                      "Shadcn/ui",
                      "Qualified",
                      "Website",
                      "2h ago",
                    ],
                    [
                      "L-1003",
                      "Sam Altman",
                      "OpenAI",
                      "Proposal Sent",
                      "Social Media",
                      "4h ago",
                    ],
                  ].map(([ref, name, company, status, source, last]) => (
                    <tr key={String(ref)} className="border-t border-black/5">
                      <td className="h-10 w-8"></td>
                      <td className="px-2 tabular-nums">{String(ref)}</td>
                      <td className="px-2">{String(name)}</td>
                      <td className="px-2">{String(company)}</td>
                      <td className="px-2">
                        <span className="inline-flex items-center rounded-lg bg-[oklch(0.7038_0.123_182.503)] text-white px-2 py-0.5 text-xs font-medium">
                          {String(status)}
                        </span>
                      </td>
                      <td className="px-2">
                        <span className="inline-flex items-center rounded-lg border border-black/10 px-2 py-0.5 text-xs font-medium">
                          {String(source)}
                        </span>
                      </td>
                      <td className="px-2 text-muted-foreground tabular-nums">
                        {String(last)}
                      </td>
                      <td className="w-8"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                0 of 15 row(s) selected.
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-xl border border-black/5 bg-white px-3 py-1.5 text-sm shadow-sm"
                  disabled
                >
                  First
                </button>
                <button
                  className="rounded-xl border border-black/5 bg-white px-3 py-1.5 text-sm shadow-sm"
                  disabled
                >
                  Prev
                </button>
                <div className="text-sm">
                  Page <span className="tabular-nums">1</span> of{" "}
                  <span className="tabular-nums">2</span>
                </div>
                <button className="rounded-xl border border-black/5 bg-white px-3 py-1.5 text-sm shadow-sm">
                  Next
                </button>
                <button className="rounded-xl border border-black/5 bg-white px-3 py-1.5 text-sm shadow-sm">
                  Last
                </button>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </AppShell>
  );
}
