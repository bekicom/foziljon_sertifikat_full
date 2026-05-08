# Backend Cert

Express + MongoDB backend for the certificate frontend.

## Setup

1. Install packages:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```env
PORT=5000
DB_CONNECTION=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/sertifikat?retryWrites=true&w=majority
JWT_SECRET=change-this-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=0000
```

3. Create or update the root admin:

```bash
npm run seed:admin
```

4. Start backend:

```bash
npm run dev
```

API base URL:

```text
http://localhost:5000/
```

Default admin after seed:

```text
admin / 0000
```
