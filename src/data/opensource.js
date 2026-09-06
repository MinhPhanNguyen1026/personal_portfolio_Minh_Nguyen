// Open-source contributions, rendered like `gh repo view`. Minh's
// open-source work is under the GitHub account below; everything here was
// read from that account's pull requests and commits.
//
//   fullName       owner/repo on GitHub (the live star count is fetched
//                  from the API; `stars` below is the fallback)
//   role           "maintainer" | "contributor"
//   prs            { merged, open } — PR counts by minulo at time of writing
//   what           one sentence on what the project is, in plain words
//   why            why it matters in the platform — the connective tissue
//   tags           the vocabulary of the project
//   contributions  what Minh did, 2–4 resume-style bullets
//   highlights     [{ kind, number, label, url, state }] — the receipts

export const OSS_ACCOUNT = { login: "minulo", url: "https://github.com/minulo" };

export const OPEN_SOURCE = [
  {
    fullName: "canonical/gopkg-charmed",
    name: "gopkg.in, charmed",
    url: "https://github.com/canonical/gopkg-charmed",
    stars: 1,
    language: "Python",
    role: "maintainer",
    prs: { merged: 14, open: 5 },
    what: "The gopkg.in versioned-import-path service as a Go app, a rock, and a charm, built with the 12-factor go-framework.",
    why: "A production Go service packaged end to end the Canonical way — app → rock → charm → Terraform — and a reference for doing the same.",
    tags: ["Go", "12-factor", "rock", "charm", "Terraform", "MicroK8s"],
    contributions: [
      "Created the repository and drove it from empty to a deployable charm: stripped the template, imported the gopkg.in service, and charmed it with the go-framework extension.",
      "Tests and quality gates: charm unit tests on ops.testing, an integration suite against real Juju + MicroK8s, strict mypy, an 85% coverage floor, bandit.",
      "CI/CD on charm-ci: an amd64/arm64 build matrix for charm and rock, spread orchestration, LXD + Juju provisioning, weekly integration runs.",
      "A Terraform module for deploying the app with the Juju provider and ingress integration; a Sphinx docs pipeline in review.",
    ],
    highlights: [
      { kind: "pr", number: 7, label: "Charm the gopkg.in app with the go-framework extension", url: "https://github.com/canonical/gopkg-charmed/pull/7", state: "merged" },
      { kind: "pr", number: 13, label: "Wire integration tests into the charm-ci pipeline", url: "https://github.com/canonical/gopkg-charmed/pull/13", state: "merged" },
      { kind: "pr", number: 12, label: "Migrate unit tests from Harness to ops.testing", url: "https://github.com/canonical/gopkg-charmed/pull/12", state: "merged" },
      { kind: "pr", number: 20, label: "Terraform deployment module", url: "https://github.com/canonical/gopkg-charmed/pull/20", state: "merged" },
      { kind: "pr", number: 32, label: "Layer 1 Terraform deployment with ingress-configurator", url: "https://github.com/canonical/gopkg-charmed/pull/32", state: "merged" },
      { kind: "pr", number: 25, label: "Sphinx docs scaffold (layer 1 of 3)", url: "https://github.com/canonical/gopkg-charmed/pull/25", state: "open" },
    ],
  },
  {
    fullName: "canonical/haproxy-operator",
    name: "HAProxy charm",
    url: "https://github.com/canonical/haproxy-operator",
    stars: 3,
    language: "Python",
    role: "contributor",
    prs: { merged: 1, open: 2 },
    what: "The Juju charm for HAProxy: deploys and operates the load balancer, and wires it to other charms through relations.",
    why: "Ingress and TLS termination for charmed stacks, driven declaratively by Juju rather than by hand.",
    tags: ["HAProxy", "Juju", "ingress", "TLS"],
    contributions: [
      "Added the get-configuration Juju action, so operators can inspect HAProxy's effective configuration for debugging without shell access to the unit.",
      "Integration-test work on the OAuth/SPOE path and a test refactor, in review.",
    ],
    highlights: [
      { kind: "pr", number: 609, label: "feat: add get-configuration action", url: "https://github.com/canonical/haproxy-operator/pull/609", state: "merged" },
      { kind: "pr", number: 646, label: "Refactor the integration test", url: "https://github.com/canonical/haproxy-operator/pull/646", state: "open" },
    ],
  },
  {
    fullName: "canonical/charmcraft",
    name: "Charmcraft",
    url: "https://github.com/canonical/charmcraft",
    stars: 90,
    language: "Python",
    role: "contributor",
    prs: { merged: 1, open: 0 },
    what: "The CLI that initialises, builds, packs, and publishes charms — the operators Juju deploys — to Charmhub.",
    why: "Every charm in the ecosystem goes through it, including the 12-factor app profiles that turn a web app into a charm.",
    tags: ["charms", "Charmhub", "craft-parts", "12-factor"],
    contributions: [
      "Fixed the Django tutorial's file captions to match the real django-admin startproject layout — the one the tutorial's spread test actually exercises.",
    ],
    highlights: [
      { kind: "pr", number: 2805, label: "docs: fix caption paths in the Django tutorial", url: "https://github.com/canonical/charmcraft/pull/2805", state: "merged" },
    ],
  },
  {
    fullName: "canonical/rockcraft",
    name: "Rockcraft",
    url: "https://github.com/canonical/rockcraft",
    stars: 92,
    language: "Python",
    role: "contributor",
    prs: { merged: 0, open: 1 },
    what: "Builds rocks — OCI container images based on Ubuntu — from the same parts language Snapcraft and Charmcraft use.",
    why: "It is how Canonical produces hardened, minimal images for the workloads its charms run on Kubernetes.",
    tags: ["OCI", "Ubuntu", "craft-parts", "Pebble"],
    contributions: ["Making the tutorials architecture-agnostic, so they hold on arm64 as well as amd64 — in review."],
    highlights: [
      { kind: "pr", number: 1289, label: "docs: make tutorials architecture-agnostic", url: "https://github.com/canonical/rockcraft/pull/1289", state: "open" },
    ],
  },
  {
    fullName: "canonical/indico-operator",
    name: "Indico charm",
    url: "https://github.com/canonical/indico-operator",
    stars: 0,
    language: "Python",
    role: "contributor",
    prs: { merged: 2, open: 0 },
    what: "The Juju charm for Indico, CERN's event-management platform, as run by Canonical.",
    why: "One of the IS Charms team's production services, and the same repository conventions gopkg-charmed adopted.",
    tags: ["Indico", "Juju", "automation"],
    contributions: [
      "Skip the bot PR approval when the PR author is the approving identity, closing a self-approval gap in the automation.",
      "Fixed redirected and broken documentation links.",
    ],
    highlights: [
      { kind: "pr", number: 783, label: "Skip bot PR approval when the author is the approving identity", url: "https://github.com/canonical/indico-operator/pull/783", state: "merged" },
      { kind: "pr", number: 778, label: "fix: update redirected and broken doc links", url: "https://github.com/canonical/indico-operator/pull/778", state: "merged" },
    ],
  },
];
