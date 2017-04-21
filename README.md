# hexo-filter-variant-images

[![npm version](https://badge.fury.io/js/hexo-filter-variant-images.svg)](https://badge.fury.io/js/hexo-filter-variant-images)

It is a Hexo plug-in for generating thumbnails etc. using ImageMagick.

Since you can freely set arguments, you can generate various kinds of images as well as thumbnails.

## Required environment

* ImageMagick

## Installation

```sh
npm install hexo-filter-variant-images --save
```

## Configuration

```yml
# variant images
variant_images:
  cmd: 'magick'
  match: '**/*.{jpg,gif,png}'
  match_options:
    debug: true
  exclude: 'static/**/*'
  priority: 5
  items:
    - suffix: '@preview'
      extension: 'gif'
      size: '20x20'
      blur: '1.5'
      posterize: '16'
      args: '-resize $size -blur $blur -posterize $posterize'
    - suffix: '@small'
      size: '120x120'
      args: '-resize $size'
```

### cmd
Run command. The default value is `magick`.

Also I am only checking the operation with `magick`.

### match
Specify the path of the target image file with glob.

The default value is `**/*.{jpg,gif,png}`

### match_options

Option for minimatch. The default value is empty.

For details [Minimatch#options](https://github.com/isaacs/minimatch#options)

### exclude
Specify the path of the file to be excluded with glob. The default value is empty.

### priority
Specify the priority of the filter by numerical value. The default value is `5`.

For details [Filter | Hexo](https://hexo.io/api/filter.html)

### items

Variations to generate. Required items are `suffix, args`

#### suffix
Suffix of the generated image.

#### extension
Extension of the generated image. If unspecified, it will have the same extension as the original image.

#### args
Arguments to pass to the command. If you write it like `$size`, you can refer to the settings in the same item.

```yml
items:
  - suffix: '@preview'
    extension: 'gif'
    size: '20x20'
    blur: '1.5'
    posterize: '16'
    args: '-resize $size -blur $blur -posterize $posterize'
  - suffix: '@small'
    args: '-resize 120x120'
```
