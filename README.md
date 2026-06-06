# BeanOpt
A full-stack, lightweight coffee tracking and optimization application for coffee brewing. Designed for dialing the perfect espresso and filter receipies through data-driven experimentation, accurate dosage timing, and extraction logging.

## Features
- **Dosage Tracking** log exact bean weight, grind settings, and water ratios
- **Extraction Timing** Built-in timer mechanics to track precise contact and yield times.
- **Full Recipe Experimentation** compare historical brew data to optimise your workflow.
- **Full-Stack Architecture** Backed by Supabase for secure data storage, real-time sync, and rapid iteration

## Project Structure
This repository is structured as a monorepo containing both the frontend application and the backend database configurations

```text
bean-opt-app/
|--apps/          # Frontend application
|--supabase/      # Migrations, database schemas, and configurations
|--package.json
```
## Getting Started

**Prerequisites**
- Node.js (v18+ recommended)
- Supabase CLI (for local development)
- Docker

### Local Development Setup

**Clone the repository**
`git clone [https://github.com/lookitsmidge/bean-opt-app.git](https://github.com/lookitsmidge/bean-opt-app.git)`

**Install Dependancies**
`npm install`

**Initialize Supabase Locally**
`supabase start`

**Start the application**
`npx nx serve bean-opt-web`


## Supabase Links
[Supabase Studio (Local)](http://172.0.0.1:54323)
[Supabase Mailpit](http://172.0.0.1:54324)


[Project URL](http://172.0.0.1:54321)
[Project URL](http://172.0.0.1:54321/rest/v1)
[Project URL](http://172.0.0.1:54321/graphql/v1)
[Project URL](http://172.0.0.1:54321/functions/v1)
[Storage](http://127.0.0.1:54321/storage/v1/s3)
[MCP](http://172.0.0.1.54321/mcp)

**Database URL**: `postgresql://postgres:postgres@172.0.0.1:54322/postgres



## License 
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
