# hexo-filter-variant-images

[![npm version](https://badge.fury.io/js/hexo-filter-variant-images.svg)](https://badge.fury.io/js/hexo-filter-variant-images)

ImageMagick を使用してサムネイルなどを生成するための Hexo プラグインです。

引数を自由自在に設定できるのでサムネイルだけでなく様々な種類の画像を生成可能です。

## 必須環境

* ImageMagick

## インストール

```sh
npm install hexo-filter-variant-images --save
```

## 設定

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
実行コマンド。デフォルト値は `magick`。

また `magick` でのみ動作確認を取っています。

### match
対象とする画像ファイルのパスを glob で指定。

デフォルト値は `**/*.{jpg,gif,png}`

### match_options

minimatch のオプション。デフォルト値は空。

詳細は [minimatch#options](https://github.com/isaacs/minimatch#options)

### exclude
対象から外すファイルのパスを glob で指定。デフォルト値は空。

### priority
フィルタの優先順位を数値で指定。デフォルト値は `5`。

詳細は [Filter | Hexo](https://hexo.io/api/filter.html)

### items

生成するバリエーション。必須項目は `suffix, args`

#### suffix
生成される画像の接尾辞。

#### extension
生成される画像の拡張子。未指定の場合は元の画像と同じ拡張子になります。

#### args
コマンドに渡す引数。`$size` などのように記述すると同一アイテム内の設定を参照できます。

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
