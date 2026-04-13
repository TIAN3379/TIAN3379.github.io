# reimu-template

<img alt="theme version" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FD-Sketon%2Freimu-template%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.dependencies.hexo-theme-reimu&label=theme version">


Template for [hexo-theme-reimu](https://github.com/D-Sketon/hexo-theme-reimu)

## Usage

```bash
git clone https://github.com/D-Sketon/reimu-template
cd reimu-template
npm install
npm run server
```

## Features

The following features are pre-supported:

- support LaTeX (@reimujs/hexo-renderer-markdown-it-plus)
- support mermaid (hexo-filter-mermaid-diagrams)
- support git (hexo-deployer-git)
- support rss (hexo-generator-feed)
- support Algolia search (@reimujs/hexo-algoliasearch)

## How to use

The configuration of Hexo is in `_config.yml`  
The configuration of Reimu is in `_config.reimu.yml`  
You can modify the configuration according to your needs

## Personal Blog Starter

This local copy has been adjusted into a reusable personal blog starter:

- starter site metadata in `_config.yml`
- starter theme and social config in `_config.reimu.yml`
- starter `about` and `links` pages
- starter first post
- GitHub Pages workflow in `.github/workflows/deploy-pages.yml`

## Deploy To GitHub Pages

1. Create a GitHub repository for your blog.
2. Push this project to that repository.
3. Update `_config.yml`:
   - `url: https://your-github-username.github.io` for a user site
   - or `url: https://your-github-username.github.io/repository-name` for a project site
4. In GitHub repository settings, open `Pages`.
5. Set the source to `GitHub Actions`.
6. Push to `main` and the workflow will build and deploy the site.
