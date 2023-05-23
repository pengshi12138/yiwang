---
title: 测试——md文件和系统描述
md_type: true
date: 2002/6/18
---
欢迎来到忆往图片分享，该网站为图片分享网站，主要具有两种图片分享的方式，一种是md文件格式分享图片同时可以进行文字记录操作，一种是使用图片瀑布流方式展示所有的图片

## 文章创作快速开始

### 创建文章md文件操作

可以使用代码方式如下

```bash
hexo new "毕业照"
```

也可以进行手动创建的的方式，存放在目录 `/source/_post` 文件目录下面

全部是用的是md文件进行记录操作，其中主要的md文件上的参数定义需要添加如下内容进行定义

* title 表示的文章题
* md_type 表示该文章类型是md格式 还是 图片瀑布流格式
* date 表示日期
* cover_image 表示这篇文章的展示图片
* img_js 表示的是存放的图片信息路径

```
---
title: 测试md文件
md_type: true
date: 2002/6/18
cover_image: https://t7.baidu.com/it/u=3676218341,3686214618&fm=193&f=GIF
img_js: "/data/毕业照.js"
---
```

### 配置图片瀑布流js文件

进行手动创建文件夹，统一存放在 `/source/data` 文件夹下面

```js
const imgData = [
  {
      "height": 160,
      "compression": "https://t7.baidu.com/it/u=3676218341,3686214618&fm=193&f=GIF",
      "width": 263,
      "original": "https://t7.baidu.com/it/u=3676218341,3686214618&fm=193&f=GIF",
      "title": "人生",
      "description": "不过如此"
  },
  {
      "height": 185,
      "compression": "/images/毕业照/DSC_1088.JPG",
      "width": 150,
      "title": "人生",
      "description": "不过如此",
      "original": "/images/毕业照/DSC_1088.JPG"
  }
]
```

相关参数定义

* heigth 表示图片高度
* width 表示图片宽度
* compression表示图片的缩略图
* original 表示图片的原始图片
* title 表示图片的主题
* description 表示图片的相关描述
