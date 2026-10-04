# Waku Waku


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


## Validar

```sh
npm run typecheck
npm run test:catalog
npm run lint
npm run build
```

La compilación de producción se ejecuta con `npm start`.


