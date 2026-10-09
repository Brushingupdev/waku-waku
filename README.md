# Waku Waku

El catálogo usa la estructura de Commerce Service: `series_id`, el objeto `series`, `collection`, `edition` y `height`. Las asociaciones con los pósters se mantienen en `lib/product-presentation.ts`, fuera del producto del API. Los filtros comparan IDs de series, aunque sus nombres coincidan. Solo los datos antiguos de referencia se convierten a esta estructura al cargarlos.


## Levantar el frontend en tu computadora

Instalar Git y Node.js 22 LTS (versión mínima: 22.13.0). Node.js incluye npm.

La primera vez, ejecutar:

```sh
git clone https://github.com/Brushingupdev/waku-waku.git
cd waku-waku
npm ci
npm run dev
```

Si ya descargaste o clonaste el proyecto, abrir una terminal en la carpeta que contiene `package.json` y ejecutar:

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:5173. El panel de vista previa está en http://127.0.0.1:5173/admin. Para detener el servidor, presionar `Ctrl+C` en la terminal.

En los siguientes arranques basta con `npm run dev`. Después de descargar cambios que modifican las dependencias, volver a ejecutar `npm ci`.

Se recomienda npm porque el repositorio incluye `package-lock.json`. Si prefieres pnpm y ya lo tienes instalado, puedes ejecutar `pnpm install` y `pnpm dev`; esto genera un archivo de bloqueo propio de pnpm.


## Validar

```sh
npm run typecheck
npm run test:catalog
npm run lint
npm run build
```

La compilación de producción se ejecuta con `npm start`.



## Conectar Commerce Service

Crear `.env.local` en la raíz del frontend:

```dotenv
NEXT_PUBLIC_COMMERCE_API_URL=http://127.0.0.1:8000/api
```

Reiniciar `npm run dev`. El backend debe permitir `http://127.0.0.1:5173` mediante CORS y tener su conexión a Mongo configurada en su propio `.env`.

El frontend consulta `GET /api/products`, adapta los campos estructurados y conserva los UUID. Las secciones aún no migradas mantienen los productos de referencia. Si falla la API, se muestra el catálogo de respaldo con un aviso.

Las imágenes se descargan desde las URLs que entrega la API. Los recursos públicos de Supabase ya preparados se activan cuando la API devuelve las URLs correspondientes. La migración de URLs en Mongo sigue pendiente.


### Series y proxy opcional

La misma configuración de Commerce Service también consulta `GET /api/series` para obtener el orden y `logo_url` de la franja de animes. Si falla, conserva las series y logos de referencia.

Como alternativa a la URL directa, configura `API_BASE_URL=http://127.0.0.1:8000` y `NEXT_PUBLIC_API_URL=/api`, dejando `NEXT_PUBLIC_COMMERCE_API_URL` vacía. Next.js reenviará `/api/*` al backend. Reinicia el servidor después de modificar esas variables. Sin `API_BASE_URL`, el proxy está desactivado.
