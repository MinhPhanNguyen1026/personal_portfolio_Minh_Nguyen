// Open-source contributions, rendered like `gh repo view`.
//
//   fullName       owner/repo on GitHub (the live star count is fetched
//                  from the API; `stars` below is the fallback)
//   what           one sentence on what the project is, in plain words
//   why            why it matters in the platform — the connective tissue
//   tags           the vocabulary of the project
//   contributions  what Minh worked on, in plain words
//   highlights     [{ label, url, kind: "commit" | "pr" }] — the receipts,
//                  rendered as links. TODO(minh): charmcraft, rockcraft,
//                  and haproxy-operator still need theirs.

export const OPEN_SOURCE = [
  {
    fullName: "canonical/charmcraft",
    name: "Charmcraft",
    url: "https://github.com/canonical/charmcraft",
    stars: 90,
    language: "Python",
    what: "The CLI that initialises, builds, packs, and publishes charms — the operators Juju deploys — to Charmhub.",
    why: "Every charm in the ecosystem goes through it, including the 12-factor app profiles that turn a web app into a charm.",
    tags: ["charms", "Charmhub", "craft-parts", "12-factor"],
    contributions: [],
    highlights: [],
  },
  {
    fullName: "canonical/rockcraft",
    name: "Rockcraft",
    url: "https://github.com/canonical/rockcraft",
    stars: 92,
    language: "Python",
    what: "Builds rocks — OCI container images based on Ubuntu — from the same parts language Snapcraft and Charmcraft use.",
    why: "It is how Canonical produces hardened, minimal images for the workloads its charms run on Kubernetes.",
    tags: ["OCI", "Ubuntu", "craft-parts", "Pebble"],
    contributions: [],
    highlights: [],
  },
  {
    fullName: "canonical/haproxy-operator",
    name: "HAProxy charm",
    url: "https://github.com/canonical/haproxy-operator",
    stars: 3,
    language: "Python",
    what: "The Juju charm for HAProxy: deploys and operates the load balancer, and wires it to other charms through relations.",
    why: "Ingress and TLS termination for charmed stacks, driven declaratively by Juju rather than by hand.",
    tags: ["HAProxy", "Juju", "ingress", "TLS"],
    contributions: [],
    highlights: [],
  },
  {
    fullName: "canonical/gopkg-charmed",
    name: "gopkg.in, charmed",
    url: "https://github.com/canonical/gopkg-charmed",
    stars: 1,
    language: "Python",
    what: "The gopkg.in versioned-import-path service as a Go app, a rock, and a charm, built with the 12-factor go-framework.",
    why: "A real production Go service packaged end to end the Canonical way — app → rock → charm — and a reference for doing the same.",
    tags: ["Go", "12-factor", "rock", "charm", "MicroK8s"],
    contributions: [
      "Bootstrapped the repository: stripped the charm template down to the org's bot and automation config, then imported the gopkg.in service source with build, vet, and tests passing.",
      "Moved runtime configuration from flags to environment variables so the app satisfies 12-Factor III, as the go-framework charm expects.",
      "Wrote the charm deployment guide with a runbook verified on a first MicroK8s deploy: LXD init, arm64 platform and model constraints, ingress rewrite settings, pod triage.",
    ],
    highlights: [
      { kind: "commit", label: "Import gopkg.in source into app/", url: "https://github.com/canonical/gopkg-charmed/commit/19fcfbc97bbde18ed0a1f17ecfeaad0d565d0a90" },
      { kind: "commit", label: "Config from env vars per 12-Factor", url: "https://github.com/canonical/gopkg-charmed/commit/777819495858e011d0a8acce1a90ba884238662b" },
      { kind: "commit", label: "Charm deployment guide + verified runbook", url: "https://github.com/canonical/gopkg-charmed/commit/26d4d8ea3d091f57f348a02a2dca62c9dde34f26" },
    ],
  },
];
