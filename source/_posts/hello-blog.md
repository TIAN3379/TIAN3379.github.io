---
title: 第一篇水巷测试文章
date: 2026-04-12 20:30:00
tags:
  - Hexo
  - C++
categories:
  - 开发
  - 博客搭建
description: 用于验证 Markdown、分类、标签、图片与 GitHub Actions 自动部署流程的测试文章。
---

<div class="post-page-cover">
  <img src="/images/jiangnan/post-cover.jpg" alt="夜泊水巷文章封面">
</div>

# 第一篇水巷测试文章

这是博客的第一篇测试文章，用来验证内容结构、代码高亮、图片资源与自动部署链路是否都正常。

## Markdown 列表

- 支持 Markdown 写作
- 支持标签与分类
- 支持自动部署

## C 代码示例

```c
#include <stdio.h>

int main(void) {
    printf("Hello, Blog!\n");
    return 0;
}
```

## C++ 代码示例

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (int n : nums) {
        std::cout << n << std::endl;
    }
    return 0;
}
```

## Bash 代码示例

```bash
hexo clean
hexo generate
git add .
git commit -m "docs: add first post"
git push origin main
```
