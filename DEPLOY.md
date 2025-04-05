# GitHub Pages 部署指南

## 问题解决

您的项目已经成功修复了GitHub Pages部署问题。主要修改是在`vite.config.ts`文件中添加了`base: './'`配置，这使得构建后的资源引用使用相对路径而不是绝对路径。

## 部署步骤

### 方法一：手动部署

1. 运行构建命令生成dist目录：
   ```
   npm run build
   ```

2. 将dist目录中的所有文件上传到您的GitHub仓库的以下位置之一：
   - 如果您使用的是`username.github.io`仓库，请上传到主分支
   - 如果您使用的是其他名称的仓库，请上传到`gh-pages`分支或在仓库设置中指定的分支

3. 在GitHub仓库设置中，确保GitHub Pages的源设置正确：
   - 转到仓库 -> Settings -> Pages
   - 在Source部分，选择正确的分支（通常是`gh-pages`或`main`）和文件夹（通常是`/(root)`）

### 方法二：使用gh-pages工具自动部署（推荐）

1. 安装gh-pages包：
   ```
   npm install --save-dev gh-pages
   ```

2. 在package.json文件中添加部署脚本：
   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc -b && vite build",
     "lint": "eslint .",
     "preview": "vite preview",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. 运行部署命令：
   ```
   npm run deploy
   ```

4. 这将自动构建项目并将dist目录推送到gh-pages分支

## 访问您的网站

部署完成后，您的网站应该可以通过以下URL访问：

- 如果是用户/组织网站：`https://username.github.io/`
- 如果是项目网站：`https://username.github.io/repository-name/`

## 常见问题

1. **404错误**：确保您的仓库设置中GitHub Pages的源设置正确
2. **资源加载失败**：确保vite.config.ts中的base配置正确
3. **部署延迟**：GitHub Pages部署可能需要几分钟才能生效
4. **自定义域名**：如果您使用自定义域名，请在GitHub Pages设置中配置

## 注意事项

- 每次更新网站内容时，都需要重新构建并部署
- 确保您的仓库是公开的，否则GitHub Pages将无法访问（除非您有GitHub Pro账户）
- 如果您的项目使用了路由（如React Router），可能需要额外配置才能在GitHub Pages上正常工作