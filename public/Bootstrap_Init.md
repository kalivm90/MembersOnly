### To get bootsrtap working along with bootstrap JS and PopperJS follow these instructions in your client or public folder 

```
    npm i bootstrap --save
```

### Now link the static files to app.js in /server, make sure the paths point to node_modules/bootstap && @popperJS 

```
    // Serve Bootstrap CSS file
    app.use('/css', express.static(path.join(__dirname, '../public/node_modules/bootstrap/dist/css')));
    // Serve PopperJS file
    app.use("/popper", express.static(path.join(__dirname, "../public/node_modules/@popperjs/core/dist/umd")))
    // Serve Bootstrap JS file
    app.use('/js', express.static(path.join(__dirname, '../public/node_modules/bootstrap/dist/js')));
```

### Now link them in your layout view (It is important to link popperJS before Bootstap JS)

```
    //- Bootstrap CSS
    <link rel="stylesheet" href="/css/bootstrap.min.css" />
    //- PopperJS file 
    script(src="/popper/popper.min.js")
    //- Bootstrap JS file
    script(src="/js/bootstrap.min.js")
```