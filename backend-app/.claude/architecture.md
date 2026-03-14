## Architecture

NestJS backend running on port **3050** (overridable via `PORT` env var).

**Request flow:** `main.ts` bootstraps `AppModule`, which wires controllers and services. Each feature should live in its own module imported by `AppModule`.

**NestJS patterns used:**
- Dependency injection via constructor (not property injection)
- `@Module` / `@Controller` / `@Injectable` decorators
- `reflect-metadata` required for decorator support (imported in `main.ts`)

**Code style:**
- Single quotes, trailing commas (Prettier)
- `no-explicit-any` disabled — but floating promises and unsafe arguments are warned
- TypeScript target ES2023, `moduleResolution: nodenext`
