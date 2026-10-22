# DigitalOcean Portfolio Deployment Guide
# =========================================

## 1. SSH into your droplet

```bash
ssh root@<tu-ip>
```

## 2. Navigate to the portfolio directory

```bash
cd /root/portfolio
```

## 3. Build and start the container

```bash
docker-compose up -d --build
```

## 4. Verify the container is running

```bash
docker-compose ps
docker logs portfolio-web
```

## 5. Add to Caddy

Edit your existing Caddyfile (usually in the NEXA or Autoquotation project,
or wherever you have Caddy running):

```
repetto-a.com {
    reverse_proxy portfolio-web:3000
}
```

Then reload Caddy:

```bash
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

Or if Caddy is running as a standalone container:

```bash
docker compose -f /path/to/caddy/docker-compose.yml restart caddy
```

## 6. Ensure firewall allows only 80/443

```bash
ufw status
# Should show:
# 80/tcp   ALLOW
# 443/tcp  ALLOW
# 22/tcp   ALLOW (or your SSH port)
# Everything else DENY
```

## 7. DNS

Make sure `repetto-a.com` (and `www.repetto-a.com` if desired) points to your
DigitalOcean droplet's IP address.

## Environment Variables

Copy `.env.example` to `.env` and fill in the real values:

```bash
cp .env.example .env
nano .env  # or vim .env
```

| Variable | Value |
|----------|-------|
| SMTP_HOST | smtp-relay.brevo.com |
| SMTP_PORT | 2525 |
| SMTP_USER | a981b4001@smtp-brevo.com |
| SMTP_PASSWORD | (your Brevo SMTP key) |
| SMTP_FROM | testme1405@gmail.com |
| CADDY_NETWORK | `nexa_nexa` on your current droplet |

> If `587` times out from your droplet, Brevo's `2525` port is a good fallback.

> **Never commit `.env` to Git.** It is already in `.dockerignore`.

## Troubleshooting

If the contact form fails, check Brevo:
1. Log in to https://app.brevo.com
2. Go to Settings → SMTP & API → SMTP
3. Copy your SMTP key (or generate a new one)
4. Put that key in `.env` as `SMTP_PASSWORD`
5. Run `docker-compose up -d` to reload the container

## Useful Commands

```bash
# Rebuild after code changes
docker-compose up -d --build

# View logs
docker-compose logs -f portfolio-web

# Stop
docker-compose down

# Restart
docker-compose restart portfolio-web
```
