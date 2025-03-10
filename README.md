This is the starter UI template for Kalbe Devstream. This starter template is powered by [Vuexy](https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation/docs/guide/overview).

## Getting Started

Before you begin, ensure [Node.js](https://nodejs.org/) is installed along with the following package manager: [pnpm](https://pnpm.io/).

Stick to the LTS version recommended on the oficial Node.js site. This template is optimized for this version to avoid compatibility issues.

### Dependency Installation

Run the install command:

```bash
pnpm install
```

### Launch Project

Start the project with the start command:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Environment Variables Configuration

1. Copy `.env.example` to `.env`
2. Configure the environment variables according to your project credentials.
3. Use `NEXT_PUBLIC` as the prefix of the environment variable if you need to access them through the client side.
