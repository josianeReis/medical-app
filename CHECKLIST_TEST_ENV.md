# Checklist - Test Environment Go/No-Go

## 1) Isolation
- [ ] New repo is used (`josianeReis/medical-app`)
- [ ] New Supabase project (no old data imported)
- [ ] New Railway project
- [ ] New Vercel project
- [ ] Old secrets are not reused

## 2) Safety
- [ ] `DISABLE_OUTBOUND_EMAIL=true` set in Railway `auth`
- [ ] No outbound email observed in logs
- [ ] No legacy webhook/notification integration configured

## 3) Infra health
- [ ] Auth health endpoint returns 200
- [ ] Management health endpoint returns 200
- [ ] Frontend deploy succeeded
- [ ] Frontend can call auth and management

## 4) Functional smoke test
- [ ] Login page loads
- [ ] Basic auth flow works
- [ ] At least 3 core flows tested successfully
- [ ] No blocking runtime error in browser console

## 5) Cost control
- [ ] Railway alert at USD 10
- [ ] Railway hard limit at USD 15

## 6) Handoff data
- [ ] AUTH_PUBLIC_URL documented
- [ ] MANAGEMENT_PUBLIC_URL documented
- [ ] VERCEL_PUBLIC_URL documented
- [ ] DB host/database documented (password masked)
