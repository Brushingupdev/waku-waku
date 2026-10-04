# Waku Waku

Frontend del catálogo de Waku Waku en Next.js, React y TypeScript. Preparado para publicar en Vercel desde GitHub y conectar después una API en Python.

## Ejecutar

Node.js 22 LTS. Desde esta carpeta:

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:5173.

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
