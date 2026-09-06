// Bridges: the muted command/response pairs between sections that make the
// transcript read as one continuous session. Keyed by the section they
// lead INTO. Each step is { cmd, out: [lines] }. They are decorative for
// assistive tech (the container is aria-hidden) — nothing here is
// information that isn't elsewhere on the page.

/* global __BUILD_SHA__ */
const SHA = typeof __BUILD_SHA__ === "string" ? __BUILD_SHA__ : "local";

export const BRIDGES = {
  experience: [
    {
      cmd: "juju models",
      out: [
        "Controller: minh",
        "",
        "Model        Cloud/Region        Type        Status     Access  Last connection",
        "login*       microk8s/localhost  kubernetes  available  admin   just now",
        "experience   microk8s/localhost  kubernetes  available  admin   never connected",
        "projects     microk8s/localhost  kubernetes  available  admin   never connected",
        "opensource   microk8s/localhost  kubernetes  available  admin   never connected",
        "skills       microk8s/localhost  kubernetes  available  admin   never connected",
        "contact      microk8s/localhost  kubernetes  available  admin   never connected",
      ],
    },
    { cmd: "juju switch experience", out: ["minh:admin/login -> minh:admin/experience"] },
  ],
  projects: [
    { cmd: "cd ~/projects && ls", out: ["main.tf  modules/  outputs.tf  terraform.tfvars"] },
    {
      cmd: "terraform init",
      out: [
        "Initializing modules...",
        "- projects in modules/projects",
        "Initializing provider plugins...",
        "",
        "Terraform has been successfully initialized!",
      ],
    },
  ],
  opensource: [
    { cmd: "cd ~/src && ls", out: ["charmcraft/  rockcraft/  haproxy-operator/  gopkg-charmed/"] },
    {
      cmd: "gh auth status",
      out: ["github.com", "  ✓ Logged in to github.com account minh (keyring)", "  - Active account: true", "  - Token scopes: 'repo', 'read:org', 'workflow'"],
    },
  ],
  skills: [
    {
      cmd: "git log --oneline -3",
      out: [`${SHA} (HEAD -> main) update portfolio`, "1fb8bf0 Update to fix image not rendering", "6be3a51 update portfolio"],
    },
    { cmd: "gh run list --workflow=deploy.yml --limit 1", out: [`completed  success  build-minh  main  #${SHA}`] },
  ],
  contact: [{ cmd: "juju status contact --format=short", out: ["- contact/0: waiting (not exposed)"] }],
  transcript: [
    {
      cmd: "cd ~ && history | tail -n 6",
      out: [
        "  1  juju login",
        "  2  juju status --model experience",
        "  3  terraform plan -target=module.projects",
        "  4  gh search prs --author=@me --owner=canonical --merged",
        "  5  gh run view build-minh",
        "  6  juju expose contact",
      ],
    },
    { cmd: "# your turn — the prompt below is live", out: [] },
  ],
};
