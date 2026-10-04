# Waku Waku

Frontend del catálogo de Waku Waku en Next.js, React y TypeScript. Preparado para publicar en Vercel desde GitHub y conectar después una API en Python.

## Levantar el frontend en tu computadora

Instalar Git y Node.js 22 LTS (versión mínima: 22.13.0). Node.js incluye npm. El repositorio es privado: necesitas acceso para clonarlo.

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

No necesitas Python, una base de datos ni un archivo `.env.local` para probar el frontend: sin configurar una API, se muestran los productos de referencia. El panel no guarda cambios en ese modo. El backend de prueba local no está incluido en este repositorio.

## Validar

```sh
npm run typecheck
npm run test:catalog
npm run lint
npm run build
```

La compilación de producción se ejecuta con `npm start`.

## Publicar en Vercel

Importar el repositorio desde GitHub, seleccionar **Next.js** y **Node.js 22.x**. El proyecto está en la raíz del repositorio. Usar `npm run build` y conservar el directorio de salida predeterminado; no seleccionar `dist`.

## Conectar Python

Sin configurar una API, el catálogo muestra los productos de referencia y el panel de administración es una vista previa sin guardado. Para conectar Python, definir `NEXT_PUBLIC_PRODUCTS_API_URL` con la URL completa del endpoint y volver a desplegar. El backend debe implementar CORS y la autenticación de administración.

Los estilos y assets del catálogo se conservan. No se requieren OpenAI Sites ni Cloudflare para ejecutar este frontend.
