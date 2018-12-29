## 一、 图片转pdf
```shell
convert src.jpg des.pdf
```
src.jpg为需要转换的图片文件名，jpeg、png等格式同理；des.pdf为输出的pdf文件名

---
## 二、 pdf合并
```shell
gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile=des.pdf src1.pdf src2.pdf
```
des.pdf合并后的pdf文件名，src1.pdf和src2.pdf为需要合并的pdf文件名
