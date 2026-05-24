# GitLab Mirror Setup

## Prerequisites

1. Create a private repository on GitLab named `awcms-micro`
2. Generate an SSH key pair for the mirror action

## Setup Steps

### 1. Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "github-mirror@awcms-micro" -f ~/.ssh/gitlab_mirror -N ""
```

### 2. Add Deploy Key to GitLab

1. Go to your GitLab repo → Settings → Repository → Deploy Keys
2. Add a new deploy key with the **public** key (`~/.ssh/gitlab_mirror.pub`)
3. Grant **Write access**

### 3. Add Secrets to GitHub

Go to GitHub repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret Name | Value |
|---|---|
| `GITLAB_USERNAME` | Your GitLab username |
| `GITLAB_REPO_NAME` | `awcms-micro` |
| `GITLAB_SSH_PRIVATE_KEY` | Content of `~/.ssh/gitlab_mirror` (private key) |

### 4. Initial Push

Do an initial push to create the repo on GitLab:

```bash
git remote add gitlab git@gitlab.com:YOUR_USERNAME/awcms-micro.git
git push --all gitlab
git push --tags gitlab
```

### 5. Verify

After the next push to GitHub, check the Actions tab to see the mirror workflow run.

## Troubleshooting

- **Permission denied**: Verify deploy key has write access
- **Repository not found**: Check `GITLAB_USERNAME` and `GITLAB_REPO_NAME`
- **Key format error**: Ensure the private key is in OpenSSH format
