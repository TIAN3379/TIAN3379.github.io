---
title: Hello Blog
date: 2026-04-12 20:30:00
tags:
  - Hexo
  - C++
categories:
  - 开发
  - 博客搭建
description: 第一篇测试文章，用于验证 Markdown、分类、标签和 GitHub Actions 自动部署流程。
---

<div class="post-page-cover">
  <img src="/images/jiangnan/post-cover.jpg" alt="夜泊水巷文章封面">
</div>

# Hello Blog

这是我的第一篇博客文章。

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
