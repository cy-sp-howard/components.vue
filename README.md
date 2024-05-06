# MGT

node 18、
vue 3
pnpm

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
### layout 

- 單一element路由元件皆為```.route-block```
- ```.route-block```子element的```form```、```.rk-tab```,有限制寬度等css
- 如需分塊 ( 多個```.route-block``` )，需將元件最頂層設為```.block-wrapper```，子層設為```.route-block```
- 複數element路由元件，預設無任何class及樣式
